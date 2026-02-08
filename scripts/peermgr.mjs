#!/usr/bin/env node
import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { peerRestart, peerStart, peerStatus, peerStop } from '../src/peer/peerManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function die(msg) {
  process.stderr.write(`${msg}\n`);
  process.exit(1);
}

function usage() {
  return `
peermgr (manage local pear run processes)

Commands:
  start --name <id> --store <peerStoreName> --sc-port <n> [--sidechannels <csv>] [--inviter-keys <csv>]
        [--msb 0|1] [--price-oracle 0|1] [--subnet-channel <name>] [--dht-bootstrap <csv>] [--msb-dht-bootstrap <csv>]
        [--pow 0|1] [--pow-difficulty <n>] [--welcome-required 0|1] [--invite-required 0|1] [--invite-prefixes <csv>]
        [--log <path>] [--ready-timeout-ms <n>]
  stop --name <id> [--signal <SIGTERM|SIGINT|SIGKILL>] [--wait-ms <n>]
  restart --name <id> [--wait-ms <n>] [--ready-timeout-ms <n>]
  status [--name <id>]

Notes:
  - State + logs are stored under onchain/peers/ (gitignored).
  - Never run the same peer store twice (peermgr enforces this by store name).
`.trim();
}

function parseArgs(argv) {
  const args = [];
  const flags = new Map();
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) flags.set(key, true);
      else {
        flags.set(key, next);
        i += 1;
      }
    } else {
      args.push(a);
    }
  }
  return { args, flags };
}

function requireFlag(flags, name) {
  const v = flags.get(name);
  if (!v || v === true) die(`Missing --${name}`);
  return String(v);
}

function maybeFlag(flags, name, fallback = '') {
  const v = flags.get(name);
  if (!v || v === true) return fallback;
  return String(v);
}

function maybeInt(flags, name, fallback = null) {
  const v = flags.get(name);
  if (v === undefined || v === null || v === true) return fallback;
  const n = Number.parseInt(String(v), 10);
  if (!Number.isFinite(n)) die(`Invalid --${name}`);
  return n;
}

function maybeBool(flags, name, fallback = null) {
  const v = flags.get(name);
  if (v === undefined || v === null || v === true) return fallback;
  const s = String(v).trim().toLowerCase();
  if (!s) return fallback;
  if (['1', 'true', 'yes', 'on'].includes(s)) return true;
  if (['0', 'false', 'no', 'off'].includes(s)) return false;
  die(`Invalid --${name} (expected 0|1|true|false)`);
  return fallback;
}

function csvOrEmpty(s) {
  const t = String(s || '').trim();
  return t ? t.split(',').map((v) => v.trim()).filter(Boolean) : [];
}

async function main() {
  const { args, flags } = parseArgs(process.argv.slice(2));
  const cmd = args[0];
  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  if (cmd === 'start') {
    const name = requireFlag(flags, 'name');
    const store = requireFlag(flags, 'store');
    const scPort = maybeInt(flags, 'sc-port', null);
    if (!scPort) die('Missing --sc-port');

    const out = await peerStart({
      repoRoot,
      name,
      store,
      scPort,
      sidechannels: csvOrEmpty(maybeFlag(flags, 'sidechannels', '')),
      sidechannelInviterKeys: csvOrEmpty(maybeFlag(flags, 'inviter-keys', '')),
      sidechannelInvitePrefixes: csvOrEmpty(maybeFlag(flags, 'invite-prefixes', 'swap:')),
      msbEnabled: maybeBool(flags, 'msb', false) ?? false,
      priceOracleEnabled: maybeBool(flags, 'price-oracle', false) ?? false,
      subnetChannel: maybeFlag(flags, 'subnet-channel', ''),
      dhtBootstrap: csvOrEmpty(maybeFlag(flags, 'dht-bootstrap', '')),
      msbDhtBootstrap: csvOrEmpty(maybeFlag(flags, 'msb-dht-bootstrap', '')),
      sidechannelPowEnabled: maybeBool(flags, 'pow', null),
      sidechannelPowDifficulty: maybeInt(flags, 'pow-difficulty', null),
      sidechannelWelcomeRequired: maybeBool(flags, 'welcome-required', null),
      sidechannelInviteRequired: maybeBool(flags, 'invite-required', null),
      logPath: maybeFlag(flags, 'log', ''),
      readyTimeoutMs: maybeInt(flags, 'ready-timeout-ms', 15_000) ?? 15_000,
    });
    process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
    return;
  }

  if (cmd === 'stop') {
    const name = requireFlag(flags, 'name');
    const signal = maybeFlag(flags, 'signal', 'SIGTERM');
    const waitMs = maybeInt(flags, 'wait-ms', 2000);
    const out = await peerStop({ repoRoot, name, signal, waitMs });
    process.stdout.write(`${JSON.stringify(out)}\n`);
    return;
  }

  if (cmd === 'restart') {
    const name = requireFlag(flags, 'name');
    const waitMs = maybeInt(flags, 'wait-ms', 2000);
    const readyTimeoutMs = maybeInt(flags, 'ready-timeout-ms', 15_000) ?? 15_000;
    const out = await peerRestart({ repoRoot, name, waitMs, readyTimeoutMs });
    process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
    return;
  }

  if (cmd === 'status') {
    const name = maybeFlag(flags, 'name', '');
    const out = peerStatus({ repoRoot, name });
    process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
    return;
  }

  die(`Unknown command: ${cmd}\n\n${usage()}`);
}

main().catch((err) => die(err?.stack || err?.message || String(err)));

