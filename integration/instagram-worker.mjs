// Optional server adapter. NOT deployed by the SABSUS static source archive.
// Configure secrets through the hosting provider, never through public JS.
// IG_ACCESS_TOKEN: owner-authorized read token; IG_USER_ID: professional account ID.
// IG_API_VERSION: supported version selected in the Meta app; SITE_ORIGIN: exact allowed site origin.
// Point BAVARIA_SOCIAL_CONFIG.endpoint at this adapter only after deployment and verification.
export default {
 async fetch(request,env,ctx){
  const url=new URL(request.url),origin=request.headers.get('Origin');
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
  if(origin&&origin!==env.SITE_ORIGIN)return new Response(JSON.stringify({items:[]}),{status:403,headers});
  if(origin)headers['Access-Control-Allow-Origin']=origin;
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, OPTIONS','Vary':'Origin'}});
  if(request.method!=='GET'||url.pathname!=='/api/instagram-feed')return new Response(JSON.stringify({items:[]}),{status:404,headers});
  if(!env.IG_ACCESS_TOKEN||!/^\d+$/.test(env.IG_USER_ID||'')||!/^v\d+\.\d+$/.test(env.IG_API_VERSION||''))return new Response(JSON.stringify({items:[],connected:false}),{status:503,headers});
  const key=new Request(url.origin+'/internal-bavaria-feed-cache');
  const cached=await caches.default.match(key);
  if(cached)return new Response(cached.body,{headers});
  try{
   const api=new URL('https://graph.instagram.com/'+env.IG_API_VERSION+'/'+env.IG_USER_ID+'/media');
   api.searchParams.set('fields','id,caption,media_type,media_url,thumbnail_url,permalink,timestamp');api.searchParams.set('limit','12');
   const response=await fetch(api,{headers:{Authorization:'Bearer '+env.IG_ACCESS_TOKEN},signal:AbortSignal.timeout(8000)});
   if(!response.ok)throw new Error('Provider request failed');
   const json=await response.json();
   const items=(Array.isArray(json.data)?json.data:[]).map(p=>({id:p.id,caption:p.caption||'',media_type:p.media_type,media_url:p.media_type==='VIDEO'?p.thumbnail_url:p.media_url,thumbnail_url:p.thumbnail_url,permalink:p.permalink,timestamp:p.timestamp})).filter(p=>p.media_url&&p.permalink).sort((a,b)=>Date.parse(b.timestamp)-Date.parse(a.timestamp));
   const body=JSON.stringify({items,connected:true,updatedAt:new Date().toISOString()});
   ctx.waitUntil(caches.default.put(key,new Response(body,{headers:{'Content-Type':'application/json','Cache-Control':'public,max-age=300'}})));
   return new Response(body,{headers});
  }catch{return new Response(JSON.stringify({items:[],connected:false}),{status:502,headers});}
 }
};
