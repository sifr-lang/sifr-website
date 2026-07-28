#!/usr/bin/env node

import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import process from 'node:process';

const STABLE_VERSION = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const PUBLIC_VERSION =
  /^[0-9]+\.[0-9]+\.[0-9]+(?:-(?:alpha|beta)\.[0-9]+)?$/;
const SHA256 = /^[0-9a-f]{64}$/;
const DISPATCHERS = ['alpha', 'beta', 'index', 'stable'];

function fail(message) {
  throw new Error(`stable-release-page: ${message}`);
}

function exactKeys(value, expected, location) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    Object.keys(value).sort().join('\0') !== [...expected].sort().join('\0')
  ) {
    fail(`${location} has an invalid shape`);
  }
}

export function validateFacts(facts) {
  exactKeys(
    facts,
    [
      'schema_version',
      'generation',
      'stable_version',
      'stable_status',
      'source_plan_sha256',
      'release_index_sha256',
      'dispatchers',
      'withdrawals',
    ],
    '$',
  );
  if (
    facts.schema_version !== 2 ||
    !Number.isSafeInteger(facts.generation) ||
    facts.generation < 1 ||
    !STABLE_VERSION.test(facts.stable_version) ||
    facts.stable_status !== 'active' ||
    !SHA256.test(facts.source_plan_sha256) ||
    /^0+$/.test(facts.source_plan_sha256) ||
    !SHA256.test(facts.release_index_sha256) ||
    /^0+$/.test(facts.release_index_sha256)
  ) {
    fail('governed identity is invalid');
  }
  exactKeys(facts.dispatchers, DISPATCHERS, '$.dispatchers');
  for (const name of DISPATCHERS) {
    if (
      !SHA256.test(facts.dispatchers[name]) ||
      /^0+$/.test(facts.dispatchers[name])
    ) {
      fail(`$.dispatchers.${name} is invalid`);
    }
  }
  if (!Array.isArray(facts.withdrawals)) {
    fail('$.withdrawals must be an array');
  }
  const observed = [];
  for (const [index, withdrawal] of facts.withdrawals.entries()) {
    exactKeys(withdrawal, ['version', 'incident_id'], `$.withdrawals[${index}]`);
    if (
      !PUBLIC_VERSION.test(withdrawal.version) ||
      typeof withdrawal.incident_id !== 'string' ||
      withdrawal.incident_id.length === 0
    ) {
      fail(`$.withdrawals[${index}] is invalid`);
    }
    observed.push(`${withdrawal.version}\0${withdrawal.incident_id}`);
  }
  if (observed.join('\0') !== [...observed].sort().join('\0')) {
    fail('$.withdrawals must use deterministic version ordering');
  }
  return facts;
}

function canonicalJson(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalJson);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalJson(value[key])]),
    );
  }
  return value;
}

function canonicalFactsBytes(facts) {
  return `${JSON.stringify(canonicalJson(facts))}\n`;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderPage(candidate) {
  const facts = validateFacts(candidate);
  const withdrawals =
    facts.withdrawals.length === 0
      ? 'none.'
      : facts.withdrawals
          .map(
            ({ version, incident_id: incidentId }) =>
              `<code>${escapeHtml(version)}</code> (${escapeHtml(incidentId)})`,
          )
          .join(', ');
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sifr stable releases</title>
    <meta name="description" content="Current and withdrawn governed Sifr stable releases.">
    <link rel="canonical" href="https://sifr.sh/releases/stable/">
  </head>
  <body>
    <main>
      <h1>Sifr stable releases</h1>
      <p>Active stable version: <code>${escapeHtml(facts.stable_version)}</code></p>
      <p>Withdrawn stable versions: ${withdrawals}</p>
      <p>Release index generation: <code>${facts.generation}</code></p>
    </main>
  </body>
</html>
`;
}

async function renderFile(factsPath, output) {
  const rawFacts = await readFile(factsPath, { encoding: 'utf8' });
  const facts = JSON.parse(rawFacts);
  if (rawFacts !== canonicalFactsBytes(facts)) {
    fail('facts bytes are not canonical JSON');
  }
  const page = renderPage(facts);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, page, { encoding: 'utf8', flag: 'wx' });
}

async function selfTest() {
  const facts = {
    schema_version: 2,
    generation: 4,
    stable_version: '1.2.3',
    stable_status: 'active',
    source_plan_sha256: '1'.repeat(64),
    release_index_sha256: '2'.repeat(64),
    dispatchers: {
      alpha: '3'.repeat(64),
      beta: '4'.repeat(64),
      index: '5'.repeat(64),
      stable: '6'.repeat(64),
    },
    withdrawals: [],
  };
  assert.match(renderPage(facts), /Withdrawn stable versions: none\./);
  const withWithdrawals = {
    ...facts,
    withdrawals: [
      // Deliberately outside the governed incident alphabet to exercise HTML
      // escaping independently from the exact upstream facts-digest check.
      { version: '1.2.1', incident_id: '<incident-one>' },
      { version: '1.2.2', incident_id: 'incident-two' },
    ],
  };
  const page = renderPage(withWithdrawals);
  for (const value of [
    'Active stable version',
    '1.2.3',
    'Withdrawn stable versions',
    '1.2.1',
    '1.2.2',
    '&lt;incident-one&gt;',
    'incident-two',
  ]) {
    assert.ok(page.includes(value));
  }
  assert.throws(
    () => renderPage({ ...facts, schema_version: 1 }),
    /governed identity is invalid/,
  );
  assert.throws(
    () =>
      renderPage({
        ...facts,
        withdrawals: [
          { version: '1.2.2', incident_id: 'later' },
          { version: '1.2.1', incident_id: 'earlier' },
        ],
      }),
    /deterministic version ordering/,
  );
  const root = await mkdtemp(join(tmpdir(), 'sifr-stable-page-'));
  try {
    const factsPath = join(root, 'facts.json');
    const output = join(root, 'public', 'releases', 'stable', 'index.html');
    await writeFile(factsPath, canonicalFactsBytes(withWithdrawals), 'utf8');
    await renderFile(factsPath, output);
    assert.equal(await readFile(output, 'utf8'), page);
    await assert.rejects(() => renderFile(factsPath, output), /EEXIST/);
    await writeFile(factsPath, JSON.stringify(withWithdrawals), 'utf8');
    await assert.rejects(
      () => renderFile(factsPath, join(root, 'noncanonical.html')),
      /facts bytes are not canonical JSON/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
  process.stdout.write('stable release page renderer: PASS\n');
}

async function main() {
  if (process.argv.length === 3 && process.argv[2] === '--self-test') {
    await selfTest();
    return;
  }
  const arguments_ = new Map();
  for (let index = 2; index < process.argv.length; index += 2) {
    arguments_.set(process.argv[index], process.argv[index + 1]);
  }
  if (
    process.argv.length !== 6 ||
    !arguments_.has('--facts') ||
    !arguments_.has('--out')
  ) {
    fail('usage: render-stable-release-page.mjs --facts PATH --out PATH');
  }
  await renderFile(arguments_.get('--facts'), arguments_.get('--out'));
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 2;
});
