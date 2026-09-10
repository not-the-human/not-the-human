/**
 * WebNFC helpers wrapping the experimental `NDEFReader` API.
 *
 * Support matrix (as of this writing): Chrome/Edge on Android only, served
 * over HTTPS (or http://localhost during development). Every function here
 * fails soft with a typed error object so UI components can render a clear
 * status message instead of throwing unhandled exceptions.
 */

export function isWebNfcSupported() {
  return typeof window !== "undefined" && "NDEFReader" in window;
}

/**
 * Writes a URL record to the next NFC tag the device touches.
 *
 * @param {string} url - Absolute URL to encode (e.g. a sticker's webhook/
 *   deep-link target).
 * @param {object} [callbacks]
 * @param {() => void} [callbacks.onWaiting] - Called once the reader is armed
 *   and waiting for a physical tap.
 * @param {() => void} [callbacks.onSuccess] - Called after a successful write.
 * @param {(err: {code: string, message: string}) => void} [callbacks.onError]
 */
export async function writeUrlToTag(url, callbacks = {}) {
  const { onWaiting, onSuccess, onError } = callbacks;

  if (!isWebNfcSupported()) {
    onError?.({
      code: "UNSUPPORTED",
      message:
        "WebNFC is not available on this browser/device. Use Chrome for Android over HTTPS.",
    });
    return;
  }

  try {
    // eslint-disable-next-line no-undef
    const ndef = new NDEFReader();
    onWaiting?.();

    await ndef.write({
      records: [{ recordType: "url", data: url }],
    });

    onSuccess?.();
  } catch (err) {
    if (err.name === "NotAllowedError") {
      onError?.({
        code: "PERMISSION_DENIED",
        message: "NFC permission was denied. Allow NFC access and try again.",
      });
    } else if (err.name === "NotSupportedError") {
      onError?.({
        code: "UNSUPPORTED",
        message: "This device does not support NFC writing.",
      });
    } else if (err.name === "NetworkError") {
      onError?.({
        code: "TAG_ERROR",
        message: "No tag detected, or the tag could not be reached. Try again.",
      });
    } else {
      onError?.({ code: "UNKNOWN", message: err.message || "Unknown NFC error." });
    }
  }
}

/**
 * Starts a scan session and resolves with the first NDEF message read.
 * Useful for a "read this chip" debug utility alongside the writer.
 */
export async function readTag({ onReading, onError } = {}) {
  if (!isWebNfcSupported()) {
    onError?.({ code: "UNSUPPORTED", message: "WebNFC is not available on this device." });
    return null;
  }

  try {
    // eslint-disable-next-line no-undef
    const ndef = new NDEFReader();
    await ndef.scan();
    return new Promise((resolve) => {
      ndef.onreading = (event) => {
        onReading?.(event);
        resolve(event);
      };
      ndef.onreadingerror = () => {
        onError?.({ code: "READ_ERROR", message: "Could not read tag data." });
        resolve(null);
      };
    });
  } catch (err) {
    onError?.({ code: "UNKNOWN", message: err.message || "Unknown NFC error." });
    return null;
  }
}
