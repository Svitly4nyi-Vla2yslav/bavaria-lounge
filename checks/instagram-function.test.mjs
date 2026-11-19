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
  globalThis.fetch = async (url, options) => {
    const apiUrl = new URL(url);
    assert.equal(apiUrl.hostname, 'graph.facebook.com');
    assert.equal(apiUrl.searchParams.has('access_token'), false);
    assert.equal(options.headers.Authorization, 'Bearer server-only-secret');
    const path = apiUrl.pathname;
    const payload = path.endsWith('/media')
      ? { data: [{ id: 'p1', media_type: 'IMAGE', like_count: 42, comments_count: 7, media_url: 'https://cdn.test/post.jpg', permalink: 'https://www.instagram.com/p/test/' }] }
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
    assert.equal(body.posts[0].like_count, 42);
    assert.equal(body.posts[0].comments_count, 7);
    assert.equal(body.stories.length, 1);
    assert.equal(body.storiesAvailable, true);
    assert.doesNotMatch(response.body, /server-only-secret/);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.INSTAGRAM_ACCESS_TOKEN;
    delete process.env.INSTAGRAM_USER_ID;
  }
});

test('preserves posts and signals unavailable stories when Stories API fails', async () => {
  const originalFetch = globalThis.fetch;
  const tokenBefore = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userBefore = process.env.INSTAGRAM_USER_ID;
  process.env.INSTAGRAM_ACCESS_TOKEN = 'another-server-secret';
  process.env.INSTAGRAM_USER_ID = '17841403390955028';
  globalThis.fetch = async (url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer another-server-secret');
    const pathname = new URL(url).pathname;
    if (pathname.endsWith('/stories')) {
      return new Response(JSON.stringify({ error: { code: 100, message: 'Stories unavailable' } }), { status: 400 });
    }
    return new Response(JSON.stringify(pathname.endsWith('/media')
      ? { data: [{ id: 'p1', media_type: 'IMAGE', media_url: 'https://cdn.test/post.jpg', permalink: 'https://www.instagram.com/p/test/' }] }
      : { id: '17841403390955028', username: 'bavaria_cocktail_lounge' }), { status: 200 });
  };
  try {
    const result = await handler({ httpMethod: 'GET' });
    const body = JSON.parse(result.body);
    assert.equal(result.statusCode, 200);
    assert.equal(body.ok, true);
    assert.equal(body.posts.length, 1);
    assert.deepEqual(body.stories, []);
    assert.equal(body.storiesAvailable, false);
    assert.doesNotMatch(result.body, /another-server-secret/);
  } finally {
    globalThis.fetch = originalFetch;
    if (tokenBefore === undefined) delete process.env.INSTAGRAM_ACCESS_TOKEN;
    else process.env.INSTAGRAM_ACCESS_TOKEN = tokenBefore;
    if (userBefore === undefined) delete process.env.INSTAGRAM_USER_ID;
    else process.env.INSTAGRAM_USER_ID = userBefore;
  }
});

test('falls back to basic posts when Instagram denies engagement fields', async () => {
  const originalFetch = globalThis.fetch;
  const tokenBefore = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userBefore = process.env.INSTAGRAM_USER_ID;
  process.env.INSTAGRAM_ACCESS_TOKEN = 'secret-for-fallback-test';
  process.env.INSTAGRAM_USER_ID = '17841403390955028';
  let mediaAttempts = 0;
  globalThis.fetch = async (url, options) => {
    const apiUrl = new URL(url);
    assert.equal(apiUrl.hostname, 'graph.facebook.com');
    assert.equal(options.headers.Authorization, 'Bearer secret-for-fallback-test');
    if (apiUrl.pathname.endsWith('/media')) {
      mediaAttempts++;
      if (apiUrl.searchParams.get('fields').includes('like_count')) {
        return new Response(JSON.stringify({ error: { code: 100, message: 'Unsupported field' } }), { status: 400 });
      }
      return new Response(JSON.stringify({
        data: [{ id: 'p2', media_type: 'IMAGE', caption: 'Still visible', media_url: 'https://cdn.test/p2.jpg', permalink: 'https://www.instagram.com/p/abc/' }]
      }), { status: 200 });
    }
    if (apiUrl.pathname.endsWith('/stories')) return new Response(JSON.stringify({ data: [] }), { status: 200 });
    return new Response(JSON.stringify({ id: '17841403390955028', username: 'bavaria_cocktail_lounge' }), { status: 200 });
  };
  try {
    const response = await handler({ httpMethod: 'GET' });
    const body = JSON.parse(response.body);
    assert.equal(response.statusCode, 200);
    assert.equal(body.ok, true);
    assert.equal(mediaAttempts, 2);
    assert.equal(body.posts[0].caption, 'Still visible');
    assert.equal(body.posts[0].like_count, undefined);
    assert.doesNotMatch(response.body, /secret-for-fallback-test/);
  } finally {
    globalThis.fetch = originalFetch;
    if (tokenBefore === undefined) delete process.env.INSTAGRAM_ACCESS_TOKEN;
    else process.env.INSTAGRAM_ACCESS_TOKEN = tokenBefore;
    if (userBefore === undefined) delete process.env.INSTAGRAM_USER_ID;
    else process.env.INSTAGRAM_USER_ID = userBefore;
  }
});
