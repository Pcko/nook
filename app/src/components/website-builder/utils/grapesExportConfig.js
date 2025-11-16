import pluginExport from "grapesjs-plugin-export";

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
 * Extract the file extension from a data:image/* base64 URL.
 * @param {string} dataUrl
 * @returns {string} extension
 */
function getExtFromDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:image\/([^;]+);/);
  return match ? match[1].toLowerCase() : "png";
}

/**
 * Configuration for grapesjs-plugin-export.
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

      return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <link rel="stylesheet" href="css/style.css" />
        </head>
        <body>
            ${html}
        </body>
        </html>`;
    },

    /**
     * Export compiled CSS.
     */
    css: {
      "style.css": editor => editor.getCss(),
    },

    /**
     * Export embedded images.
     * @param {import('grapesjs').Editor} editor
     * @returns {Promise<Object<string,string>>}
     */
    img: async editor => {
      const output = {};
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

      return output;
    }
  }
};

export const grapesjsExportPlugin = pluginExport;
