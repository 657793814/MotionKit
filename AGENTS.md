# AGENTS.md — MotionKit 协作说明与规约

> 给 AI 编码助手（Claude Code / Cursor / Copilot / Codex…）的入口文件。
> 读这一页就能动手；需要细节时按链接跳转，不要一上来通读几千行的 `catalog.ts`。

## 1. 这是什么

MotionKit 是一套 **可交互的 UI 动效库 + 展示工作台**：收录手写动效 Demo，按「鼠标 / 滚动 / 文字 / 数据高光 / 基础缓动 / 弹窗 / 组件 / 液态玻璃」等分类组织（准确数量与清单以 [`docs/EFFECTS.md`](docs/EFFECTS.md) 为准），支持现场调参、查看代码、切换 6 套皮肤与亮暗主题，并带一个「描述场景 → 推荐动效」的选型器。

纯前端：React 19 + TypeScript + Vite 6，**没有 UI 库，也没有动画库**（所有动效都是手写 CSS/JS）。配置持久化在本地 JSON 文件（见 §8）。

## 2. 要「有哪些动效、能用在哪」，看这里

| 想做的事 | 看这个 |
| --- | --- |
| 浏览全部动效（人 / LLM 读） | **[`docs/EFFECTS.md`](docs/EFFECTS.md)** — 开头是速查表，下面是逐个小节的描述、适用场景、参数表、最小接入代码 |
| 程序化读取元数据 | **[`docs/effects.json`](docs/effects.json)** — 同源结构化数据 |
| 只有一句需求，想找现成的 | `npm run find -- 弹窗 毛玻璃`（按 id/名称/标签/关键词/场景/描述打分） |
| 想抄可粘贴的完整代码（含 CSS） | 应用内打开动效详情页 → 「代码」面板；对应 `catalog.ts` 里该特效的 `code(params)` |

> `docs/` 下的两个文件都是 **`npm run docs` 自动生成的产物，禁止手改**。真源只有两处：`src/lib/catalog.ts`（+ `src/lib/catalog.borders.ts`）的元数据、`src/effects/index.ts` 的组件注册表。

## 3. 目录

```
src/
  components/      应用外壳：Sidebar Home Detail Controls CodeCard Recommender SkinSettingsPanel SelfEffects…
  effects/         41 个动效 Demo（每个 = <Name>.tsx + <Name>.css）+ index.ts 注册表 + borderKit/ 共用边框卡片
  lib/
    catalog.ts        ★ 动效元数据真源（id/名称/描述/场景/关键词/参数/代码模板）
    catalog.borders.ts 边框系列 6 个（被 catalog.ts 展开合并）
    types.ts          EffectMeta / ParamDef / DemoProps 类型定义
    recommend.ts      本地关键词选型 + 可选 AI 选型（OpenAI 兼容接口）
    configStore.ts    配置持久化（本地文件 + localStorage 降级）
    skins.ts          6 套皮肤 × 亮暗两套 token
  styles/          app.css / global.css / skins.css
server/local-store.mjs   Vite 中间件：/api/config 读写 .motionkit/config.json
scripts/           生成与查询脚本（docs / find）
docs/              自动生成的动效清单（勿手改）+ images/（README 真实截图）
```

## 4. 命令

```bash
npm run dev        # 起开发服务（:5178），会先自动同步 docs
npm run build      # tsc -b + vite build，构建前同样自动同步 docs
npm run typecheck  # 只要类型检查
npm run docs       # 重新生成 docs/EFFECTS.md + docs/effects.json
npm run docs:check # 校验 docs 是否落后（落后 exit 1，CI 用）
npm run find -- <关键词…>
```

## 5. 新增 / 修改动效的规约（强制）

一个动效"做完"的标准是下面五步全部完成，缺一步视为未完成。

### 5.1 写组件

- 文件：`src/effects/<Name>.tsx` + 同目录 `<Name>.css`（样式不许写进全局 css）。
- 必须默认导出组件，签名固定为 `DemoProps`：

```ts
// src/lib/types.ts
interface DemoProps {
  params: Params                                   // 键必须与 catalog 里定义的 params 一一对应
  replay: number                                   // 值变化时重播动画（不要用 key 重挂载整棵子树）
  onParamChange?: (key: string, value: string | number | boolean) => void
  onReplay?: () => void
}
```

- 读参数一律走 `num()` / `str()` / `bool()`（`src/lib/utils.ts`），它们带兜底，避免空值把样式写成 `NaN`。

### 5.2 注册

在 `src/effects/index.ts` 的 `demos` 里加一行 `id: Component`，并补 `import`。**id 是主键，必须与 catalog 里的 `id` 完全一致**（camelCase）。

### 5.3 补元数据（写在 `src/lib/catalog.ts`，边框系列写 `catalog.borders.ts`）

按 `EffectMeta` 填全，一个字段都不能省——它们不是装饰，是下面三处在用：

| 字段 | 被谁消费 | 要求 |
| --- | --- | --- |
| `id` / `index` | 路由、排序、文档 | `index` 取当前最大号 +1，连续不跳号 |
| `name` / `en` | 标题、搜索（权重 8 / 6）、文档 | 中文名 3–6 字；`en` 是英文名不是 id |
| `tagline` | 列表一句话、搜索（4） | 一行 ≤ 22 字，说清"看见什么" |
| `description` | 详情页正文、搜索、文档 | 2–3 句：实现原理 + 适合用在哪 + 视觉结果 |
| `category` | 分类筛选、推荐加权 | 只能是已有 8 个 id 之一，不要随手新增 |
| `tags` | 搜索、推荐（每个 +3）、文档 | 3–4 个，名词短语 |
| `useCases` | 详情页、搜索、推荐（每个 +4） | 4 个具体场景，越具体越好（"定价方案"优于"页面"） |
| `keywords` | 搜索、推荐（每个 +1.8~4） | ≥ 10 个，覆盖用户会说的口语词、近义词、英文、行业词 |
| `params` | 参数面板、URL 状态、文档 | 每个参数必有 `key/label/type/default`；`range`/`number` 必须有 `min/max/step`；`select` 必须有 `options` |
| `tip` | 详情页「使用建议」 | 1–2 句：什么时候会翻车、参数取多少最稳、性能或降级注意点 |
| `code(p)` | 详情页代码面板 | 返回 `{ tsx, css }` 字符串，用 `p` 里的值插值，保证"面板里看到的参数 = 复制出去的代码" |

**关键词少一个，这个特效在搜索和智能选型里就少一次被想起的机会。** 新增动效时请顺带检查同类动效的 `keywords` 是否有该补的口语词。

### 5.4 生成文档

```bash
npm run docs          # 会打印 created/updated 的文件
npm run docs:check    # 确认没有落后
```

`npm run dev` / `npm run build` 前会自动跑一次生成，正常情况下你不需要手动执行。**不要手改 `docs/`**：改了会在下次生成时被覆盖，且 `docs:check` 会报 stale。

### 5.5 自检清单

- [ ] `npm run typecheck` 通过
- [ ] `npm run docs:check` 通过
- [ ] 应用里能打开该动效，参数全部可调、`重播` 有效
- [ ] 亮色 / 暗色两套主题下都正常（不是只在深色底能看）
- [ ] 系统开启「减少动态效果」时自动降级（不做动画也要有正确静态样子）
- [ ] 触屏 / 窄屏（420px）不溢出、不依赖 hover
- [ ] 卸载后无残留：`requestAnimationFrame` / `setTimeout` / 全局事件监听全部清理

## 6. 动效实现规约

- **只动 `transform` / `opacity` / `filter`**，不要动 `width`/`top`/`margin` 等触发布局的属性；需要位置变化优先用 CSS 变量驱动 `transform`。
- **参数即变量**：把可调参数写成 CSS 自定义属性（约定 `--sk-*` 给皮肤，`--<组件简称>-*` 给动效），由组件 `style` 注入，CSS 里只引用变量。
- **重播靠 `replay`**：监听 `replay` 变化重置状态机，不要靠改变 `key` 让 React 重挂载（会丢滚动位置、闪一下）。
- **降级优先**：`prefers-reduced-motion: reduce` 下直接给终态；hover 类效果在 `@media (hover: none)` 下跳过。
- **不引入动画库**（framer-motion / gsap / anime 等），也不新增运行时依赖；需要曲线就自己写 `cubic-bezier`（`src/lib/easing.ts` 有现成工具）。
- **组件自包含**：不读全局 store、不发请求、不依赖路由；只吃 `params` 和 `replay`。
- 视觉外壳统一走 `src/effects/<Name>.css` 里的局部 class（`.<name>__part` 形式），不要污染全局选择器。

## 7. 设计系统与视觉约定

- **皮肤 × 主题**：6 套皮肤（`SKIN_PRESETS`），每套含 dark/light 两组 token，由 `applySkin(skin, theme, accent)` 写入 `:root` 的 CSS 变量。写样式一律用 `var(--panel)` `var(--line)` `var(--text)` `var(--muted)` `var(--faint)` `var(--accent)` 这类语义变量，**禁止硬编码颜色**（动效画布例外：它固定深色底，用 `--sk-accent` 系列）。
- **字号极小是刻意的**：外壳正文 10–12px，标签 / 徽标 6.5–9px，行高偏松。新增 UI 请跟随现有密度，不要按常规 14/16px 写，会把版式撑坏。
- **圆角**：卡片 14–18px，控件 8–12px，胶囊 999px；**边框**统一 1px `var(--line)`。
- **动效画布永远是深色底**（`--sk-bg` 系），即使应用是亮色主题。
- 图标用 `src/components/Icons.tsx` 里的手写 SVG，尺寸 11–16，不引入图标库。

## 8. 应用外壳（改这些之前先读）

- **配置持久化**：`src/lib/configStore.ts` 的 `usePersistentState(key, initial)`。文件 `.motionkit/config.json` 是唯一真源（经 `server/local-store.mjs` 提供的 `/api/config` 读写），localStorage 只做首屏缓存；接口不可用时自动降级。**不要退回纯 localStorage，也不要绕开这个 hook 单独存盘**。新增配置项 = 新增一个 key，无需改服务端。
- **智能选型**：`src/lib/recommend.ts`。默认走本地关键词打分（无网络、无密钥）；开启 AI 后走 OpenAI 兼容接口，失败自动回落本地。改打分权重会影响所有动效的推荐排序。
- **自用动效层**：`src/components/SelfEffects.tsx` 里是外壳自己用的 `TypedTitle`（打印机）、`DecodeText`（文字解码）、`useArmed`（进入视口才播放）等。新增标题 / 说明文字时优先复用它们，而不是再写一套。
- **README 配图**：都在 `docs/images/`，是跑起来真机截的（1440×900 @2x，暗色为主，另有亮色 / 移动端 / 面板特写）。改动了首屏、动效库、详情页、选型或皮肤面板的视觉后，顺手重拍对应图片，不要用设计稿或拼贴图占位。

## 9. 不要做

- 不要手改 `docs/EFFECTS.md`、`docs/effects.json`。
- 不要在 `catalog.ts` 里写"占位"元数据（如 `keywords: []`、`useCases: ['页面']`）来让类型通过——搜索和推荐会直接失效。
- 不要为了让某个动效好看去改全局 token（会影响 41 个动效和整个外壳）。
- 不要把动效样式写进 `src/styles/app.css`。
- 不要新增 `dependencies`（React 之外）；需要工具函数就放 `src/lib/utils.ts`。
- 不要在组件里直接 `localStorage` / `fetch`。

---

有疑问先看 `docs/EFFECTS.md` 的对应小节；那里已经写清每个动效的实现提示和参数边界。
