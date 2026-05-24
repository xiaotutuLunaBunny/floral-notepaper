import { convertFileSrc } from "@tauri-apps/api/core";
import type { ThemeOption, AppConfig } from "./types";

export type BackgroundImageFit = "cover" | "contain" | "fill";

function resolveTheme(option: ThemeOption): "light" | "dark" {
  if (option === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return option;
}

export function applyTheme(option: ThemeOption): void {
  const root = document.documentElement;
  const resolved = resolveTheme(option);
  if (root.getAttribute("data-theme") !== resolved) {
    root.classList.add("theme-transition");
    root.setAttribute("data-theme", resolved);
    setTimeout(() => root.classList.remove("theme-transition"), 400);
  }
}

let systemListener: (() => void) | null = null;

export function watchSystemTheme(option: ThemeOption): () => void {
  if (systemListener) {
    systemListener();
    systemListener = null;
  }

  if (option !== "system") return () => {};

  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => applyTheme("system");
  mql.addEventListener("change", handler);

  const cleanup = () => {
    mql.removeEventListener("change", handler);
    systemListener = null;
  };
  systemListener = cleanup;
  return cleanup;
}

export function applyBackgroundImage(config: {
  backgroundImageEnabled: boolean;
  backgroundImage: string;
  backgroundImageOpacity: number;
  backgroundImageFit: BackgroundImageFit;
}): void {
  const root = document.documentElement;

  if (config.backgroundImageEnabled && config.backgroundImage) {
    const imageSrc = config.backgroundImage.startsWith("http")
      ? config.backgroundImage
      : convertFileSrc(config.backgroundImage);

    root.style.setProperty("--bg-image", `url("${imageSrc}")`);
    root.style.setProperty("--bg-image-opacity", String(config.backgroundImageOpacity));
    root.style.setProperty("--bg-image-fit", config.backgroundImageFit);
    root.setAttribute("data-bg-image", "true");
  } else {
    root.style.removeProperty("--bg-image");
    root.style.removeProperty("--bg-image-opacity");
    root.style.removeProperty("--bg-image-fit");
    root.removeAttribute("data-bg-image");
  }
}
