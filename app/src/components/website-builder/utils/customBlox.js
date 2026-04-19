const STORAGE_KEY = "website-builder-user-blox";

/**
 *
 * @param raw
 */
function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Returns stored user blox.
 * @returns {any} The computed result of the operation.
 */
export function getStoredUserBlox() {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

/**
 *
 * @param items
 */
function setStoredUserBlox(items) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/**
 * Handles the slugify operation.
 *
 * @param {any} input - The input value to process.
 */
function slugify(input) {
  return String(input || "blox")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "blox";
}

/**
 *
 * @param name
 */
function toBlockId(name) {
  return `user-blox-${slugify(name)}`;
}

/**
 * Returns scoped html.
 *
 * @param {any} editor - The editor value.
 * @param {any} component - The component value.
 * @returns {any} The computed result of the operation.
 */
function getScopedHtml(editor, component) {
  try {
    if (typeof editor?.getHtml === "function") {
      return editor.getHtml({ component });
    }
  } catch {}

  try {
    return component?.toHTML?.() || "";
  } catch {
    return "";
  }
}

/**
 * Returns scoped css.
 *
 * @param {any} editor - The editor value.
 * @param {any} component - The component value.
 * @returns {any} The computed result of the operation.
 */
function getScopedCss(editor, component) {
  try {
    if (typeof editor?.getCss === "function") {
      return editor.getCss({ component }) || "";
    }
  } catch {}

  return "";
}

/**
 *
 * @param html
 * @param css
 */
function buildBlockContent(html, css) {
  const trimmedHtml = String(html || "").trim();
  const trimmedCss = String(css || "").trim();

  if (!trimmedHtml) {
    throw new Error("Selected blox is empty.");
  }

  if (!trimmedCss) return trimmedHtml;

  return `${trimmedHtml}<style>${trimmedCss}</style>`;
}

/**
 *
 * @param html
 */
function stripStylesAndScripts(html) {
  return String(html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+=("[^"]*"|'[^']*')/gi, "");
}

/**
 *
 * @param value
 */
function escapeHtmlAttr(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 *
 * @param html
 * @param css
 */
function buildPreviewDocument(html, css) {
  const safeHtml = stripStylesAndScripts(html);
  const safeCss = String(css || "").replace(/<\/style>/gi, "");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      :root {
        --wb-preview-artboard-width: 1200px;
        --wb-preview-artboard-height: 900px;
        --wb-preview-scale: 0.08;
      }

      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #ffffff;
        color: #111827;
        font-family: Inter, Arial, sans-serif;
      }

      *, *::before, *::after {
        box-sizing: border-box;
      }

      body {
        position: relative;
      }

      #wb-preview-viewport {
        position: absolute;
        inset: 0;
        overflow: hidden;
        background: #ffffff;
      }

      #wb-preview-stage {
        position: absolute;
        top: 50%;
        left: 50%;
        width: var(--wb-preview-artboard-width);
        height: var(--wb-preview-artboard-height);
        transform: translate(-50%, -50%) scale(var(--wb-preview-scale));
        transform-origin: center center;
        overflow: hidden;
        background: #ffffff;
      }

      #wb-preview-root {
        width: 100%;
        min-height: 100%;
        overflow: hidden;
      }

      #wb-preview-root *,
      #wb-preview-root *::before,
      #wb-preview-root *::after {
        animation: none !important;
        transition: none !important;
      }

      #wb-preview-root img,
      #wb-preview-root svg,
      #wb-preview-root video,
      #wb-preview-root canvas,
      #wb-preview-root iframe {
        max-width: 100% !important;
        height: auto !important;
      }

      #wb-preview-root [style*="position: fixed"],
      #wb-preview-root [style*="position:fixed"],
      #wb-preview-root [style*="position: sticky"],
      #wb-preview-root [style*="position:sticky"] {
        position: absolute !important;
      }

      #wb-preview-root section,
      #wb-preview-root div,
      #wb-preview-root header,
      #wb-preview-root footer,
      #wb-preview-root main,
      #wb-preview-root aside,
      #wb-preview-root article {
        max-width: 100% !important;
      }

      #wb-preview-root {
        font-size: 14px;
        line-height: 1.2;
      }

      ${safeCss}
    </style>
  </head>
  <body>
    <div id="wb-preview-viewport">
      <div id="wb-preview-stage">
        <div id="wb-preview-root">${safeHtml}</div>
      </div>
    </div>
  </body>
</html>`;
}

/**
 *
 * @param name
 * @param html
 * @param css
 * @param id
 */
function makeUserBloxLabel(name, html, css, id) {
  const previewDoc = escapeHtmlAttr(buildPreviewDocument(html, css));
  const escapedName = escapeHtmlAttr(name);
  const escapedId = escapeHtmlAttr(id);

  return `
    <div class="wb-block-label wb-block-label--blox-preview">
      <button
        type="button"
        class="wb-block-label__delete"
        data-wb-blox-delete="${escapedId}"
        title="Delete blox"
        aria-label="Delete blox ${escapedName}"
      >×</button>
      <div class="wb-block-label__preview">
        <iframe class="wb-block-label__preview-frame" sandbox="" loading="lazy" tabindex="-1" srcdoc="${previewDoc}"></iframe>
      </div>
      <div class="wb-block-label__title">${name}</div>
    </div>
  `;
}

/**
 *
 * @param blockId
 */
function removeStoredUserBlox(blockId) {
  const existing = getStoredUserBlox();
  const next = existing.filter((item) => item?.id !== blockId);
  setStoredUserBlox(next);
}

/**
 * Handles the delete user blox operation.
 *
 * @param {any} editor - The editor value.
 * @param {any} blockId - The block id value.
 */
export function deleteUserBlox(editor, blockId) {
  if (!blockId) return;
  removeStoredUserBlox(blockId);
  const blockManager = editor?.BlockManager;
  if (blockManager?.get(blockId)) {
    blockManager.remove(blockId);
  }
}

/**
 * Handles the init user blox ui operation.
 *
 * @param {any} editor - The editor value.
 */
export function initUserBloxUi(editor) {
  if (!editor || typeof document === "undefined") return () => {};

  /**
 * Handles document click.
 *
 * @param {any} event - The event payload for the current interaction.
 */
  const handleDocumentClick = (event) => {
    const deleteButton = event.target?.closest?.("[data-wb-blox-delete]");
    if (!deleteButton) return;

    event.preventDefault();
    event.stopPropagation();

    const blockId = deleteButton.getAttribute("data-wb-blox-delete");
    if (!blockId) return;

    deleteUserBlox(editor, blockId);
  };

  document.addEventListener("click", handleDocumentClick, true);

  return () => {
    document.removeEventListener("click", handleDocumentClick, true);
  };
}

/**
 * Saves selected component as user blox.
 *
 * @param {any} editor - The editor value.
 * @param {any} component - The component value.
 * @param {any} name - The name value.
 */
export function saveSelectedComponentAsUserBlox(editor, component, name) {
  if (!editor || !component) throw new Error("No component selected.");

  const trimmedName = String(name || "").trim();
  if (!trimmedName) throw new Error("Missing blox name.");

  const html = getScopedHtml(editor, component);
  const css = getScopedCss(editor, component);
  const content = buildBlockContent(html, css);

  const entry = {
    id: toBlockId(trimmedName),
    name: trimmedName,
    tooltip: `Reusable section: ${trimmedName}`,
    category: "My Blox",
    content,
    previewHtml: html,
    previewCss: css,
    createdAt: new Date().toISOString(),
  };

  const existing = getStoredUserBlox();
  const next = [entry, ...existing.filter((item) => item?.name !== trimmedName && item?.id !== entry.id)];
  setStoredUserBlox(next);
  return entry;
}

/**
 * Loads user blox blocks.
 *
 * @param {any} editor - The editor value.
 */
export function loadUserBloxBlocks(editor) {
  if (!editor) return;
  getStoredUserBlox().forEach((block) => {
    addUserBloxBlockToEditor(editor, block);
  });
}

/**
 * Handles the add user blox block to editor operation.
 *
 * @param {any} editor - The editor value.
 * @param {any} block - The block value.
 */
export function addUserBloxBlockToEditor(editor, block) {
  if (!editor || !block) return;

  const blockManager = editor.BlockManager;
  const existing = blockManager.get(block.id);
  if (existing) {
    blockManager.remove(block.id);
  }

  blockManager.add(block.id, {
    label: makeUserBloxLabel(block.name, block.previewHtml || block.content, block.previewCss || "", block.id),
    content: block.content,
    category: block.category || "My Blox",
    attributes: {
      title: block.tooltip || block.name,
    },
  });
}
