/**
 * Lightweight Cloudinary URL builders. We intentionally avoid pulling in the
 * full Cloudinary SDK client-side; string templating against the delivery
 * URL is sufficient for a read-heavy asset gallery like this one.
 */

const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
const BASE_FOLDER =
  process.env.NEXT_PUBLIC_CLOUDINARY_BASE_FOLDER || "cyber-nfc-kit";

/**
 * Builds a delivery URL for an image asset, with optional transformations.
 *
 * @param {string} publicId - Cloudinary public ID, relative to BASE_FOLDER.
 * @param {object} [transforms]
 * @param {number} [transforms.width]
 * @param {number} [transforms.height]
 * @param {string} [transforms.crop="fill"]
 * @param {string} [transforms.quality="auto"]
 * @param {string} [transforms.format="auto"]
 */
export function cloudinaryImage(publicId, transforms = {}) {
  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = transforms;

  const parts = [`f_${format}`, `q_${quality}`];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (width || height) parts.push(`c_${crop}`);

  const transformStr = parts.join(",");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}/${BASE_FOLDER}/${publicId}`;
}

/**
 * Builds a raw (non-transformed) delivery URL, used for print-ready PDF or
 * high-res PNG wrapper downloads.
 */
export function cloudinaryRaw(publicId, resourceType = "image") {
  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/${BASE_FOLDER}/${publicId}`;
}

/** Forces a browser download (as opposed to inline display) via `fl_attachment`. */
export function cloudinaryDownloadUrl(publicId, filename, resourceType = "image") {
  const attachment = filename ? `fl_attachment:${encodeURIComponent(filename)}` : "fl_attachment";
  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/${attachment}/${BASE_FOLDER}/${publicId}`;
}
