import assert from 'node:assert/strict';
import test from 'node:test';
import { handler } from '../netlify/functions/instagram-feed.mjs';

test('returns a safe unconfigured response when the token is absent', async () => {
  const previous = process.env.INSTAGRAM_ACCESS_TOKEN;
  delete process.env.INSTAGRAM_ACCESS_TOKEN;
  const response = await handler({ httpMethod: 'GET' });
  if (previous) process.env.INSTAGRAM_ACCESS_TOKEN = previous;
  const body = JSON.parse(response.body);
  assert.equal(response.statusCode, 503);
  assert.equal(body.configured, false);
  assert.deepEqual(body.posts, []);
  assert.doesNotMatch(response.body, /access_token/i);
});

test('returns profile, posts and stories without exposing the token', async () => {
  const originalFetch = globalThis.fetch;
  process.env.INSTAGRAM_ACCESS_TOKEN = 'server-only-secret';
  process.env.INSTAGRAM_USER_ID = '123';
  globalThis.fetch = async url => {
    const path = new URL(url).pathname;
    const payload = path.endsWith('/media')
      ? { data: [{ id: 'p1', media_type: 'IMAGE', media_url: 'https://cdn.test/post.jpg', permalink: 'https://www.instagram.com/p/test/' }] }
      : path.endsWith('/stories')
        ? { data: [{ id: 's1', media_type: 'IMAGE', media_url: 'https://cdn.test/story.jpg' }] }
        : { id: '123', username: 'bavaria_cocktail_lounge' };
    return new Response(JSON.stringify(payload), { status: 200 });
  };
  try {
    const response = await handler({ httpMethod: 'GET' });
    const body = JSON.parse(response.body);
    assert.equal(response.statusCode, 200);
    assert.equal(body.ok, true);
    assert.equal(body.posts.length, 1);
    assert.equal(body.stories.length, 1);
    assert.doesNotMatch(response.body, /server-only-secret/);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.INSTAGRAM_ACCESS_TOKEN;
    delete process.env.INSTAGRAM_USER_ID;
  }
});
