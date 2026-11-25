# CLAUDE.md

本项目的完整协作说明与规约都在 **[AGENTS.md](./AGENTS.md)**，请先读它。

三条最容易踩的：

1. **有哪些动效、能用在哪** → `docs/EFFECTS.md`（41 个动效速查表 + 逐个小节）；结构化数据在 `docs/effects.json`；不确定用哪个跑 `npm run find -- 关键词`。
2. **`docs/` 是生成物，禁止手改**。改特效元数据只改 `src/lib/catalog.ts`（边框系列是 `catalog.borders.ts`）+ 注册表 `src/effects/index.ts`，然后 `npm run docs`（`dev` / `build` 会自动跑）。
3. **新增动效的元数据不是可选项**：`keywords` / `useCases` / `tags` 直接决定搜索和智能选型的命中率，详见 AGENTS.md §5.3 的字段表。

其它约定（视觉 token、`DemoProps` 契约、reduced-motion 降级、配置持久化）见 AGENTS.md §6–§9。
