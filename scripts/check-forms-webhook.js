// scripts/check-forms-webhook.js
//
// Diagnoses why contact messages are not reaching the Tordilla Forms app.
// Reads FORMS_WEBHOOK_URL / FORMS_WEBHOOK_TOKEN the same way the running
// server does (environment first, then the .env file in the working
// directory), then calls the webhook with GET, which returns the expected
// field list and records no entry.
//
// It has no dependencies and reads nothing but .env, so it can be piped
// straight into the container, where the environment that actually matters is:
//
//   docker exec -i tordilla-web node < scripts/check-forms-webhook.js
//
// Run it there rather than on a workstation: both the source IP and the name
// resolution differ inside the container, and those are exactly what fail.

const fs = require('fs');
const os = require('os');
const path = require('path');
const dns = require('dns').promises;

function readEnvFile(file) {
  const values = {};
  if (!fs.existsSync(file)) return values;

  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    values[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
  }

  return values;
}

/**
 * The address the Forms app compares against its allow list is rarely the one
 * this process holds:
 *
 * - Docker rewrites the source on the way out, so a call from a container
 *   arrives as a bridge address (172.x) rather than the host's LAN IP.
 * - forms.tordilla.ir is fronted by nginx on 192.168.101.10, which proxies to
 *   192.168.101.11:3000 and sets X-Forwarded-For. The Forms app trusts that
 *   header, so going through the proxy hands it the caller behind it — the
 *   bridge address again — while calling the app directly lets it match on the
 *   real peer, this host's LAN IP.
 *
 * Printing the local addresses and the resolved target makes it obvious which
 * of those paths is in play before reading the response.
 */
async function reportAddresses(url) {
  const local = Object.entries(os.networkInterfaces())
    .flatMap(([name, addrs]) => (addrs || []).map((addr) => ({ name, ...addr })))
    .filter((addr) => addr.family === 'IPv4' && !addr.internal)
    .map((addr) => `${addr.address} (${addr.name})`);

  console.log('local IPv4:', local.join(', ') || '(none)');

  try {
    const { hostname } = new URL(url);
    const resolved = await dns.lookup(hostname);
    console.log(`${hostname} resolves here to:`, resolved.address);
  } catch (error) {
    console.log('could not resolve the webhook host:', error.message);
  }
}

/** Enough of the token to compare against the one in the Forms app, no more. */
function mask(token) {
  if (!token) return '(missing)';
  const [keyId] = token.split('.');
  return `${keyId}.…${token.slice(-6)} (${token.length} chars)`;
}

async function main() {
  const envFile = path.join(process.cwd(), '.env');
  const fromFile = readEnvFile(envFile);
  const url = process.env.FORMS_WEBHOOK_URL || fromFile.FORMS_WEBHOOK_URL;
  const token = process.env.FORMS_WEBHOOK_TOKEN || fromFile.FORMS_WEBHOOK_TOKEN;

  console.log('working directory:', process.cwd());
  console.log('.env file:', fs.existsSync(envFile) ? envFile : `${envFile} (not found)`);
  console.log('FORMS_WEBHOOK_URL:', url || '(missing)');
  console.log('FORMS_WEBHOOK_TOKEN:', mask(token));

  if (!url || !token) {
    console.log('\nRESULT: not configured — the server skips the webhook and only saves messages locally.');
    console.log('Add both variables to .env.docker and rebuild the image.');
    process.exit(1);
  }

  await reportAddresses(url);
  console.log('\nCalling GET', url, '…');

  let response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.log('RESULT: the request never completed:', error.message);
    console.log('This server cannot reach the Forms host — check the port, DNS and routing.');
    process.exit(1);
  }

  const body = await response.text();
  console.log('HTTP', response.status);
  console.log(body);

  if (response.ok) {
    console.log('\nRESULT: credentials and source IP are accepted, and the field list above');
    console.log('confirms this is the instance holding the form. Submissions should arrive.');
    return;
  }

  if (response.status === 403 && body.includes('IP_NOT_ALLOWED')) {
    console.log('\nRESULT: the source IP is not on this instance\'s allow list.');
    console.log('Check the resolved address above: reaching the app through the nginx');
    console.log('proxy on 192.168.101.10 makes it match on X-Forwarded-For (a 172.x bridge');
    console.log('address), while calling 192.168.101.11:3000 directly matches the real peer.');
  } else if (response.status === 401) {
    console.log('\nRESULT: the token was rejected. Confirm it is <KEY_ID>.<SECRET>, still active,');
    console.log('and that it belongs to the instance named above — keys are per instance.');
  } else {
    console.log('\nRESULT: the webhook refused the call — see the response above.');
  }

  process.exit(1);
}

main();
