import type { Translations } from "@/i18n/types";

const BUILTIN: Record<string, keyof Translations["app"]["nav"]> = {
  "/chat": "chat",
  "/sessions": "sessions",
  "/analytics": "analytics",
  "/logs": "logs",
  "/cron": "cron",
  "/skills": "skills",
  "/config": "config",
  "/env": "keys",
  "/docs": "documentation",
};

export function resolvePageTitle(
  pathname: string,
  t: Translations,
  pluginTabs: { path: string; label: string }[],
): string {
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (normalized === "/") {
    return t.app.nav.sessions;
  }
  const key = BUILTIN[normalized];
  if (key) {
    return t.app.nav[key];
  }
  const plugin = pluginTabs.find((p) => p.path === normalized);
  if (plugin) {
    const pluginNavKey = normalized.slice(1) as keyof Translations["app"]["nav"];
    if (pluginNavKey in t.app.nav) {
      return t.app.nav[pluginNavKey];
    }
    return plugin.label;
  }
  return t.app.webUi;
}
