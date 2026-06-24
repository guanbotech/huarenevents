"use client";

import { useEffect, useState } from "react";

type ThemeMode = "system" | "light" | "dark";

const labels: Record<ThemeMode, string> = {
  system: "自动",
  light: "白天",
  dark: "夜晚"
};

function applyTheme(mode: ThemeMode) {
  if (mode === "system") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("theme-mode");
    return;
  }

  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("theme-mode", mode);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const stored = localStorage.getItem("theme-mode");
    const initialMode = stored === "light" || stored === "dark" ? stored : "system";
    setMode(initialMode);
    applyTheme(initialMode);
  }, []);

  function toggleMode() {
    const nextMode: ThemeMode = mode === "system" ? "light" : mode === "light" ? "dark" : "system";
    setMode(nextMode);
    applyTheme(nextMode);
  }

  return (
    <button
      aria-label={`当前主题：${labels[mode]}。点击切换白天夜晚模式`}
      className="theme-toggle"
      onClick={toggleMode}
      title={`当前：${labels[mode]}`}
      type="button"
    >
      <span className="theme-toggle-icon" aria-hidden="true">{mode === "dark" ? "夜" : mode === "light" ? "昼" : "自"}</span>
      <span>{labels[mode]}</span>
    </button>
  );
}
