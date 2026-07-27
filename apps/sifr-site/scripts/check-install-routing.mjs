import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';

import worker from '../src/worker.js';

const env = {
  ASSETS: {
    fetch(request) {
      return request.url;
    },
  },
};

const install = await worker.fetch(new Request('https://sifr.sh/install'), env);
assert.equal(install, 'https://sifr.sh/install/index');
await access(new URL('../public/install/index', import.meta.url));

const beta = await worker.fetch(new Request('https://sifr.sh/install/beta'), env);
assert.equal(beta, 'https://sifr.sh/install/beta');

console.log('install routing contract: PASS');
