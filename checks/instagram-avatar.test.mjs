import assert from 'node:assert/strict';
import test from 'node:test';
import { handler } from '../netlify/functions/instagram-avatar.mjs';

function withEnvironment() {
  const before = Object.fromEntries(
    ['INSTAGRAM_ACCESS_TOKEN', 'INSTAGRAM_USER_ID', 'INSTAGRAM_API_VERSION'].map(key => [key, process.env[key]])
  );
  const originalFetch = globalThis.fetch;
  return () => {
    for (const [key, value] of Object.entries(before)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    globalThis.fetch = originalFetch;
  };
}

test('returns local Bavaria crest if Instagram configuration is missing', async () => {
  const cleanup = withEnvironment();
  try {
    delete process.env.INSTAGRAM_ACCESS_TOKEN;
    delete process.env.INSTAGRAM_USER_ID;
    globalThis.fetch = () => { throw new Error('Network must not be requested'); };
    const response = await handler({ httpMethod: 'GET' });
    assert.equal(response.statusCode, 302);
    assert.equal(response.headers.Location, '/assets/bavaria-royal-crest.webp');
  } finally {
    cleanup();
  }
});

test('fetches the real avatar through Meta without leaking the token', async () => {
  const cleanup = withEnvironment();
  try {
    process.env.INSTAGRAM_ACCESS_TOKEN = 'fake-test-token';
    process.env.INSTAGRAM_USER_ID = '17841403390955028';
    process.env.INSTAGRAM_API_VERSION = 'v27.0';
    const testBytes = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);
    let calls = 0;
    globalThis.fetch = async (url, options) => {
      calls++;
      const input = new URL(url);
      if (input.hostname === 'graph.facebook.com') {
        assert.equal(input.pathname, '/v27.0/17841403390955028');
        assert.equal(input.searchParams.get('fields'), 'profile_picture_url');
        assert.equal(options.headers.Authorization, 'Bearer fake-test-token');
        return new Response(JSON.stringify({
          profile_picture_url: 'https://scontent.cdninstagram.com/brand-avatar.jpg?sig=temporary',
        }), { status: 200, headers: { 'content-type': 'application/json' } });
      }
      assert.equal(input.hostname, 'scontent.cdninstagram.com');
      assert.equal(options.redirect, 'manual');
      return new Response(testBytes, { status: 200, headers: { 'content-type': 'image/jpeg' } });
    };
    const result = await handler({ httpMethod: 'GET' });
    assert.equal(result.statusCode, 200);
    assert.equal(result.headers['Content-Type'], 'image/jpeg');
    assert.equal(result.isBase64Encoded, true);
    assert.deepEqual(Buffer.from(result.body, 'base64'), testBytes);
    assert.equal(calls, 2);
    assert.doesNotMatch(JSON.stringify(result), /fake-test-token|sig=temporary/);
  } finally {
    cleanup();
  }
});

test('never fetches arbitrary domains returned in an avatar URL', async () => {
  const cleanup = withEnvironment();
  try {
    process.env.INSTAGRAM_ACCESS_TOKEN = 'fake-token';
    process.env.INSTAGRAM_USER_ID = '123';
    let requests = 0;
    globalThis.fetch = async () => {
      requests++;
      return new Response(JSON.stringify({
        profile_picture_url: 'http://127.0.0.1/admin',
      }), { status: 200, headers: { 'content-type': 'application/json' } });
    };
    const response = await handler({ httpMethod: 'GET' });
    assert.equal(response.statusCode, 302);
    assert.equal(response.headers.Location, '/assets/bavaria-royal-crest.webp');
    assert.equal(requests, 1);
  } finally {
    cleanup();
  }
});

test('returns brand fallback when Meta does not provide a valid picture', async () => {
  const cleanup = withEnvironment();
  try {
    process.env.INSTAGRAM_ACCESS_TOKEN = 'fake-token';
    process.env.INSTAGRAM_USER_ID = '123';
    globalThis.fetch = async () => new Response(JSON.stringify({ id: '123' }), { status: 200 });
    const response = await handler({ httpMethod: 'GET' });
    assert.equal(response.statusCode, 302);
  } finally {
    cleanup();
  }
});
