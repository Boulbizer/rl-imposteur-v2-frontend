// e2e/game.e2e.mjs
// Test de bout en bout dans un vrai navigateur (Chromium via Playwright) :
// 4 joueurs dans 4 sessions isolées jouent une manche complète.
//
// Lancer : npm run test:e2e
// Prérequis : le dépôt backend cloné à côté (../rl-imposteur-v2-backend)
// ou BACKEND_DIR=/chemin/vers/backend.

import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import assert from 'node:assert/strict'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const BACKEND_DIR = process.env.BACKEND_DIR || path.resolve(ROOT, '../rl-imposteur-v2-backend')
const SHOTS = process.env.E2E_SCREENSHOTS || path.join(ROOT, 'e2e', 'screenshots')
const BACK_PORT = 3101
const FRONT_PORT = 5273
const FRONT = `http://localhost:${FRONT_PORT}`

mkdirSync(SHOTS, { recursive: true })

function start(cmd, args, cwd, env, readyText) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { cwd, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    const timer = setTimeout(() => reject(new Error(`${cmd} n'a pas démarré :\n${out}`)), 30_000)
    const onData = d => {
      // Retire les codes couleur ANSI (Vite colore sa sortie en CI)
      out += String(d).replace(/\x1b\[[0-9;]*m/g, '')
      if (out.includes(readyText)) { clearTimeout(timer); resolve(proc) }
    }
    proc.stdout.on('data', onData)
    proc.stderr.on('data', onData)
    proc.on('exit', code => reject(new Error(`${cmd} arrêté (${code}) :\n${out}`)))
  })
}

let step = 0
async function check(name, fn) {
  step++
  process.stdout.write(`  ${step}. ${name} … `)
  await fn()
  console.log('ok')
}

const procs = []
let browser
let failed = false

try {
  // Backend lancé depuis ses sources TypeScript, avec un stockage fichier
  // pour que les salles survivent au redémarrage simulé plus bas.
  const roomsFile = path.join(mkdtempSync(path.join(tmpdir(), 'rl-e2e-')), 'rooms.json')
  const startBackend = () => start(process.execPath, ['--import', 'tsx', 'src/server.ts'], BACKEND_DIR, {
    PORT: String(BACK_PORT), FRONTEND_URL: FRONT, SUPABASE_URL: '', SUPABASE_SERVICE_KEY: '',
    ROOMS_FILE: roomsFile, GRACE_PERIOD_MS: '30000', MISSIONS_PROVIDER: 'offline',
  }, 'Serveur lancé')
  let backend = await startBackend()
  procs.push(backend)
  procs.push(await start(process.execPath, [path.join(ROOT, 'node_modules/vite/bin/vite.js'), '--port', String(FRONT_PORT), '--strictPort'], ROOT, {
    VITE_BACKEND_URL: `http://localhost:${BACK_PORT}`,
  }, 'Local:'))

  browser = await chromium.launch()
  const names = ['Hote', 'Bob', 'Chloe', 'Dax']
  const players = []
  for (const name of names) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 860 } })
    const page = await context.newPage()
    const frames = []
    // On capture TOUS les messages WebSocket reçus pour détecter une fuite
    page.on('websocket', ws => ws.on('framereceived', f => frames.push(String(f.payload))))
    // Socket.IO commence en long-polling HTTP avant de passer en WebSocket :
    // ces réponses comptent aussi comme messages reçus
    page.on('response', async res => {
      if (!res.url().includes('/socket.io/') || res.request().method() !== 'GET') return
      try { frames.push(await res.text()) } catch { /* réponse interrompue */ }
    })
    page.on('pageerror', err => { console.error(`\n[${name}] erreur JS : ${err.message}`); failed = true })
    players.push({ name, context, page, frames })
  }
  const [host, ...guests] = players
  const shot = (p, label) => p.page.screenshot({ path: path.join(SHOTS, `${String(step).padStart(2, '0')}-${label}-${p.name}.png`) })
  const dismissCookies = async p => {
    const btn = p.page.getByRole('button', { name: 'Refuser' })
    if (await btn.isVisible().catch(() => false)) await btn.click()
  }

  let code
  console.log('Scénario : une manche complète à 4 joueurs')

  await check("l'hôte crée une salle avec un code à 4 lettres", async () => {
    await host.page.goto(FRONT)
    await dismissCookies(host)
    await host.page.getByPlaceholder('Ex : SonicBoom_77').fill(host.name)
    await host.page.getByRole('button', { name: 'Créer une partie' }).click()
    await host.page.waitForURL(/\/room\/[A-Z]{4}$/)
    code = host.page.url().split('/').pop()
    assert.match(code, /^[ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/)
    await host.page.getByText('Lancer la partie').or(host.page.getByText("En attente d'un autre joueur…")).waitFor()
    await shot(host, 'lobby')
  })

  await check('3 invités rejoignent via le lien (code en minuscules accepté)', async () => {
    for (const g of guests) {
      await g.page.goto(`${FRONT}/room/${code.toLowerCase()}`)
      await dismissCookies(g)
      await g.page.getByPlaceholder('Ex : SupraNova_RL').fill(g.name)
      await g.page.getByRole('button', { name: 'Rejoindre la salle' }).click()
      await g.page.getByText('En attente que').waitFor()
    }
    for (const n of names) await host.page.locator('.player-slot', { hasText: n }).first().waitFor()
    await shot(host, 'lobby-complet')
  })

  await check("un intrus ne peut pas prendre le pseudo d'un joueur", async () => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(`${FRONT}/room/${code}`)
    await page.getByPlaceholder('Ex : SupraNova_RL').fill('bob')
    await page.getByRole('button', { name: 'Rejoindre la salle' }).click()
    await page.getByText('Ce pseudo est déjà pris dans cette salle').waitFor()
    await page.screenshot({ path: path.join(SHOTS, `${String(step).padStart(2, '0')}-intrus-refuse.png`) })
    await context.close()
  })

  let impostor
  await check("réglages : l'hôte choisit le mode, les invités le voient sans pouvoir le changer", async () => {
    await host.page.getByTestId('setting-mode').selectOption('hoops')
    for (const g of guests) {
      await g.page.waitForFunction(() => document.querySelector('[data-testid="setting-mode"]')?.value === 'hoops')
      assert.equal(await g.page.getByTestId('setting-mode').isDisabled(), true)
    }
    await shot(host, 'reglages')
  })

  await check("l'hôte lance la partie : 1 imposteur, 1 bouffon, chacun avec sa mission secrète", async () => {
    await host.page.getByRole('button', { name: 'Lancer la partie' }).click()
    for (const p of players) {
      await p.page.waitForURL(/\/playing$/)
      p.roleTitle = (await p.page.getByTestId('role-title').innerText()).trim()
      p.isImpostor = p.roleTitle === "Tu es l'Imposteur"
      p.mission = (await p.page.getByTestId('mission-text').innerText()).trim()
      assert.ok(p.mission.length > 10 && !/MISSION/i.test(p.mission), `${p.name} : mission illisible « ${p.mission} »`)
    }
    const titles = players.map(p => p.roleTitle).sort()
    assert.deepEqual(titles, ["Tu es Équipier", "Tu es Équipier", "Tu es l'Imposteur", 'Tu es le Bouffon'].sort())
    impostor = players.find(p => p.isImpostor)
    await impostor.page.waitForTimeout(800) // fin de l'animation d'apparition avant la capture
    await shot(impostor, 'role-imposteur')
    await shot(players.find(p => p.roleTitle === 'Tu es le Bouffon'), 'role-bouffon')
  })

  await check("aucun message reçu ne révèle l'imposteur, les rôles ou les missions des autres", async () => {
    for (const p of players) {
      for (const frame of p.frames) {
        assert.ok(!frame.includes('impostorId'), `${p.name} a reçu : ${frame.slice(0, 200)}`)
        assert.ok(!frame.includes('"roles"') && !frame.includes('"missions"'), `${p.name} a reçu les rôles de tous`)
        for (const other of players) {
          if (other !== p) assert.ok(!frame.includes(other.mission), `${p.name} a reçu la mission de ${other.name}`)
        }
      }
      const stored = await p.page.evaluate(() => JSON.stringify(sessionStorage))
      assert.ok(!stored.includes('impostorId'), `sessionStorage de ${p.name} contient impostorId`)
    }
  })

  await check('un joueur qui recharge la page retrouve son rôle (jeton de session)', async () => {
    const g = guests[1]
    await g.page.reload()
    await g.page.getByText(g.roleTitle).waitFor()
    await g.page.getByText(g.mission).waitFor()
    await host.page.waitForTimeout(500)
  })

  await check('le serveur plante en pleine partie : tout le monde revient tout seul', async () => {
    const before = players.map(p => p.frames.length)
    backend.kill('SIGKILL')
    await new Promise(r => setTimeout(r, 1000))
    backend = await startBackend()
    procs.push(backend)
    // Chaque navigateur doit se reconnecter et être reconnu grâce à son jeton
    for (const [i, p] of players.entries()) {
      const deadline = Date.now() + 20_000
      while (!p.frames.slice(before[i]).some(f => f.includes('"room:rejoined"'))) {
        if (Date.now() > deadline) throw new Error(`${p.name} ne s'est pas reconnecté. Reçu : ${p.frames.slice(before[i]).map(f => f.slice(0, 120)).join(' | ')} — URL ${p.page.url()}`)
        await p.page.waitForTimeout(200)
      }
      await p.page.getByText(p.roleTitle).waitFor()
    }
  })

  await check('fin du match : débat, une accusation visible par tous', async () => {
    await host.page.getByRole('button', { name: 'Fin du match' }).click()
    for (const p of players) {
      await p.page.waitForURL(/\/debate$/)
      await p.page.getByTestId('countdown').waitFor()
    }
    const accuser = players.find(p => p !== impostor)
    await accuser.page.getByTestId('accuse-target').filter({ hasText: impostor.name }).click()
    await accuser.page.getByPlaceholder(/Pourquoi/).fill('Il a raté trois dégagements')
    await accuser.page.getByRole('button', { name: `Accuser ${impostor.name}` }).click()
    for (const p of players) {
      await p.page.getByTestId('accusation').filter({ hasText: 'Il a raté trois dégagements' }).waitFor()
    }
    await shot(host, 'debat')
  })

  await check("l'hôte ouvre le vote : tout le monde vote", async () => {
    await host.page.getByRole('button', { name: 'Passer au vote maintenant' }).click()
    for (const p of players) await p.page.waitForURL(/\/vote$/)
    await shot(host, 'vote')
    for (const p of players) {
      // Les équipiers votent pour l'imposteur, l'imposteur accuse l'hôte (ou Bob)
      const target = p === impostor ? (p === host ? 'Bob' : 'Hote') : impostor.name
      await p.page.locator('.vote-card', { hasText: target }).click()
      await p.page.getByRole('button', { name: 'Confirmer mon vote' }).click()
    }
  })

  await check("révélation : l'imposteur est démasqué chez tous les joueurs", async () => {
    for (const p of players) {
      await p.page.waitForURL(/\/reveal$/, { timeout: 15_000 }).catch(err => {
        const last = p.frames.slice(-8).map(f => f.slice(0, 160)).join('\n      ')
        throw new Error(`${p.name} bloqué sur ${p.page.url()}\n      ${last}\n${err.message}`)
      })
      await p.page.getByText(`${impostor.name} !`).first().waitFor()
    }
    await shot(host, 'revelation')
  })

  await check('récapitulatif : rôles et missions de chacun révélés', async () => {
    for (const p of players) {
      await p.page.getByText('Rôles et missions').waitFor({ timeout: 15_000 })
      assert.equal(await p.page.getByTestId('role-recap').count(), players.length)
      for (const other of players) await p.page.getByText(other.mission).first().waitFor()
    }
    await host.page.getByText('Rôles et missions').scrollIntoViewIfNeeded()
    await shot(host, 'recap')
  })

  await check("seul l'hôte passe à la manche suivante, tout le monde revient au lobby", async () => {
    assert.equal(await guests[0].page.getByText('▶ Manche suivante').count(), 0)
    await host.page.getByText('▶ Manche suivante').click()
    for (const p of players) {
      await p.page.waitForURL(new RegExp(`/room/${code}$`))
      await p.page.getByText('Manche 2').first().waitFor()
    }
    await shot(host, 'manche-2')
  })

  console.log(`\n✅ ${step} vérifications réussies. Captures : ${SHOTS}`)
} catch (err) {
  failed = true
  console.error('\n❌ ÉCHEC :', err.message)
} finally {
  await browser?.close()
  procs.forEach(p => p.kill())
  process.exit(failed ? 1 : 0)
}
