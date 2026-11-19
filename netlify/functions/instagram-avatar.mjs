const FALLBACK = '/assets/bavaria-royal-crest.webp';
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

function fallback() {
  return {
    statusCode: 302,
    headers: {
      Location: FALLBACK,
      'Cache-Control': 'public, max-age=120, s-maxage=300',
      'X-Content-Type-Options': 'nosniff',
    },
    body: '',
  };
}

function isMetaImageUrl(value) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    return url.protocol === 'https:' &&
      (hostname === 'fbcdn.net' || hostname.endsWith('.fbcdn.net') ||
       hostname === 'cdninstagram.com' || hostname.endsWith('.cdninstagram.com'));
  } catch {
    return false;
  }
}

async function getImage(avatarUrl) {
  let current = avatarUrl;
  for (let i = 0; i < 4; i++) {
    if (!isMetaImageUrl(current)) throw new Error('Instagram avatar CDN URL not allowed');
    const response = await fetch(current, {
      redirect: 'manual',
      headers: { Accept: 'image/avif,image/webp,image/*;q=0.8' },
      signal: AbortSignal.timeout(10000),
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const next = response.headers.get('location');
      if (!next) throw new Error('Avatar redirect missing location');
      current = new URL(next, current).href;
      continue;
    }
    if (!response.ok) throw new Error('Instagram CDN returned ' + response.status);
    const contentType = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(contentType)) {
      throw new Error('Instagram CDN did not return a supported image');
    }
    const size = Number(response.headers.get('content-length') || 0);
    if (size > MAX_IMAGE_BYTES) throw new Error('Instagram avatar exceeds maximum size');
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) throw new Error('Invalid avatar image size');
    return { bytes, contentType };
  }
  throw new Error('Too many Instagram avatar redirects');
}

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: { Allow: 'GET', 'Cache-Control': 'no-store' }, body: 'Method not allowed' };
  }
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  const version = process.env.INSTAGRAM_API_VERSION || 'v27.0';
  if (!token || !/^\d+$/.test(userId || '') || !/^v\d+\.\d+$/.test(version)) {
    return fallback();
  }

  try {
    const url = new URL(`https://graph.facebook.com/${version}/${userId}`);
    url.searchParams.set('fields', 'profile_picture_url');
    const profileResponse = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
    if (!profileResponse.ok) throw new Error('Instagram profile request failed: ' + profileResponse.status);
    const profile = await profileResponse.json();
    if (!profile.profile_picture_url) throw new Error('Instagram has not provided a profile picture URL');

    const { bytes, contentType } = await getImage(profile.profile_picture_url);
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(bytes.length),
        'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=3600',
        'X-Content-Type-Options': 'nosniff',
      },
      body: bytes.toString('base64'),
    };
  } catch (error) {
    console.warn('Instagram avatar unavailable, using local brand image:', error.message);
    return fallback();
  }
}
