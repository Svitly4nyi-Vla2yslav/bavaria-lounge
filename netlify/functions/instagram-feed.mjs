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
  const response = await fetch(url, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(8000),
  });
  const payload = await response.json();
  if (!response.ok || payload.error) {
    const error = new Error(payload.error?.message || `Instagram API returned ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return respond(200, { ok: true });
  if (event.httpMethod !== 'GET') return respond(405, { ok: false, error: 'Method not allowed' });
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  const apiVersion = process.env.INSTAGRAM_API_VERSION || 'v27.0';
  if (!token || !/^\d+$/.test(userId || '') || !/^v\d+\.\d+$/.test(apiVersion)) {
    return respond(503, { ok: false, configured: false, posts: [], stories: [] });
  }

  const base = `https://graph.facebook.com/${apiVersion}`;
  const profileUrl = new URL(`${base}/${userId}`);
  profileUrl.searchParams.set('fields', 'id,username');
  const postsUrl = new URL(`${base}/${userId}/media`);
  const mediaFields = 'id,caption,media_type,media_product_type,media_url,permalink,thumbnail_url,timestamp';
  postsUrl.searchParams.set('fields', `${mediaFields},like_count,comments_count`);
  const fallbackPostsUrl = new URL(postsUrl);
  fallbackPostsUrl.searchParams.set('fields', mediaFields);
  postsUrl.searchParams.set('limit', '12');
  fallbackPostsUrl.searchParams.set('limit', '12');
  const storiesUrl = new URL(`${base}/${userId}/stories`);
  storiesUrl.searchParams.set('fields', 'id,media_type,media_url,thumbnail_url,timestamp');
  storiesUrl.searchParams.set('limit', '12');

  try {
    const [profile, posts, stories] = await Promise.all([
      instagramRequest(profileUrl, token),
      instagramRequest(postsUrl, token).catch((error) => {
        if (error.status !== 400) throw error;
        console.warn('Instagram engagement fields unavailable; retrying posts without counts');
        return instagramRequest(fallbackPostsUrl, token);
      }),
      instagramRequest(storiesUrl, token).catch((error) => {
        console.warn('Instagram stories request failed:', error.message);
        return { data: [], unavailable: true };
      }),
    ]);
    return respond(200, {
      ok: true, configured: true, profile,
      posts: Array.isArray(posts.data) ? posts.data : [],
      stories: Array.isArray(stories.data) ? stories.data : [],
      storiesAvailable: stories.unavailable !== true,
      fetchedAt: new Date().toISOString(),
    }, 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  } catch (error) {
    console.error('Instagram feed request failed:', error.message);
    return respond(502, { ok: false, configured: true, posts: [], stories: [] });
  }
}
