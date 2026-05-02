# 修改历史记录

## 2026-05-02: 修复升级逻辑中错误引用 main 分支的问题

### 目标
项目的主分支是 `master`，但升级/更新逻辑中硬编码了 `main` 分支，导致 `hermes update` 和更新检查功能无法正确工作。将所有升级相关代码中的 `main` 分支引用改为 `master`。

### 修改文件

#### 1. 核心升级逻辑 — `hermes_cli/main.py`
- `_cmd_update_check()`: `git rev-list HEAD..origin/main` → `origin/master`，提示信息同步修改
- `_cmd_update_impl()`: `branch = "main"` → `"master"`，分支切换逻辑 `current_branch != "main"` → `"master"`，`git checkout main` → `master`
- `git pull --ff-only origin main` → `master`
- `git reset --hard origin/main` → `origin/master`
- 手动修复提示 `git reset --hard origin/main` → `origin/master`
- Fork 同步条件 `branch == "main"` → `"master"`
- `_sync_with_upstream_if_needed()`: 所有 `origin/main`/`upstream/main` 引用改为 `origin/master`/`upstream/master`，`git pull upstream main` → `master`
- `_update_via_zip()`: `branch = "main"` → `"master"`
- 非仓库安装提示 URL 中 `hermes-agent/main/` → `hermes-agent/master/`

#### 2. 启动更新检查 — `hermes_cli/banner.py`
- `_check_via_rev()`: `refs/heads/main` → `refs/heads/master`
- `_check_via_local_git()`: `HEAD..origin/main` → `origin/master`
- `check_for_updates()`: 文档字符串中 `origin/main` → `origin/master`
- `get_git_banner_state()`: `origin/main` → `origin/master`（两处）

#### 3. 安装脚本 — `scripts/install.sh`
- `BRANCH="main"` → `BRANCH="master"`

#### 4. 测试文件
- `tests/hermes_cli/test_update_check.py`: 新增 `test_check_via_local_git_uses_master_branch` 和 `test_check_via_rev_uses_master_branch` 测试
- `tests/hermes_cli/test_cmd_update.py`: 所有 `branch="main"` → `"master"`，断言中 `origin/main` → `origin/master`，`main` → `master`
- `tests/hermes_cli/test_update_autostash.py`: 默认 `current_branch="main"` → `"master"`，所有 `origin/main` → `origin/master`，`checkout main` → `master`，`pull origin main` → `master`，`reset --hard origin/main` → `origin/master`，测试函数名 `switches_to_main` → `switches_to_master`
- `tests/hermes_cli/test_banner_git_state.py`: `origin/main` → `origin/master`
- `tests/hermes_cli/test_backup.py`: `refs/heads/main` → `refs/heads/master`
- `tests/tools/test_checkpoint_manager.py`: `refs/heads/main` → `refs/heads/master`（两处）
- `tests/cli/test_worktree.py`: `refs/remotes/origin/main` → `refs/remotes/origin/master`

### 验证
- 134 个相关测试全部通过（`pytest tests/hermes_cli/test_update_check.py tests/hermes_cli/test_cmd_update.py tests/hermes_cli/test_update_autostash.py tests/hermes_cli/test_banner_git_state.py tests/hermes_cli/test_backup.py`）
- 101 个 checkpoint/worktree 测试全部通过

## 2026-05-02: Dashboard 看板和示例页面汉化

### 目标
为 Dashboard 中的 Kanban（看板）和 Example（示例）页面添加完整的中文汉化支持，包括导航标签和页面内部内容。

### 修改文件

#### 1. i18n 类型定义 — `web/src/i18n/types.ts`
- 在 `Translations.app.nav` 中添加 `kanban: string` 和 `example: string`
- 添加完整的 `kanban` 翻译接口（68 个键），覆盖看板页面所有用户可见文本
- 添加完整的 `examplePage` 翻译接口（19 个键），覆盖示例页面所有用户可见文本

#### 2. 英文翻译 — `web/src/i18n/en.ts`
- 在 `app.nav` 中添加 `kanban: "Kanban"` 和 `example: "Example"`
- 添加完整的 `kanban` 英文翻译对象（68 个键值对）
- 添加完整的 `examplePage` 英文翻译对象（19 个键值对）

#### 3. 中文翻译 — `web/src/i18n/zh.ts`
- 在 `app.nav` 中添加 `kanban: "看板"` 和 `example: "示例"`
- 添加完整的 `kanban` 中文翻译对象（68 个键值对）
- 添加完整的 `examplePage` 中文翻译对象（19 个键值对）

#### 4. 页面标题解析 — `web/src/lib/resolve-page-title.ts`
- 修改解析逻辑：先检查 BUILTIN 映射，再检查插件路径是否有对应的 i18n nav 键
- 插件页面现在优先使用 i18n 翻译标题，无对应键时回退到 manifest.json 中的 label

#### 5. 导航栏 — `web/src/App.tsx`
- 导入 `Translations` 类型
- `buildNavItems()` 新增 `t: Translations` 参数，插件标签优先从 `t.app.nav` 获取
- `pluginTabMeta` useMemo 同样使用 i18n 翻译，并添加 `t` 到依赖数组

#### 6. Kanban 插件 — `plugins/kanban/dashboard/dist/index.js`
- 已在之前修改中使用 `SDK.useI18n()` 获取翻译
- 所有用户可见字符串使用 `t.key || "English fallback"` 模式

#### 7. Example 插件 — `plugins/example-dashboard/dashboard/dist/index.js`
- 添加 `const useI18n = SDK.useI18n;`
- `ExamplePage()` 中通过 `const t = useI18n ? useI18n().examplePage || {} : {};` 获取翻译
- `SessionsTopBanner()` 中同样使用 `useI18n` 获取翻译
- 所有硬编码英文字符串替换为 `t.key || "English fallback"` 模式

#### 8. 测试文件（新增）
- `web/src/i18n/__tests__/translations.test.ts` — 验证 en/zh 键一致性、kanban/examplePage 翻译完整性、无空值
- `web/src/lib/__tests__/resolve-page-title.test.ts` — 验证插件页面标题解析、i18n 优先、回退逻辑

#### 9. 构建配置 — `web/package.json`
- 添加 `vitest` 开发依赖
- 添加 `test` 和 `test:watch` 脚本

### 验证
- TypeScript 类型检查通过（`npx tsc --noEmit`）
- 15 个单元测试全部通过（`npx vitest run`）
