/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from "react";

/**
 * Convert a File into a data URL string using FileReader.
 *
 * @param {File|null} file File to read or null to reset.
 * @returns {string} data URL for the file or empty string.
 */
function useFileDataUrl(file) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setDataUrl("");
      return;
    }

    const reader = new FileReader();
    /**
     * Store the resulting data URL once the file is loaded.
     */
    reader.onload = () => {
      if (typeof reader.result === "string") setDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }, [file]);

  return dataUrl;
}

/**
 * Render a single favicon preview card with an upload button.
 *
 * @param {Object} root0
 * @param {"light"|"dark"} root0.theme Theme variant label.
 * @param {string} root0.frameSrc Background/frame image source.
 * @param {string} root0.iconSrc Icon image source used in the preview.
 * @param {(file: File|null) => void} root0.onPickFile Callback when a file is picked.
 */
function ImageThemeCard({
  theme,
  frameSrc,
  iconSrc,
  onPickFile,
}) {
  const inputRef = useRef(null);

  return (
    <div className="min-w-0">
      <div className="rounded-md bg-ui-bg p-2 px-0">
        <div className="relative w-full overflow-hidden rounded-sm">
          <div className="relative w-full aspect-[5/3]">
            <img
              alt={`${theme} preview`}
              className="absolute inset-0 h-full w-full object-contain"
              draggable={false}
              src={frameSrc}
            />
            <img
              alt={`${theme} favicon`}
              className="absolute"
              draggable={false}
              src={iconSrc}
              style={{
                width: "10%",
                maxWidth: 48,
                minWidth: 18,
                height: "auto",
                top: "46%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                borderRadius: 10,
              }}
            />
          </div>
        </div>

        <div className="mt-2">
          <input
            accept="image/png,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,image/webp"
            className="hidden"
            onChange={e => {
              onPickFile(e.target.files?.[0] ?? null);
              e.currentTarget.value = "";
            }}
            ref={inputRef}
            type="file"
          />
          <button
            className="w-full rounded-md border-2 border-ui-border bg-ui-bg px-2 py-1.5 text-small text-text hover:bg-ui-bg-selected focus:outline-none focus:border-ui-border-selected focus:ring-1 focus:ring-ui-border-selected"
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            Upload Icon
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Two-theme favicon preview (light/dark) with change callback.
 */
export default function FaviconPreviewThemes({ frameLightSrc, frameDarkSrc, defaultLightIconSrc, defaultDarkIconSrc, onChange,}) {
  const [lightFile, setLightFile] = useState(null);
  const [darkFile, setDarkFile] = useState(null);

  const lightDataUrl = useFileDataUrl(lightFile);
  const darkDataUrl = useFileDataUrl(darkFile);

  const lightIconSrc = lightDataUrl || defaultLightIconSrc;
  const darkIconSrc = darkDataUrl || defaultDarkIconSrc;

  useEffect(() => {
    onChange?.({
      lightFile,
      darkFile,
      lightDataUrl,
      darkDataUrl,
      lightIconSrc,
      darkIconSrc,
    });
  }, [
    lightFile,
    darkFile,
    lightDataUrl,
    darkDataUrl,
    lightIconSrc,
    darkIconSrc,
    onChange,
  ]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">
        <ImageThemeCard
          frameSrc={frameLightSrc}
          iconSrc={lightIconSrc}
          onPickFile={setLightFile}
          theme="light"
        />
        <ImageThemeCard
          frameSrc={frameDarkSrc}
          iconSrc={darkIconSrc}
          onPickFile={setDarkFile}
          theme="dark"
        />
      </div>
    </div>
  );
}
