export const ENDPOINTS = { article: "articles", video: "videos", audio: "audios" };
const MEDIA = { article: ["image", "category"], video: ["thumbnail", "category"], audio: ["coverImage", "audioFile", "category"] };

export function createContentStore(base, fetchImpl = fetch) {
  const cache = new Map();
  const pending = new Map();
  async function cached(key, load) {
    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.value;
    if (pending.has(key)) return pending.get(key);
    const request = load().then(value => {
      if (cache.size >= 500) cache.delete(cache.keys().next().value);
      cache.set(key, { value, expires: Date.now() + 60_000 });
      return value;
    }).finally(() => pending.delete(key));
    pending.set(key, request);
    return request;
  }
  async function query(type, params) {
    const response = await fetchImpl(`${base}/api/${ENDPOINTS[type]}?${params}`, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`CMS ${response.status} (${type})`);
    const json = await response.json();
    if (!Array.isArray(json.data)) throw new Error(`Invalid CMS response (${type})`);
    return json;
  }
  function paramsFor(type, locale, populate = true) {
    const params = new URLSearchParams({ locale, status: "published" });
    if (populate) {
      // Use explicit nested fields to avoid downloading the translated article bodies.
      MEDIA[type].forEach(field => params.set(`populate[${field}]`, "true"));
      ["slug", "locale", "publishedAt"].forEach((field, i) => params.set(`populate[localizations][fields][${i}]`, field));
    }
    return params;
  }
  return {
    getContent(type, slug, locale = "fr") {
      return cached(`item:${locale}:${type}:${slug}`, async () => {
        const params = paramsFor(type, locale);
        params.set("filters[slug][$eq]", slug);
        params.set("pagination[pageSize]", "1");
        const result = await query(type, params);
        return result.data[0] ? { ...result.data[0], type } : null;
      });
    },
    getHome(locale = "fr") {
      return cached(`home:${locale}`, async () => (await Promise.all(Object.keys(ENDPOINTS).map(async type => {
        const params = paramsFor(type, locale);
        params.set("pagination[pageSize]", "24");
        params.set("sort[0]", "publishedAt:desc");
        return (await query(type, params)).data.map(item => ({ ...item, type }));
      }))).flat());
    },
    getSitemapItems() {
      return cached("sitemap", async () => (await Promise.all(["fr", "en", "ht"].flatMap(locale => Object.keys(ENDPOINTS).map(async type => {
        const result = [];
        let page = 1, pageCount = 1;
        do {
          const params = paramsFor(type, locale, false);
          ["title", "slug", "locale", "updatedAt", "publishedAt", "publishedDate"].forEach((field, i) => params.set(`fields[${i}]`, field));
          params.set("pagination[pageSize]", "100");
          params.set("pagination[page]", String(page));
          params.set("sort", "id:asc");
          const data = await query(type, params);
          result.push(...data.data.map(item => ({ ...item, type })));
          pageCount = data.meta?.pagination?.pageCount || 1;
          page++;
        } while (page <= pageCount);
        return result;
      })))).flat());
    },
  };
}
