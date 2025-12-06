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
  useEffect(() => {
    currentSettings = {
      ...currentSettings,
      ...settings,
    };
  }, [ settings.title, settings.description, settings.language, settings.lightDataUrl, settings.darkDataUrl, settings,
  ]);
}

/**
 * Read the latest export settings from non-React code (e.g., exportConfig).
 *
 * @returns {WebsiteExportSettings} The last values provided via useWebsiteExportSettings.
 */
export function getWebsiteExportSettings() {
  return currentSettings;
}
