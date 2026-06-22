// One-time helper to get a Google Calendar refresh token for a personal Gmail.
//
// Prereqs (Google Cloud Console):
//   1. Create a project, enable the "Google Calendar API".
//   2. Configure OAuth consent screen (External, add yourself as a Test user).
//   3. Create an OAuth Client ID of type "Web application".
//      Add redirect URI:  http://localhost:5055/callback
//   4. Put the client id/secret below or in env, then run:  node scripts/google-oauth.mjs
//
// It prints GOOGLE_REFRESH_TOKEN — paste it into your .env.
import http from 'node:http'
import { exec } from 'node:child_process'

// Load .env if present (Node 20.12+/24). Plain `node` doesn't do this on its own.
try { process.loadEnvFile('.env') } catch { /* no .env — fall back to argv/env */ }

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.argv[2]
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || process.argv[3]
const REDIRECT = 'http://localhost:5055/callback'
// Full calendar scope: needed for both free/busy lookups and event+Meet creation.
const SCOPE = 'https://www.googleapis.com/auth/calendar'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Usage: GOOGLE_CLIENT_ID=… GOOGLE_CLIENT_SECRET=… node scripts/google-oauth.mjs')
  console.error('   or: node scripts/google-oauth.mjs <client_id> <client_secret>')
  process.exit(1)
}

const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT,
  response_type: 'code',
  scope: SCOPE,
  access_type: 'offline',
  prompt: 'consent',
})

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/callback')) { res.end('waiting…'); return }
  const code = new URL(req.url, REDIRECT).searchParams.get('code')
  if (!code) { res.end('No code.'); return }

  const tok = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT, grant_type: 'authorization_code',
    }),
  }).then(r => r.json())

  if (tok.refresh_token) {
    console.log('\n✅ Add this to your .env:\n')
    console.log(`GOOGLE_REFRESH_TOKEN=${tok.refresh_token}\n`)
    res.end('Done — check your terminal, you can close this tab.')
  } else {
    console.error('\n❌ No refresh_token returned:', tok)
    res.end('No refresh token — see terminal.')
  }
  server.close()
})

server.listen(5055, () => {
  console.log('\nOpen this URL and grant access:\n\n' + authUrl + '\n')
  exec(`xdg-open "${authUrl}" || open "${authUrl}"`, () => {})
})
