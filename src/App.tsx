import { useEffect } from "react";
import "./App.css";
import { ContextMenuProvider } from "./components/ContextMenu";
import { MainWindow } from "./components/MainWindow";
import { NotePad } from "./components/NotePad";
import { TileShowcase } from "./components/TileShowcase";
import { getConfig } from "./features/settings/api";
import { applyTheme, applyBackgroundImage, watchSystemTheme } from "./features/settings/theme";
import type { AppConfig, ThemeOption } from "./features/settings/types";
import { getInitialRoute } from "./features/windows/windowRoutes";
import { syncLanguage } from "./locales";
import { listen } from "@tauri-apps/api/event";

function App() {
  const route = getInitialRoute();
  const activeView = route.view;

  useEffect(() => {
    let cleanup = () => {};
    let bgCleanup = () => {};
    getConfig()
      .then((config) => {
        const theme = (config.theme || "system") as ThemeOption;
        applyTheme(theme);
        cleanup = watchSystemTheme(theme);
        void syncLanguage(config.locale);

        // Apply background image if enabled
        applyBackgroundImage({
          backgroundImageEnabled: config.backgroundImageEnabled ?? false,
          backgroundImage: config.backgroundImage ?? "",
          backgroundImageOpacity: config.backgroundImageOpacity ?? 0.5,
          backgroundImageFit: config.backgroundImageFit ?? "cover",
        });
      })
      .catch(() => {});
    return () => cleanup();
  }, []);

  useEffect(() => {
    let themeCleanup = () => {};
    let bgCleanup = () => {};
    const unlisten = listen<AppConfig>("config-changed", (event) => {
      const theme = (event.payload.theme || "system") as ThemeOption;
      applyTheme(theme);
      themeCleanup();
      themeCleanup = watchSystemTheme(theme);
      void syncLanguage(event.payload.locale);

      // Apply background image changes
      applyBackgroundImage({
        backgroundImageEnabled: event.payload.backgroundImageEnabled ?? false,
        backgroundImage: event.payload.backgroundImage ?? "",
        backgroundImageOpacity: event.payload.backgroundImageOpacity ?? 0.5,
        backgroundImageFit: event.payload.backgroundImageFit ?? "cover",
      });
    });
    return () => {
      themeCleanup();
      void unlisten.then((fn) => fn());
    };
  }, []);

  useEffect(() => {
    const isWindows =
      navigator.userAgent.includes("Windows") || navigator.platform.toLowerCase().startsWith("win");
    if (!isWindows) return;

    const preventSystemMenu = (e: KeyboardEvent) => {
      if (e.altKey && e.code === "Space") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", preventSystemMenu, true);
    return () => document.removeEventListener("keydown", preventSystemMenu, true);
  }, []);

  return (
    <ContextMenuProvider>
      {/* Background layer for wallpaper */}
      <div className="app-bg-layer" />
      <div className="app-window-shell h-screen font-body text-ink overflow-hidden">
        {activeView === "main" ? (
          <MainWindow />
        ) : activeView === "notepad" ? (
          <NotePad initialNoteId={route.noteId} />
        ) : (
          <TileShowcase noteId={route.noteId} />
        )}
      </div>
    </ContextMenuProvider>
  );
}

export default App;
