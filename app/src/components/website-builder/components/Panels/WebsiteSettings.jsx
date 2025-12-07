import React, { useState } from "react";

import faviconDark from "../../../../assets/resources/favicon-dark.png";
import faviconLight from "../../../../assets/resources/favicon-light.png";
import frameDark from "../../../../assets/resources/frame-dark.png";
import frameLight from "../../../../assets/resources/frame-light.png";
import { useWebsiteExportSettings } from "../../utils/websiteExportSettings";

import FaviconPreviewThemes from "./FaviconPreviewThemes";


const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
];

const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 155;
const ELLIPSIS = "…";


/**
 * Site-level settings panel for title, language, description and favicons.
 *
 * @returns {JSX.Element} Website settings form and preview.
*/
export default function WebsiteSettings() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("en");
  const [description, setDescription] = useState("");
  const [favicons, setFavicons] = useState({
    lightDataUrl: "",
    darkDataUrl: "",
  });

  const languageObj =
    LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const rawTitle = (title || "My Nook Site").trim();
  const previewTitle =
    rawTitle.length > MAX_TITLE_LENGTH
      ? rawTitle.slice(0, MAX_TITLE_LENGTH - ELLIPSIS.length) + ELLIPSIS
      : rawTitle;

  const rawDescription = (description || "Made with Nook").trim();
  const previewDescription =
    rawDescription.length > MAX_DESCRIPTION_LENGTH
      ? rawDescription.slice(0, MAX_DESCRIPTION_LENGTH - ELLIPSIS.length) + ELLIPSIS
      : rawDescription;

  const fieldClass =
    "w-full rounded-md border-2 border-ui-border bg-ui-bg text-small text-text " +
    "placeholder:text-text-subtle focus:outline-none focus:border-ui-border-selected ";

  // Push current settings into the export store (read later by grapesjsExportConfig)
  useWebsiteExportSettings({
    title: rawTitle,
    description: rawDescription,
    language,
    lightDataUrl: favicons.lightDataUrl,
    darkDataUrl: favicons.darkDataUrl,
  });

  return (
    <div className="mt-2 w-full rounded-lg border-2 border-ui-border bg-ui-bg p-3 space-y-3">
      <div>
        <label
          className="block text-small font-medium text-text mb-1"
          htmlFor="site-title"
        >
          Site title
        </label>
        <input
          className={`${fieldClass} px-2 py-1.5`}
          id="site-title"
          onChange={e => setTitle(e.target.value)}
          placeholder="My Nook Site"
          type="text"
          value={title}
        />
      </div>

      <div>
        <label
          className="block text-small font-medium text-text mb-1"
          htmlFor="site-language"
        >
          Site language
        </label>
        <select
          className={`${fieldClass} px-2.5 py-2`}
          id="site-language"
          onChange={e => setLanguage(e.target.value)}
          value={language}
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          className="block text-small font-medium text-text mb-1"
          htmlFor="site-description"
        >
          Site description
        </label>
        <textarea
          className={`${fieldClass} px-3 py-2 min-h-[56px] resize-y`}
          id="site-description"
          maxLength={155}
          onChange={e => setDescription(e.target.value)}
          placeholder="Made with Nook"
          rows={2}
          value={description}
        />
        <div className="mt-1 flex items-center justify-end">
          <span className="text-tiny text-text-subtle">
            {description.length}/155
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-small font-medium text-text-subtle">
            Preview
          </span>
          <span className="text-tiny text-text-subtle">
            {languageObj.flag} {languageObj.label}
          </span>
        </div>

        <div className="rounded-lg border-2 border-ui-border bg-ui-bg p-3">
          <div className="flex items-center justify-between min-w-0">
            <span className="text-small text-text-subtle truncate pr-2">
              yoursite.url
            </span>
            <div className="rounded-md p-1 text-text-subtle">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="4" r="1.6" />
                <circle cx="10" cy="10" r="1.6" />
                <circle cx="10" cy="16" r="1.6" />
              </svg>
            </div>
          </div>

          <div className="mt-1 text-h6 font-medium text-primary break-words leading-snug">
            {previewTitle}
          </div>

          <div className="mt-1 text-small text-text break-words leading-snug">
            {previewDescription}
          </div>
        </div>

        <div className="mt-2">
          <FaviconPreviewThemes
            defaultDarkIconSrc={faviconDark}
            defaultLightIconSrc={faviconLight}
            frameDarkSrc={frameDark}
            frameLightSrc={frameLight}
            onChange={v =>
              setFavicons({
                lightDataUrl: v.lightDataUrl,
                darkDataUrl: v.darkDataUrl,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
