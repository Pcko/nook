import { useEffect } from "react";

/**
 * Simple module-level store for export settings.
 * @type {WebsiteExportSettings}
 */
let currentSettings = {
  title: "My Nook Site",
  description: "Made with Nook",
  language: "en",
  lightDataUrl: "",
  darkDataUrl: "",
};

/**
 * React hook to keep export settings in sync with the UI.
 * Call this from React components (e.g., WebsiteSettings).
 *
 * @param {WebsiteExportSettings} settings - Latest values coming from the UI.
 * @returns {void}
 */
export function useWebsiteExportSettings(settings) {
  const { title, description, language, lightDataUrl, darkDataUrl } = settings;

  useEffect(() => {
    currentSettings = {
      ...currentSettings,
      title,
      description,
      language,
      lightDataUrl,
      darkDataUrl,
    };
  }, [title, description, language, lightDataUrl, darkDataUrl]);
}

/**
 * Read the latest export settings from non-React code (e.g., exportConfig).
 *
 * @returns {WebsiteExportSettings} The last values provided via useWebsiteExportSettings.
 */
export function getWebsiteExportSettings() {
  return currentSettings;
}
