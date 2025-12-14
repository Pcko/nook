/* eslint-disable no-undef */
import pluginExport from "grapesjs-plugin-export";

import faviconDark from "../../../assets/resources/favicon-dark.png";
import faviconLight from "../../../assets/resources/favicon-light.png";

import { getWebsiteExportSettings } from "./websiteExportSettings";

/**
 * Convert a base64 string (without data URL prefix) into a binary string
 * suitable for JSZip file content.
 * @param {string} base64
 * @returns {string} binary string
 */
function base64ToBinary(base64) {
  const raw = atob(base64);
  let binary = "";
  for (let i = 0; i < raw.length; i++) {
    binary += String.fromCharCode(raw.charCodeAt(i));
  }
  return binary;
}

/**
 * Convert an ArrayBuffer to a binary string (for JSZip).
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function arrayBufferToBinary(buffer) {
  const bytes = new Uint8Array(buffer);
  const chars = new Array(bytes.length);

  for (let i = 0; i < bytes.length; i++) {
    chars[i] = String.fromCharCode(bytes[i]);
  }

  return chars.join("");
}


/**
 * Fetch a URL (e.g. imported image asset) and return its binary string.
 * @param {string} url
 * @returns {Promise<string>}
 */
async function urlToBinary(url) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return arrayBufferToBinary(buffer);
}

/**
 * Extract the file extension from a data:image/* base64 URL.
 * @param {string} dataUrl
 * @returns {string} extension
 */
function getExtFromDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:image\/([^;]+);/i);
  if (!match) return "png";

  const mimeExt = match[1].toLowerCase();
  if (mimeExt === "svg+xml") return "svg";
  if (mimeExt === "x-icon" || mimeExt === "vnd.microsoft.icon") return "ico";

  return mimeExt;
}

/**
 * Basic HTML escaping for title/description content.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Export inline <img> elements from the editor canvas into the output map.
 * Rewrites only data:image/* sources.
 *
 * @param {import('grapesjs').Editor} editor
 * @param {Record<string, string>} output
 * @returns {void}
 */
function exportCanvasImages(editor, output) {
  const imgs = editor.DomComponents.getWrapper().find("img");

  for (let i = 0; i < imgs.length; i++) {
    const cmp = imgs[i];
    const src = cmp.get("src");

    if (!src || !src.startsWith("data:image")) continue;

    const ext = getExtFromDataUrl(src);
    const filename = `image-${i}.${ext}`;
    const base64 = src.split(",")[1];

    if (!base64) continue;

    output[filename] = base64ToBinary(base64);
  }
}

/**
 * Export favicon images (custom data URLs if present, otherwise defaults)
 * into the output map.
 *
 * @param {{ lightDataUrl?: string; darkDataUrl?: string }} settings
 * @param {Record<string, string>} output
 * @returns {Promise<void>}
 */
async function exportFavicons(settings, output) {
  const { lightDataUrl, darkDataUrl } = settings;

  // Light favicon: prefer custom data URL, otherwise default white.png
  if (lightDataUrl && lightDataUrl.startsWith("data:image")) {
    const ext = getExtFromDataUrl(lightDataUrl);
    const base64 = lightDataUrl.split(",")[1];
    if (base64) {
      output[`favicon-light.${ext}`] = base64ToBinary(base64);
    }
  } else if (faviconLight) {
    output["favicon-light.png"] = await urlToBinary(faviconLight);
  }

  // Dark favicon: prefer custom data URL, otherwise default black.png
  if (darkDataUrl && darkDataUrl.startsWith("data:image")) {
    const ext = getExtFromDataUrl(darkDataUrl);
    const base64 = darkDataUrl.split(",")[1];
    if (base64) {
      output[`favicon-dark.${ext}`] = base64ToBinary(base64);
    }
  } else if (faviconDark) {
    output["favicon-dark.png"] = await urlToBinary(faviconDark);
  }
}

/**
 * Configuration for grapesjs-plugin-export.
 * @type {import('grapesjs-plugin-export').PluginOptions}
 */
export const grapesjsExportConfig = {
  filenamePfx: "website",

  root: {
    /**
     * Generate index.html and rewrite data-URL images to local file paths.
     * @param {import('grapesjs').Editor} editor
     * @returns {Promise<string>}
     */
    "index.html": async editor => {
      let html = editor.getHtml();
      const imgs = editor.DomComponents.getWrapper().find("img");

      imgs.forEach((cmp, i) => {
        const src = cmp.get("src");
        if (!src || !src.startsWith("data:image")) return;

        const ext = getExtFromDataUrl(src);
        const filename = `image-${i}.${ext}`;

        html = html.replaceAll(src, `img/${filename}`);
      });

      const { title, description, language, lightDataUrl, darkDataUrl } =
        getWebsiteExportSettings();

      const langAttr = language || "en";

      /** @type {string[]} */
      const headLines = [
        `<meta charset="UTF-8" />`,
        `<title>${escapeHtml(title)}</title>`,
        `<meta name="description" content="${escapeHtml(description)}" />`,
        `<link rel="stylesheet" href="css/style.css" />`,
      ];

      // Always emit favicon links; fall back to PNG favicons if user hasn't set any.
      const lightExt = lightDataUrl ? getExtFromDataUrl(lightDataUrl) : "png";
      headLines.push(
        `<link rel="icon" href="img/favicon-light.${lightExt}" media="(prefers-color-scheme: light)" />`
      );

      const darkExt = darkDataUrl ? getExtFromDataUrl(darkDataUrl) : "png";
      headLines.push(
        `<link rel="icon" href="img/favicon-dark.${darkExt}" media="(prefers-color-scheme: dark)" />`
      );

      return `
        <!DOCTYPE html>
        <html lang="${langAttr}">
        <head>
          ${headLines.join("\n          ")}
        </head>
        <body>
          ${html}
        </body>
        </html>`;
    },


    css: {
      /**
      * Export compiled CSS from the editor.
      *
      * @param {import('grapesjs').Editor} editor
      * @returns {string} Compiled CSS string
      */
      "style.css": editor => editor.getCss(),
    },

    /**
     * Export embedded images and favicons as a filename→binary string map.
     *
     * @param {import('grapesjs').Editor} editor
     * @returns {Promise<Record<string, string>>}
     */
    img: async editor => {
      /** @type {Record<string, string>} */
      const output = {};

      // Export inline <img> assets from the canvas
      exportCanvasImages(editor, output);

      // Export favicon assets (custom or defaults)
      const settings = getWebsiteExportSettings();
      await exportFavicons(settings, output);

      return output;
    },
  },
};

export const grapesjsExportPlugin = pluginExport;
