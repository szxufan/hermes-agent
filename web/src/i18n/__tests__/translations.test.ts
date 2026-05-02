import { describe, it, expect } from "vitest";
import { en } from "../en";
import { zh } from "../zh";
import type { Translations } from "../types";

function getAllKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...getAllKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

describe("i18n translation completeness", () => {
  it("en and zh have the same keys", () => {
    const enKeys = getAllKeys(en as unknown as Record<string, unknown>).sort();
    const zhKeys = getAllKeys(zh as unknown as Record<string, unknown>).sort();
    expect(enKeys).toEqual(zhKeys);
  });

  it("kanban translations exist in both locales", () => {
    expect(en.kanban).toBeDefined();
    expect(zh.kanban).toBeDefined();
    expect(typeof en.kanban.loading).toBe("string");
    expect(typeof zh.kanban.loading).toBe("string");
    expect(en.kanban.loading).toBeTruthy();
    expect(zh.kanban.loading).toBeTruthy();
  });

  it("examplePage translations exist in both locales", () => {
    expect(en.examplePage).toBeDefined();
    expect(zh.examplePage).toBeDefined();
    expect(typeof en.examplePage.title).toBe("string");
    expect(typeof zh.examplePage.title).toBe("string");
    expect(en.examplePage.title).toBeTruthy();
    expect(zh.examplePage.title).toBeTruthy();
  });

  it("kanban nav key exists in both locales", () => {
    expect(en.app.nav.kanban).toBe("Kanban");
    expect(zh.app.nav.kanban).toBe("看板");
  });

  it("example nav key exists in both locales", () => {
    expect(en.app.nav.example).toBe("Example");
    expect(zh.app.nav.example).toBe("示例");
  });

  it("kanban has all required keys", () => {
    const requiredKanbanKeys: (keyof Translations["kanban"])[] = [
      "loading", "loadFailed", "loadFailedHint", "renderingError",
      "reloadView", "wsAuthFailed", "moveFailed", "taskCreatedWarning",
      "search", "filterCards", "tenant", "allTenants", "assignee",
      "allProfiles", "showArchived", "lanesByProfile", "lanesByProfileTitle",
      "nudgeDispatcher", "selected", "toReady", "complete", "archive",
      "confirmBulkDone", "confirmBulkArchive", "reassign", "unassign",
      "apply", "unassigned", "createTaskInColumn", "noTasks",
      "selectForBulk", "childTasksDone", "untitled", "roughIdea",
      "newTaskTitle", "specifier", "assigneePlaceholder", "priority",
      "skillsPlaceholder", "noParent", "loadingDrawer", "addComment",
      "comment", "clickToEdit", "status", "workspace", "skills",
      "createdBy", "result", "comments", "noComments", "events",
      "runHistory", "earlier", "noProfile", "noWorkerLog", "workerLog",
      "refreshLog", "showingLast", "fullLogAt", "emptyUnassign",
      "editDescription", "noDescription", "parents", "children", "none",
      "removeDependency", "addParent", "addChild", "confirmDone",
      "confirmArchived", "confirmBlocked", "toTriage", "toRunning",
      "block", "unblock",
    ];
    for (const key of requiredKanbanKeys) {
      expect(en.kanban[key], `Missing en.kanban.${key}`).toBeDefined();
      expect(zh.kanban[key], `Missing zh.kanban.${key}`).toBeDefined();
    }
  });

  it("examplePage has all required keys", () => {
    const requiredExampleKeys: (keyof Translations["examplePage"])[] = [
      "title", "version", "description", "callBackendApi", "loading",
      "backendNotAvailable", "sdkReference", "sdkReact", "sdkReactDesc",
      "sdkHooks", "sdkHooksDesc", "sdkComponents", "sdkComponentsDesc",
      "sdkApi", "sdkApiDesc", "sdkUtils", "sdkUtilsDesc",
      "sessionsBanner", "sessionsBannerSlot",
    ];
    for (const key of requiredExampleKeys) {
      expect(en.examplePage[key], `Missing en.examplePage.${key}`).toBeDefined();
      expect(zh.examplePage[key], `Missing zh.examplePage.${key}`).toBeDefined();
    }
  });

  it("no empty Chinese translations for kanban", () => {
    for (const [key, value] of Object.entries(zh.kanban)) {
      expect(value, `zh.kanban.${key} is empty`).toBeTruthy();
    }
  });

  it("no empty Chinese translations for examplePage", () => {
    for (const [key, value] of Object.entries(zh.examplePage)) {
      expect(value, `zh.examplePage.${key} is empty`).toBeTruthy();
    }
  });
});
