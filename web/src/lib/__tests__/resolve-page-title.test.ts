import { describe, it, expect } from "vitest";
import { resolvePageTitle } from "../resolve-page-title";
import { en } from "../../i18n/en";
import type { Translations } from "../../i18n/types";

describe("resolvePageTitle", () => {
  const t = en as Translations;
  const pluginTabs = [
    { path: "/kanban", label: "Kanban" },
    { path: "/example", label: "Example" },
  ];

  it("resolves builtin pages via i18n", () => {
    expect(resolvePageTitle("/sessions", t, pluginTabs)).toBe("Sessions");
    expect(resolvePageTitle("/config", t, pluginTabs)).toBe("Config");
  });

  it("resolves plugin pages via i18n when key exists", () => {
    expect(resolvePageTitle("/kanban", t, pluginTabs)).toBe("Kanban");
    expect(resolvePageTitle("/example", t, pluginTabs)).toBe("Example");
  });

  it("falls back to plugin label when no i18n key", () => {
    const customPlugins = [
      { path: "/custom-plugin", label: "My Custom Plugin" },
    ];
    expect(resolvePageTitle("/custom-plugin", t, customPlugins)).toBe("My Custom Plugin");
  });

  it("returns sessions title for root path", () => {
    expect(resolvePageTitle("/", t, pluginTabs)).toBe("Sessions");
  });

  it("returns webUi title for unknown paths", () => {
    expect(resolvePageTitle("/unknown", t, [])).toBe(t.app.webUi);
  });

  it("handles trailing slashes", () => {
    expect(resolvePageTitle("/kanban/", t, pluginTabs)).toBe("Kanban");
  });
});
