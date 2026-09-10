/**
 * Minimal GraphQL POST client for DatoCMS's Content Delivery API.
 *
 * DatoCMS exposes a single GraphQL endpoint (see DATOCMS_ENDPOINT) that is
 * authenticated with a Bearer token scoped to a specific environment. This
 * helper wraps `fetch` with sane defaults, error surfacing, and optional
 * Next.js data-cache tagging so pages can selectively revalidate when
 * content changes in the CMS (e.g. via a DatoCMS webhook -> revalidateTag).
 */

const DATOCMS_ENDPOINT = process.env.DATOCMS_ENDPOINT || "https://graphql.datocms.com/";
const DATOCMS_TOKEN = process.env.DATOCMS_TOKEN;

/**
 * Executes a GraphQL query against DatoCMS.
 *
 * @param {string} query - GraphQL query document.
 * @param {object} [variables] - GraphQL variables.
 * @param {object} [options]
 * @param {string[]} [options.tags] - Next.js cache tags for this request.
 * @param {number|false} [options.revalidate] - ISR revalidate window in seconds.
 * @param {boolean} [options.preview] - Use the DatoCMS draft/preview endpoint.
 * @returns {Promise<any>} The `data` object from the GraphQL response.
 */
export async function datoCmsFetch(query, variables = {}, options = {}) {
  const { tags = ["datocms"], revalidate = 60, preview = false } = options;

  if (!DATOCMS_TOKEN) {
    throw new Error(
      "DATOCMS_TOKEN is not set. Add it to .env.local, or rely on the local " +
        "mock dataset in data/mockStickers.js during development."
    );
  }

  const endpoint = preview ? `${DATOCMS_ENDPOINT}preview` : DATOCMS_ENDPOINT;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DATOCMS_TOKEN}`,
      "X-Environment": process.env.DATOCMS_ENVIRONMENT || "main",
    },
    body: JSON.stringify({ query, variables }),
    next: revalidate === false ? undefined : { revalidate, tags },
    cache: revalidate === false ? "no-store" : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`DatoCMS request failed (${res.status}): ${text}`);
  }

  const json = await res.json();

  if (json.errors && json.errors.length > 0) {
    throw new Error(
      `DatoCMS GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`
    );
  }

  return json.data;
}

/** GraphQL query for the sticker collection + kit taxonomy. */
export const STICKERS_QUERY = `
  query AllStickers {
    allStickers(orderBy: position_ASC, first: 100) {
      id
      slug
      name
      tagline
      description(markdown: false)
      kit
      role        # 🛰️ Povlači ključnu ulogu (npr. network_scanner) iz DatoCMS-a
      webhookUrl
      accentColor {
        hex
      }
      previewImage {
        url
        alt
        width
        height
      }
      printAsset {
        url
        format
        filename
      }
    }
  }
`;

/**
 * Fetches the sticker catalog from DatoCMS. Falls back to `null` (rather
 * than throwing) when the CMS is not configured, so callers can merge in
 * the local mock dataset during local development / demos.
 */
export async function getStickersFromDatoCMS(options = {}) {
  if (!DATOCMS_TOKEN) return null;

  try {
    const data = await datoCmsFetch(STICKERS_QUERY, {}, options);
    return data?.allStickers ?? null;
  } catch (err) {
    console.error("[datocms] Falling back to mock data:", err.message);
    return null;
  }
}
