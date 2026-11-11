const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'X-Content-Type-Options': 'nosniff',
};

const respond = (statusCode, body, cache = 'no-store') => ({
  statusCode,
  headers: { ...headers, 'Cache-Control': cache },
  body: JSON.stringify(body),
});

async function instagramRequest(url, token) {
  url.searchParams.set('access_token', token);
  const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
  const payload = await response.json();
  if (!response.ok || payload.error) throw new Error(payload.error?.message || `Instagram API returned ${response.status}`);
  return payload;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return respond(200, { ok: true });
  if (event.httpMethod !== 'GET') return respond(405, { ok: false, error: 'Method not allowed' });
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID || 'me';
  const apiVersion = process.env.INSTAGRAM_API_VERSION || 'v26.0';
  if (!token) return respond(503, { ok: false, configured: false, posts: [], stories: [] });

  const base = `https://graph.instagram.com/${apiVersion}`;
  const profileUrl = new URL(`${base}/${userId}`);
  profileUrl.searchParams.set('fields', 'id,username,profile_picture_url');
  const postsUrl = new URL(`${base}/${userId}/media`);
  postsUrl.searchParams.set('fields', 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,like_count,comments_count');
  postsUrl.searchParams.set('limit', '12');
  const storiesUrl = new URL(`${base}/${userId}/stories`);
  storiesUrl.searchParams.set('fields', 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username');
  storiesUrl.searchParams.set('limit', '12');

  try {
    const [profile, posts, stories] = await Promise.all([
      instagramRequest(profileUrl, token),
      instagramRequest(postsUrl, token),
      instagramRequest(storiesUrl, token).catch(() => ({ data: [] })),
    ]);
    return respond(200, {
      ok: true, configured: true, profile,
      posts: Array.isArray(posts.data) ? posts.data : [],
      stories: Array.isArray(stories.data) ? stories.data : [],
      fetchedAt: new Date().toISOString(),
    }, 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  } catch (error) {
    console.error('Instagram feed request failed:', error.message);
    return respond(502, { ok: false, configured: true, posts: [], stories: [] });
  }
}
