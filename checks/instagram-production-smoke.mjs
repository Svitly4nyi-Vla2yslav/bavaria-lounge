// Public production smoke test: outputs status and counts only, never access tokens.
const endpoint = process.env.BAVARIA_FEED_URL || 'https://bavaria-lounge.de/.netlify/functions/instagram-feed';
let verified = false;
for (let attempt = 1; attempt <= 12; attempt++) {
  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15000),
    });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.log('Attempt', attempt, 'status', response.status, 'unexpected content type', contentType);
    } else {
      const payload = await response.json();
      const posts = Array.isArray(payload.posts) ? payload.posts.length : 0;
      const stories = Array.isArray(payload.stories) ? payload.stories.length : 0;
      console.log('Attempt', attempt, 'status', response.status, 'ok', payload.ok === true,
        'configured', payload.configured === true, 'posts', posts, 'stories', stories);
      if (response.ok && payload.ok === true && posts > 0) {
        verified = true;
        break;
      }
    }
  } catch (error) {
    console.log('Attempt', attempt, 'request failed:', error.name);
  }
  if (attempt < 12) await new Promise(resolve => setTimeout(resolve, 15000));
}
if (!verified) {
  console.error('Production Instagram feed did not return posts. Check Netlify deploy and environment variables.');
  process.exitCode = 1;
}

const avatarEndpoint = new URL('/.netlify/functions/instagram-avatar', endpoint).href;
let verifiedAvatar = false;
for (let attempt = 1; attempt <= 12; attempt++) {
  try {
    const response = await fetch(avatarEndpoint, {
      redirect: 'manual',
      headers: { Accept: 'image/*' },
      signal: AbortSignal.timeout(15000),
    });
    const type = response.headers.get('content-type') || '';
    console.log('Avatar attempt', attempt, 'status', response.status, 'type', type || 'none');
    if (response.status === 200 && type.startsWith('image/')) {
      verifiedAvatar = true;
      break;
    }
  } catch (error) {
    console.log('Avatar attempt', attempt, 'request failed:', error.name);
  }
  if (attempt < 12) await new Promise(resolve => setTimeout(resolve, 15000));
}
if (!verifiedAvatar) {
  console.error('Instagram profile picture not served from Meta; the site will show the Bavaria crest fallback.');
  process.exitCode = 1;
}
