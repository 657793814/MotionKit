# 动效清单（MotionKit）

> ⚠️ 本文件由 `npm run docs` 从 `src/lib/catalog.ts` 自动生成，**请勿手动编辑**。
> 新增或修改特效后执行 `npm run docs`；`npm run dev` / `npm run build` 也会自动执行。

当前收录 **41** 个动效，分 8 类。程序可读版本见 [`docs/effects.json`](./effects.json)。

## 怎么用

1. 在下面「速查表」里按场景找 id；不确定时跑 `npm run find -- 关键词`（如 `npm run find -- 弹窗 毛玻璃`）。
2. 组件在 `src/effects/<组件名>.tsx`，样式是同目录同名 `.css`。
3. 所有动效组件统一签名 `DemoProps`：

```ts
interface DemoProps {
  params: Params                          // 键见下方每个动效的参数表
  replay: number                          // 传入自增值即可重播动画
  onParamChange?: (key: string, value: string | number | boolean) => void
  onReplay?: () => void
}
```

4. 接入示例：

```tsx
import Spotlight from './effects/Spotlight'

<Spotlight params={{ size: 280, opacity: 0.28, color: "#3b82f6", edge: true }} replay={0} />
```

> 想直接抄走可粘贴的完整代码（含 CSS），在应用内打开对应动效页 → 「代码」面板；`catalog.ts` 里每个特效的 `code(params)` 就是这段生成器。

## 速查表

| # | id | 名称 | 分类 | 一句话 | 典型场景 |
| --- | --- | --- | --- | --- | --- |
| 01 | `spotlight` | 鼠标聚光灯 | 鼠标交互 | 光晕跟随鼠标，让功能卡片自己发光 | SaaS 功能卡片 / 定价方案 / AI 产品首页 |
| 02 | `reveal` | 滚动显现 | 滚动控制 | 内容随滚动逐段淡入，长页面不再平铺直叙 | 落地页长页 / 产品介绍 / 博客正文 |
| 03 | `borderBeam` | 边缘流光 | 数据与高光 | 一束光沿边框循环游走，把重点圈出来 | 推荐套餐卡 / AI 功能入口 / 限量活动 |
| 04 | `magnetic` | 磁吸按钮 | 鼠标交互 | 按钮被鼠标轻轻吸引，移开后弹回原位 | 主 CTA / 下载按钮 / 活动入口 |
| 05 | `scrollStory` | 滚动叙事 | 滚动控制 | 滚动代替点击，让页面像分镜一样推进 | 品牌官网 / 产品原理讲解 / 年度报告 |
| 06 | `tilt3d` | 3D 倾斜 | 鼠标交互 | 卡片跟着鼠标轻微转动，屏幕里有了纵深 | 产品展示 / 会员卡 / 游戏卡片 |
| 07 | `textDecode` | 文字解码 | 文字动效 | 乱码跳动后还原真身，科技感即刻拉满 | 科技产品标题 / AI 助手开场 / 黑客风界面 |
| 08 | `shimmer` | 流光扫过 | 数据与高光 | 一道高光扫过，告诉用户「正在处理」 | 骨架屏 / AI 生成中 / 按钮加载 |
| 09 | `parallax` | 视差滚动 | 滚动控制 | 前后景不同速滚动，一层屏幕装下山河 | 品牌故事 / 旅行专题 / 游戏官网 |
| 10 | `countUp` | 数字递增 | 数据与高光 | 数字滚到目标值，数据瞬间有了重量 | 数据看板 / 融资公告 / 成绩单 |
| 11 | `hoverLift` | 悬停上浮 | 鼠标交互 | 悬停时轻轻抬起，暗示这里可以点 | 文章列表 / 商品卡 / 导航卡 |
| 12 | `typewriter` | 打字机效果 | 文字动效 | 文字逐字敲出，像有人在屏幕那头说话 | 首页大标题 / AI 对话 / 终端演示 |
| 13 | `stagger` | 错峰动画 | 动画基础 | 元素错峰入场，页面自然有了层次 | 导航菜单 / 列表加载 / 图标宫格 |
| 14 | `marquee` | 跑马灯 | 数据与高光 | 内容水平循环，悬停即停不打断阅读 | 公告条 / 客户 Logo 墙 / 技能标签 |
| 15 | `spring` | 弹性动画 | 动画基础 | 到位后轻轻回弹，让动效拥有物理感 | 拖拽交互 / 开关切换 / 弹窗入场 |
| 16 | `easing` | 缓动效果 | 动画基础 | 决定动画是否自然的那条曲线 | 所有过渡动画 / 弹窗 / 页面切换 |
| 17 | `modalDialog` | 模态弹窗 | 弹窗提示 | 先处理再继续，把注意力收拢到一个确认点上 | 删除确认 / 登录注册 / 关键授权 |
| 18 | `toast` | 轻提示 | 弹窗提示 | 结果反馈自己出现又自己离开，不打断手上的事 | 保存成功 / 复制反馈 / 网络异常 |
| 19 | `drawer` | 抽屉面板 | 弹窗提示 | 从侧边滑出详情，原页面上下文还在眼前 | 订单详情 / 筛选面板 / 设置编辑 |
| 20 | `popover` | 气泡浮层 | 弹窗提示 | 贴着触发元素展开，比对话框轻、比文字提示重 | 头像菜单 / 筛选面板 / 图标说明 |
| 21 | `bottomSheet` | 底部面板 | 弹窗提示 | 从屏幕底部升起，把操作放到拇指够得到的地方 | 筛选条件 / 分享菜单 / 操作选择 |
| 22 | `notification` | 通知卡片 | 弹窗提示 | 比 Toast 更完整，把需要稍后处理的消息留给你 | 任务完成 / 协作提醒 / 系统公告 |
| 23 | `liquidGlass` | 液态玻璃 | 液态玻璃 | 会折射光、会呼吸的玻璃，让界面拥有真实的材质感 | 核心功能卡片 / 悬浮导航 / 播放器控件 |
| 24 | `paperPlane` | 纸飞机发送 | 组件交互 | 按钮轻压，纸飞机飞出，发送状态在原位交代清楚 | 分享行程 / 发布内容 / 发送消息 |
| 25 | `longPressMenu` | 长按快捷菜单 | 组件交互 | 按住才浮起，快捷操作从卡片周围长出来 | 内容卡片 / 图片操作 / 文件管理 |
| 26 | `accordion` | 手风琴问答 | 组件交互 | 答案推开下方内容，打开新的一项就收起旧的 | FAQ 问答 / 设置分组 / 详情折叠 |
| 27 | `multiSelectBar` | 多选操作栏 | 组件交互 | 选中即浮出操作栏，数量与选择状态始终同步 | 文件管理 / 任务批量处理 / 消息清理 |
| 28 | `numberStepper` | 数量步进器 | 组件交互 | 数字纵向滚动，按钮轻弹，数量不会跌破下限 | 购物车数量 / 票数选择 / 人数配置 |
| 29 | `cardFlip` | 卡片翻面 | 组件交互 | 沿竖轴翻到背面，中途不会看到镜像文字 | 会员凭证 / 支付卡 / 答案卡 |
| 30 | `searchFilter` | 搜索筛选标签 | 组件交互 | 选中底色滑到新标签，结果先淡出再依次落位 | 搜索结果 / 内容分类 / 商品筛选 |
| 31 | `stepProgress` | 步骤进度条 | 组件交互 | 圆点变对勾、连接线逐段填充，下一步自己亮起来 | 注册流程 / 支付流程 / 表单向导 |
| 32 | `glassTabBar` | 玻璃标签栏 | 液态玻璃 | 胶囊指示器按速度拉长压扁，落位时轻轻过冲弹回 | 底部导航 / 分段控制 / 选择器 |
| 33 | `glassToggle` | 果冻开关 | 液态玻璃 | 磨砂旋钮按下变玻璃珠，横纵两轴不同阻尼出果冻感 | 设置开关 / 功能启用 / 专注模式 |
| 34 | `glassSlider` | 放大镜滑块 | 液态玻璃 | 拖动时旋钮放大成透镜，轨道、数值、填充三者同步 | 音量亮度 / 价格区间 / 进度调节 |
| 35 | `glassCard` | 跟随折射卡片 | 液态玻璃 | 拖到哪儿，背后的光就在哪儿弯折 | 悬浮卡片 / 玻璃面板 / 播放器控件 |
| 36 | `borderFlow` | 多色渐变流光 | 数据与高光 | 四色首尾相接，光沿着整套色环滚动 | 新品发布卡 / 会员权益页 / 大促主推位 |
| 37 | `borderNeon` | 局部霓虹描边 | 数据与高光 | 只亮一小段弧，暗线拖出霓虹的余味 | 夜间模式产品 / 游戏与电竞 / 音乐 App |
| 38 | `borderFade` | 淡出透明柔光 | 数据与高光 | 光在边缘呼吸，两端自然化开 | 高端品牌官网 / 定价卡 / 邀请制产品 |
| 39 | `borderDust` | 粒子流光消散 | 数据与高光 | 光点沿边框奔跑，跑到尾部就散掉 | 数据传输状态 / AI 推理中 / 实时监控大屏 |
| 40 | `borderNebula` | 星云流光 | 数据与高光 | 几团模糊的色云在边框里缓慢漂移 | 品牌故事页 / 音乐与音频产品 / 冥想与健康 App |
| 41 | `borderScan` | 扫描高光边框 | 数据与高光 | 一道光带斜扫过边框，像设备自检 | 身份校验 / 支付确认 / 设备自检 |

## 鼠标交互（pointer）· 4 个

### 01 · 鼠标聚光灯 `spotlight`

Spotlight　·　鼠标交互　·　`src/effects/Spotlight.tsx`

> 光晕跟随鼠标，让功能卡片自己发光

在卡片内部监听鼠标坐标，把径向渐变光晕实时定位到指针位置，再叠加一圈边缘高光，让平面的卡片拥有「被照亮」的质感。适合功能区、定价卡、产品特性等需要强调高级感的模块。

- **标签**：鼠标跟随 · 光晕 · 卡片
- **适用场景**：SaaS 功能卡片 · 定价方案 · AI 产品首页 · 作品集卡片
- **实现提示**：只更新两个 CSS 变量，不触发布局重排。触屏设备建议降级为静态渐变，避免出现无法关闭的悬浮光。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `size` | 光晕半径 | range | `280` | 120 – 420px，步长 10 |
| `opacity` | 光晕强度 | range | `0.28` | 0.06 – 0.5，步长 0.02 |
| `color` | 光晕颜色 | color | `'#3b82f6'` | — |
| `edge` | 边缘高光 | switch | `true` | — |

```tsx
import Spotlight from './effects/Spotlight'

<Spotlight params={{ size: 280, opacity: 0.28, color: '#3b82f6', edge: true }} replay={0} />
```

### 04 · 磁吸按钮 `magnetic`

Magnetic Button　·　鼠标交互　·　`src/effects/Magnetic.tsx`

> 按钮被鼠标轻轻吸引，移开后弹回原位

计算指针相对按钮中心的偏移量，按比例施加位移与内部视差，离开时用带回弹的缓动复位。微小而克制的「不听话感」，会让主 CTA 变得难以忽视。

- **标签**：鼠标吸引 · 回弹 · CTA
- **适用场景**：主 CTA · 下载按钮 · 活动入口 · 404 页面
- **实现提示**：强度控制在 0.2–0.4 最自然；保留键盘焦点样式，触屏与 reduced-motion 场景直接跳过磁吸逻辑。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `strength` | 磁吸强度 | range | `0.35` | 0.05 – 0.8，步长 0.05 |
| `range` | 感应范围 | range | `300` | 180 – 420px，步长 10 |
| `duration` | 复位时长 | range | `450` | 200 – 900ms，步长 50 |

```tsx
import Magnetic from './effects/Magnetic'

<Magnetic params={{ strength: 0.35, range: 300, duration: 450 }} replay={0} />
```

### 06 · 3D 倾斜 `tilt3d`

3D Tilt　·　鼠标交互　·　`src/effects/Tilt3D.tsx`

> 卡片跟着鼠标轻微转动，屏幕里有了纵深

根据指针在卡片内的相对位置，映射为 rotateX / rotateY 角度，再叠加随位置移动的高光与轻微缩放，营造手持卡片般的空间感。角度越小越高级，越大越接近玩具。

- **标签**：3D · 透视 · 卡片
- **适用场景**：产品展示 · 会员卡 · 游戏卡片 · 作品集
- **实现提示**：最大角度建议 6–12°。离开时把角度缓动回 0，并给 transform 加 will-change，避免抖动。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `max` | 最大角度 | range | `10` | 2 – 22°，步长 1 |
| `perspective` | 透视距离 | range | `1000` | 600 – 1800px，步长 50 |
| `scale` | 悬停缩放 | range | `1.02` | 1 – 1.1，步长 0.01 |
| `glare` | 高光强度 | range | `0.45` | 0 – 1，步长 0.05 |

```tsx
import Tilt3D from './effects/Tilt3D'

<Tilt3D params={{ max: 10, perspective: 1000, scale: 1.02, glare: 0.45 }} replay={0} />
```

### 11 · 悬停上浮 `hoverLift`

Hover Lift　·　鼠标交互　·　`src/effects/HoverLift.tsx`

> 悬停时轻轻抬起，暗示这里可以点

通过 transform 位移、缩放和扩散阴影，让卡片在悬停时离开页面平面。成本极低，却是提升可点击感最有效的基础手法。

- **标签**：悬停 · 阴影 · 卡片
- **适用场景**：文章列表 · 商品卡 · 导航卡 · 仪表盘入口
- **实现提示**：抬起 4–10px 即可。阴影方向要与页面光源一致，避免出现「贴纸浮在半空」的违和感。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `lift` | 抬起高度 | range | `8` | 2 – 24px，步长 1 |
| `scale` | 悬停缩放 | range | `1.02` | 1 – 1.08，步长 0.01 |
| `shadow` | 阴影浓度 | range | `0.5` | 0 – 1，步长 0.05 |
| `duration` | 过渡时长 | range | `280` | 120 – 600ms，步长 20 |

```tsx
import HoverLift from './effects/HoverLift'

<HoverLift params={{ lift: 8, scale: 1.02, shadow: 0.5, duration: 280 }} replay={0} />
```

## 滚动控制（scroll）· 3 个

### 02 · 滚动显现 `reveal`

Scroll Reveal　·　滚动控制　·　`src/effects/Reveal.tsx`

> 内容随滚动逐段淡入，长页面不再平铺直叙

用 IntersectionObserver 监听元素进入视口，再以位移、模糊与透明度过渡完成入场。支持方向、距离、延迟和模糊强度调节，是长落地页最通用的节奏控制器。

- **标签**：滚动 · 淡入 · 长页面
- **适用场景**：落地页长页 · 产品介绍 · 博客正文 · 数据报告
- **实现提示**：动画交给 CSS，JavaScript 只负责在进入视口时加 class。尊重 prefers-reduced-motion，直接显示全部内容。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `direction` | 入场方向 | select | `'up'` | 向上淡入=up / 向下淡入=down / 从左滑入=left / 从右滑入=right / 缩放淡入=scale |
| `distance` | 位移距离 | range | `40` | 0 – 120px，步长 4 |
| `duration` | 动画时长 | range | `700` | 200 – 1400ms，步长 50 |
| `blur` | 模糊强度 | range | `6` | 0 – 16px，步长 1 |
| `stagger` | 组内间隔 | range | `80` | 0 – 240ms，步长 10 |

```tsx
import Reveal from './effects/Reveal'

<Reveal params={{ direction: 'up', distance: 40, duration: 700, blur: 6, stagger: 80 }} replay={0} />
```

### 05 · 滚动叙事 `scrollStory`

Scroll Storytelling　·　滚动控制　·　`src/effects/ScrollStory.tsx`

> 滚动代替点击，让页面像分镜一样推进

外层容器撑出足够的滚动距离，内层内容 sticky 固定，再根据滚动进度切换章节与进度条。用户不必点击，滚动本身就是叙事节奏，适合讲清楚一个复杂产品或流程。

- **标签**：sticky · 分镜 · 进度
- **适用场景**：品牌官网 · 产品原理讲解 · 年度报告 · 时间线
- **实现提示**：章节数控制在 3–5 个。移动端务必提供「跳过」入口，别让用户被长距离滚动困住。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `accent` | 强调色 | color | `'#3b82f6'` | — |
| `smooth` | 切换时长 | range | `260` | 80 – 600ms，步长 20 |
| `zoom` | 背景缩放 | switch | `true` | — |
| `progress` | 显示进度 | switch | `true` | — |

```tsx
import ScrollStory from './effects/ScrollStory'

<ScrollStory params={{ accent: '#3b82f6', smooth: 260, zoom: true, progress: true }} replay={0} />
```

### 09 · 视差滚动 `parallax`

Parallax　·　滚动控制　·　`src/effects/Parallax.tsx`

> 前后景不同速滚动，一层屏幕装下山河

监听滚动进度，把不同层级的元素乘以不同系数平移：近景快、远景慢，形成真实的纵深错觉。这里用纯 CSS 图层与滚动变量实现，无需任何动画库。

- **标签**：视差 · 景深 · 场景
- **适用场景**：品牌故事 · 旅行专题 · 游戏官网 · 年度总结
- **实现提示**：位移系数控制在 0.1–0.6。层数越多性能压力越大，移动端建议降低模糊与层数。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `strength` | 视差强度 | range | `0.55` | 0 – 1，步长 0.05 |
| `mouse` | 鼠标微动 | switch | `true` | — |
| `atmosphere` | 氛围光雾 | switch | `true` | — |

```tsx
import Parallax from './effects/Parallax'

<Parallax params={{ strength: 0.55, mouse: true, atmosphere: true }} replay={0} />
```

## 数据与高光（data）· 10 个

### 03 · 边缘流光 `borderBeam`

Border Beam　·　数据与高光　·　`src/effects/BorderBeam.tsx`

> 一束光沿边框循环游走，把重点圈出来

借助 @property 注册角度变量，让 conic-gradient 沿卡片边框持续旋转，再用 mask 裁出 1px 的描边。视觉上像一道流光在边缘巡逻，适合强调「推荐 / 在线 / 新增」等状态。

- **标签**：边框 · 流光 · 强调
- **适用场景**：推荐套餐卡 · AI 功能入口 · 限量活动 · 在线状态
- **实现提示**：同屏只保留一个到两个流光焦点。多个光束同时旋转会互相抢注意力，也增加合成层开销。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `speed` | 旋转周期 | range | `4` | 1 – 12s，步长 0.5 |
| `thickness` | 描边粗细 | range | `1.5` | 1 – 4px，步长 0.5 |
| `size` | 光束长度 | range | `100` | 30 – 200deg，步长 10 |
| `color1` | 主色 | color | `'#3b82f6'` | — |
| `color2` | 辅色 | color | `'#22d3ee'` | — |
| `glow` | 外发光 | switch | `true` | — |

```tsx
import BorderBeam from './effects/BorderBeam'

<BorderBeam params={{ speed: 4, thickness: 1.5, size: 100, color1: '#3b82f6', color2: '#22d3ee', glow: true }} replay={0} />
```

### 08 · 流光扫过 `shimmer`

Shimmer　·　数据与高光　·　`src/effects/Shimmer.tsx`

> 一道高光扫过，告诉用户「正在处理」

一条倾斜的半透明高光在元素上循环掠过，配合底色渐变，构成最轻量的加载与占位反馈。也可用于按钮、徽章等需要周期性提示的元素。

- **标签**：加载 · 骨架屏 · 高光
- **适用场景**：骨架屏 · AI 生成中 · 按钮加载 · 会员徽章
- **实现提示**：扫光速度 1.2–2s 最舒适。骨架屏必须保留真实布局尺寸，否则内容出现时会跳动。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `duration` | 扫光周期 | range | `1.8` | 0.6 – 3s，步长 0.1 |
| `angle` | 高光角度 | range | `105` | 0 – 160°，步长 5 |
| `width` | 高光宽度 | range | `32` | 10 – 80%，步长 5 |
| `color` | 高光颜色 | color | `'#ffffff'` | — |
| `loop` | 循环播放 | switch | `true` | — |

```tsx
import Shimmer from './effects/Shimmer'

<Shimmer params={{ duration: 1.8, angle: 105, width: 32, color: '#ffffff', loop: true }} replay={0} />
```

### 10 · 数字递增 `countUp`

Count Up　·　数据与高光　·　`src/effects/CountUp.tsx`

> 数字滚到目标值，数据瞬间有了重量

用 requestAnimationFrame 推进进度，再通过缓动函数插值到目标数字，支持小数位、前后缀与自定义时长。进入视口或点击重播时触发，比静态数字更有说服力。

- **标签**：数字 · 数据 · 计数
- **适用场景**：数据看板 · 融资公告 · 成绩单 · 倒计时
- **实现提示**：时长 1–1.8s 足够。金额与比例保留合理小数位，动画过程中也要避免数字宽度跳动，可使用等宽数字。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `target` | 目标数值 | number | `128.6` | 0 – 99999，步长 1 |
| `duration` | 动画时长 | range | `1600` | 600 – 3000ms，步长 100 |
| `decimals` | 小数位数 | range | `1` | 0 – 2，步长 1 |
| `prefix` | 前缀 | text | `'¥'` | — |
| `suffix` | 后缀 | text | `'万'` | — |
| `easing` | 缓动曲线 | select | `'expo'` | 丝滑收尾=expo / 回弹感=back / 标准减速=ease-out / 匀速=linear |

```tsx
import CountUp from './effects/CountUp'

<CountUp params={{ target: 128.6, duration: 1600, decimals: 1, prefix: '¥', suffix: '万', easing: 'expo' }} replay={0} />
```

### 14 · 跑马灯 `marquee`

Marquee　·　数据与高光　·　`src/effects/Marquee.tsx`

> 内容水平循环，悬停即停不打断阅读

复制一份内容并让轨道匀速平移，首尾无缝衔接；悬停时暂停，让用户可以停下来阅读。常用于公告、品牌墙和标签流。

- **标签**：循环 · 水平滚动 · 悬停暂停
- **适用场景**：公告条 · 客户 Logo 墙 · 技能标签 · 活动信息
- **实现提示**：复制的内容必须完全一致且无额外间距，首尾才能无缝衔接。副本用 aria-hidden 隐藏，键盘聚焦时也要暂停。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `speed` | 滚动周期 | range | `24` | 8 – 60s，步长 1 |
| `gap` | 元素间距 | range | `20` | 8 – 48px，步长 2 |
| `direction` | 滚动方向 | select | `'left'` | 向左=left / 向右=right |
| `pause` | 悬停暂停 | switch | `true` | — |
| `fade` | 两侧渐隐 | switch | `true` | — |

```tsx
import Marquee from './effects/Marquee'

<Marquee params={{ speed: 24, gap: 20, direction: 'left', pause: true, fade: true }} replay={0} />
```

### 36 · 多色渐变流光 `borderFlow`

Multi-color Flow　·　数据与高光　·　`src/effects/BorderFlow.tsx`

> 四色首尾相接，光沿着整套色环滚动

用 conic-gradient 把 3–4 个颜色首尾相接铺满一整圈，再让 @property 注册的角度变量持续旋转，卡片只保留 padding 让出的那一圈描边。颜色越多越接近「极光」，适合需要明确强调「新品 / 限量 / 主推」的卡片。

- **标签**：边框 · 多色 · 流光
- **适用场景**：新品发布卡 · 会员权益页 · 大促主推位 · 潮流与音乐产品
- **实现提示**：颜色不要超过 4 个，且首尾必须回到同一个颜色，否则衔接处会出现一道硬边。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `speed` | 旋转周期 | range | `6` | 3 – 14s，步长 0.5 |
| `thickness` | 描边粗细 | range | `1.5` | 1 – 5px，步长 0.5 |
| `radius` | 圆角 | range | `20` | 8 – 32px，步长 1 |
| `color1` | 色 1 | color | `'#3b82f6'` | — |
| `color2` | 色 2 | color | `'#22d3ee'` | — |
| `color3` | 色 3 | color | `'#34d399'` | — |
| `color4` | 色 4 | color | `'#f472b6'` | — |
| `glow` | 外发光 | range | `0.55` | 0 – 1，步长 0.05 |

```tsx
import BorderFlow from './effects/BorderFlow'

<BorderFlow params={{ speed: 6, thickness: 1.5, radius: 20, color1: '#3b82f6', color2: '#22d3ee', color3: '#34d399', color4: '#f472b6', glow: 0.55 }} replay={0} />
```

### 37 · 局部霓虹描边 `borderNeon`

Local Neon Stroke　·　数据与高光　·　`src/effects/BorderNeon.tsx`

> 只亮一小段弧，暗线拖出霓虹的余味

把 conic-gradient 的绝大部分设为透明，只在一段约 60° 的弧上放亮色和一点白色高光核心，再叠一层模糊的同款渐变做辉光。它区别于整圈流光的地方是「克制」：像霓虹灯管的一截，不抢内容，但足够抓眼。

- **标签**：边框 · 霓虹 · 局部
- **适用场景**：夜间模式产品 · 游戏与电竞 · 音乐 App · 赛博风落地页
- **实现提示**：亮段长度控制在 45°–75°：太长会退回普通流光，太短则像描边上沾了一块脏东西。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `speed` | 循环周期 | range | `5` | 2 – 12s，步长 0.5 |
| `thickness` | 描边粗细 | range | `1.5` | 1 – 4px，步长 0.5 |
| `radius` | 圆角 | range | `20` | 8 – 32px，步长 1 |
| `color1` | 霓虹色 | color | `'#22d3ee'` | — |
| `color2` | 拖尾色 | color | `'#a855f7'` | — |
| `glow` | 辉光强度 | range | `0.7` | 0 – 1，步长 0.05 |

```tsx
import BorderNeon from './effects/BorderNeon'

<BorderNeon params={{ speed: 5, thickness: 1.5, radius: 20, color1: '#22d3ee', color2: '#a855f7', glow: 0.7 }} replay={0} />
```

### 38 · 淡出透明柔光 `borderFade`

Soft Fade Glow　·　数据与高光　·　`src/effects/BorderFade.tsx`

> 光在边缘呼吸，两端自然化开

用一条两端透明的线性渐变铺在边框上，再让整层透明度缓慢呼吸；外圈叠一层大范围模糊光晕。画面里没有明确的「光点」，只有明暗的起伏，最容易和高级感、留白、克制这些词挂上钩。

- **标签**：边框 · 柔光 · 呼吸
- **适用场景**：高端品牌官网 · 定价卡 · 邀请制产品 · 极简作品集
- **实现提示**：呼吸周期不要低于 4s。快于 3s 会从「呼吸」变成「闪烁」，质感立刻掉一档。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `speed` | 呼吸周期 | range | `5` | 2 – 12s，步长 0.5 |
| `color1` | 主光色 | color | `'#93c5fd'` | — |
| `color2` | 高光色 | color | `'#e2e8f0'` | — |
| `thickness` | 描边粗细 | range | `1.5` | 1 – 4px，步长 0.5 |
| `radius` | 圆角 | range | `22` | 8 – 32px，步长 1 |
| `glow` | 光晕强度 | range | `0.6` | 0 – 1，步长 0.05 |

```tsx
import BorderFade from './effects/BorderFade'

<BorderFade params={{ speed: 5, color1: '#93c5fd', color2: '#e2e8f0', thickness: 1.5, radius: 22, glow: 0.6 }} replay={0} />
```

### 39 · 粒子流光消散 `borderDust`

Particle Dissolve　·　数据与高光　·　`src/effects/BorderDust.tsx`

> 光点沿边框奔跑，跑到尾部就散掉

用 repeating-conic-gradient 把圆周切成等距的小点，再用同角度、同速度旋转的锥形遮罩让某一段圆弧渐隐。光点像跑进雾里一样消失，天然带「数据正在流动」的暗示，适合传输、推理、实时处理这类状态。

- **标签**：边框 · 粒子 · 消散
- **适用场景**：数据传输状态 · AI 推理中 · 实时监控大屏 · 加载与处理中
- **实现提示**：点间距 8°–14° 最舒服；渐隐遮罩不要短于 90°，否则光点会「啪」地消失，反而显得掉帧。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `speed` | 奔跑周期 | range | `7` | 2 – 14s，步长 0.5 |
| `gap` | 粒子间距 | range | `10` | 6 – 20°，步长 1 |
| `thickness` | 描边粗细 | range | `2` | 1 – 5px，步长 0.5 |
| `radius` | 圆角 | range | `20` | 8 – 32px，步长 1 |
| `color1` | 主粒子色 | color | `'#7dd3fc'` | — |
| `color2` | 辅粒子色 | color | `'#a5f3fc'` | — |
| `glow` | 外发光 | range | `0.45` | 0 – 1，步长 0.05 |

```tsx
import BorderDust from './effects/BorderDust'

<BorderDust params={{ speed: 7, gap: 10, thickness: 2, radius: 20, color1: '#7dd3fc', color2: '#a5f3fc', glow: 0.45 }} replay={0} />
```

### 40 · 星云流光 `borderNebula`

Nebula Drift　·　数据与高光　·　`src/effects/BorderNebula.tsx`

> 几团模糊的色云在边框里缓慢漂移

三层不同尺寸的径向渐变色团，各自以不同的速度旋转、缩放，再用 blur 与 screen 混合叠在一起。因为没有清晰边界，边框读起来像「星云在玻璃后面流动」，适合需要氛围而不是锐利科技感的场景。

- **标签**：边框 · 星云 · 氛围
- **适用场景**：品牌故事页 · 音乐与音频产品 · 冥想与健康 App · 年度报告封面
- **实现提示**：色团之间要留出重叠，否则接缝会出现明显暗带；整体周期建议 ≥ 10s，慢才是「漂移」。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `speed` | 漂移周期 | range | `12` | 6 – 24s，步长 1 |
| `color1` | 色团 1 | color | `'#3b82f6'` | — |
| `color2` | 色团 2 | color | `'#22d3ee'` | — |
| `color3` | 色团 3 | color | `'#f472b6'` | — |
| `thickness` | 描边粗细 | range | `2` | 1 – 6px，步长 0.5 |
| `radius` | 圆角 | range | `22` | 8 – 32px，步长 1 |
| `glow` | 外发光 | range | `0.6` | 0 – 1，步长 0.05 |

```tsx
import BorderNebula from './effects/BorderNebula'

<BorderNebula params={{ speed: 12, color1: '#3b82f6', color2: '#22d3ee', color3: '#f472b6', thickness: 2, radius: 22, glow: 0.6 }} replay={0} />
```

### 41 · 扫描高光边框 `borderScan`

Scan Highlight　·　数据与高光　·　`src/effects/BorderScan.tsx`

> 一道光带斜扫过边框，像设备自检

把高光带做成一条锐利的线性渐变，用 background-position 让它从一角扫到另一角，并且只显示在边框区域；卡面再叠一条更暗的扫描线。它自带「正在识别 / 校验 / 加载」的语义，扫完停一拍，比一直扫更让人安心。

- **标签**：边框 · 扫描 · 高光
- **适用场景**：身份校验 · 支付确认 · 设备自检 · AI 扫描与识别
- **实现提示**：扫完要留一段静止时间（缓动的后 35%）。持续不停会制造焦虑，配合一次性的结果动效更自然。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `speed` | 扫描周期 | range | `4` | 1.5 – 8s，步长 0.5 |
| `thickness` | 描边粗细 | range | `1.5` | 1 – 4px，步长 0.5 |
| `radius` | 圆角 | range | `18` | 8 – 32px，步长 1 |
| `color1` | 光带主色 | color | `'#60a5fa'` | — |
| `color2` | 光带辅色 | color | `'#22d3ee'` | — |
| `glow` | 外发光 | range | `0.55` | 0 – 1，步长 0.05 |

```tsx
import BorderScan from './effects/BorderScan'

<BorderScan params={{ speed: 4, thickness: 1.5, radius: 18, color1: '#60a5fa', color2: '#22d3ee', glow: 0.55 }} replay={0} />
```

## 文字动效（text）· 2 个

### 07 · 文字解码 `textDecode`

Text Decode　·　文字动效　·　`src/effects/TextDecode.tsx`

> 乱码跳动后还原真身，科技感即刻拉满

把目标文本逐位替换为随机字符，再按从左到右的顺序逐步「解密」回真实内容。用 requestAnimationFrame 控制节奏，可以让一排标题拥有终端解码般的观感。

- **标签**：乱码 · 科技感 · 标题
- **适用场景**：科技产品标题 · AI 助手开场 · 黑客风界面 · 加载文案
- **实现提示**：整个过程控制在 1–2 秒内。适合短的标题或标签，长段落会让可读性急剧下降。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `text` | 解码文本 | text | `'构建下一代交互体验'` | — |
| `duration` | 解码时长 | range | `1500` | 600 – 2800ms，步长 100 |
| `charset` | 乱码字符集 | select | `'tech'` | 科技符号=tech / 字母数字=alnum / 二进制=binary / 片假名=kana |
| `trigger` | 触发方式 | select | `'auto'` | 自动播放=auto / 悬停触发=hover |

```tsx
import TextDecode from './effects/TextDecode'

<TextDecode params={{ text: '构建下一代交互体验', duration: 1500, charset: 'tech', trigger: 'auto' }} replay={0} />
```

### 12 · 打字机效果 `typewriter`

Typewriter　·　文字动效　·　`src/effects/Typewriter.tsx`

> 文字逐字敲出，像有人在屏幕那头说话

按节奏逐个追加字符，配合闪烁光标与可选的循环删除。适合短标题、对话界面和终端风格演示，能显著放慢用户的阅读速度。

- **标签**：逐字 · 光标 · 对话
- **适用场景**：首页大标题 · AI 对话 · 终端演示 · 个人签名
- **实现提示**：每字 40–80ms。中文长句建议关闭循环，反复删除会让用户产生焦躁感。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `text` | 键入文本 | text | `'你好，我是 MotionKit。
让界面动起来。'` | — |
| `speed` | 每字间隔 | range | `60` | 20 – 160ms，步长 5 |
| `loop` | 循环播放 | switch | `true` | — |
| `cursor` | 显示光标 | switch | `true` | — |

```tsx
import Typewriter from './effects/Typewriter'

<Typewriter params={{ text: '你好，我是 MotionKit。
让界面动起来。', speed: 60, loop: true, cursor: true }} replay={0} />
```

## 动画基础（base）· 3 个

### 13 · 错峰动画 `stagger`

Stagger　·　动画基础　·　`src/effects/Stagger.tsx`

> 元素错峰入场，页面自然有了层次

给同一组元素设置递增的延迟，让它们依次而不是同时出现。可以配合位移、透明度与模糊，是最容易复用的编排技巧。

- **标签**：顺序 · 入场 · 编排
- **适用场景**：导航菜单 · 列表加载 · 图标宫格 · 定价对比
- **实现提示**：间隔 40–120ms。元素超过 10 个时改用分批入场，避免最后几个出现得太晚。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `stagger` | 间隔时间 | range | `90` | 20 – 320ms，步长 10 |
| `duration` | 单项时长 | range | `500` | 200 – 900ms，步长 20 |
| `distance` | 位移距离 | range | `18` | 4 – 60px，步长 2 |
| `direction` | 入场方向 | select | `'up'` | 自下而上=up / 自左而右=left / 原地放大=scale |

```tsx
import Stagger from './effects/Stagger'

<Stagger params={{ stagger: 90, duration: 500, distance: 18, direction: 'up' }} replay={0} />
```

### 15 · 弹性动画 `spring`

Spring　·　动画基础　·　`src/effects/Spring.tsx`

> 到位后轻轻回弹，让动效拥有物理感

用刚度、阻尼、质量三个参数驱动的弹簧模型替代固定时长动画：它会自然加速、越过目标、再收敛回来。拖动小球或点击施力，感受参数变化带来的手感差异。

- **标签**：弹簧 · 回弹 · 物理
- **适用场景**：拖拽交互 · 开关切换 · 弹窗入场 · 游戏化界面
- **实现提示**：阻尼比 0.6–0.9 最接近真实手感。追求活泼可以降低阻尼，但别让界面长时间抖动。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `stiffness` | 刚度 | range | `170` | 40 – 400，步长 5 |
| `damping` | 阻尼 | range | `14` | 4 – 40，步长 1 |
| `mass` | 质量 | range | `1` | 0.5 – 4，步长 0.1 |
| `trail` | 拖尾残影 | switch | `true` | — |

```tsx
import Spring from './effects/Spring'

<Spring params={{ stiffness: 170, damping: 14, mass: 1, trail: true }} replay={0} />
```

### 16 · 缓动效果 `easing`

Easing　·　动画基础　·　`src/effects/Easing.tsx`

> 决定动画是否自然的那条曲线

用三次贝塞尔曲线描述速度变化：控制点越陡，起步越快；y 轴越过 1 会产生回弹。拖动控制点或选择预设，观察同一个位移在不同曲线下的性格差异。

- **标签**：贝塞尔 · 速度 · 过渡
- **适用场景**：所有过渡动画 · 弹窗 · 页面切换 · 手势反馈
- **实现提示**：入场用 ease-out，离场用 ease-in，双向过渡用 ease-in-out。高频操作别用超过 300ms 的动画。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `preset` | 缓动预设 | select | `'expo'` | ease-out-expo=expo / ease-out=ease-out / ease-in-out=ease-in-out / ease-out-back=back / smooth=smooth / snap=snap / linear=linear / 自定义=custom |
| `duration` | 动画时长 | range | `900` | 300 – 1600ms，步长 50 |
| `x1` | 控制点 1 · x | range | `0.16` | 0 – 1，步长 0.01 |
| `y1` | 控制点 1 · y | range | `1` | -0.5 – 1.5，步长 0.01 |
| `x2` | 控制点 2 · x | range | `0.3` | 0 – 1，步长 0.01 |
| `y2` | 控制点 2 · y | range | `1` | -0.5 – 1.5，步长 0.01 |

```tsx
import Easing from './effects/Easing'

<Easing params={{ preset: 'expo', duration: 900, x1: 0.16, y1: 1, x2: 0.3, y2: 1 }} replay={0} />
```

## 弹窗提示（overlay）· 6 个

### 17 · 模态弹窗 `modalDialog`

Modal Dialog　·　弹窗提示　·　`src/effects/ModalDialog.tsx`

> 先处理再继续，把注意力收拢到一个确认点上

模态对话框用遮罩切断背景交互，把用户的选择收敛到标题、说明与操作按钮上。入场时从略微缩小的状态放大并淡入，危险操作再配合红色主按钮，既明确又不喧宾夺主。适合删除确认、登录授权等需要用户明确表态的场景。

- **标签**：模态 · 确认 · 遮罩
- **适用场景**：删除确认 · 登录注册 · 关键授权 · 支付确认
- **实现提示**：一个流程里只出现一个模态框，主操作放在右侧。遮罩点击是否关闭要看后果：危险操作建议不关闭，避免误触。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `backdrop` | 模糊遮罩 | switch | `true` | — |
| `scale` | 起始缩放 | range | `0.92` | 0.8 – 1.1，步长 0.01 |
| `duration` | 入场时长 | range | `420` | 200 – 800ms，步长 20 |
| `spring` | 弹性回弹 | switch | `true` | — |

```tsx
import ModalDialog from './effects/ModalDialog'

<ModalDialog params={{ backdrop: true, scale: 0.92, duration: 420, spring: true }} replay={0} />
```

### 18 · 轻提示 `toast`

Toast　·　弹窗提示　·　`src/effects/Toast.tsx`

> 结果反馈自己出现又自己离开，不打断手上的事

Toast 是非阻断的结果反馈：从屏幕顶部或底部滑入，停留几秒后自动消失，不需要用户点掉。用不同颜色区分成功、错误与信息，用进度条暗示剩余时间，悬停时可以暂停计时，让用户来得及读完。

- **标签**：轻提示 · 反馈 · 自动消失
- **适用场景**：保存成功 · 复制反馈 · 网络异常 · 后台任务完成
- **实现提示**：一条 Toast 只说一件事，默认 2.5～3.5 秒。重要且必须看到的信息不要用 Toast，改用通知或模态框。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `position` | 出现位置 | select | `'top'` | 顶部=top / 底部=bottom |
| `duration` | 停留时长 | range | `2800` | 1500 – 5000ms，步长 100 |
| `variant` | 视觉样式 | select | `'glass'` | 毛玻璃=glass / 实色=solid |
| `pause` | 悬停暂停 | switch | `true` | — |

```tsx
import Toast from './effects/Toast'

<Toast params={{ position: 'top', duration: 2800, variant: 'glass', pause: true }} replay={0} />
```

### 19 · 抽屉面板 `drawer`

Drawer　·　弹窗提示　·　`src/effects/Drawer.tsx`

> 从侧边滑出详情，原页面上下文还在眼前

抽屉从屏幕左/右边缘滑入，用一块次级面板承载详情或筛选，而不像模态框那样完全遮住页面。它保留上下文，适合后台列表的查看详情、设置项编辑等「看完就关」的中等重量任务。

- **标签**：抽屉 · 侧滑 · 详情
- **适用场景**：订单详情 · 筛选面板 · 设置编辑 · 任务面板
- **实现提示**：宽度控制在 360–480px，内容超过一屏时让面板内部滚动。移动端改用底部面板更符合拇指操作。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `side` | 滑出方向 | select | `'right'` | 从右侧=right / 从左侧=left |
| `width` | 面板宽度 | range | `420` | 320 – 560px，步长 10 |
| `backdrop` | 背景遮罩 | switch | `true` | — |
| `duration` | 滑出时长 | range | `420` | 200 – 700ms，步长 20 |

```tsx
import Drawer from './effects/Drawer'

<Drawer params={{ side: 'right', width: 420, backdrop: true, duration: 420 }} replay={0} />
```

### 20 · 气泡浮层 `popover`

Popover　·　弹窗提示　·　`src/effects/Popover.tsx`

> 贴着触发元素展开，比对话框轻、比文字提示重

气泡浮层依附在按钮或头像附近出现，可承载补充说明与少量操作，不阻断全局操作。悬停触发、只显示文字的是 Tooltip；点击触发、带按钮和表单的才是 Popover。选对触发方式，浮层才不会挡住用户正在做的事。

- **标签**：气泡 · 浮层 · 锚点
- **适用场景**：头像菜单 · 筛选面板 · 图标说明 · 快捷操作
- **实现提示**：浮层要避开视口边缘，必要时自动翻转方向。Tooltip 只放一句说明，别在里面塞按钮。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `trigger` | 触发方式 | select | `'click'` | 点击展开=click / 悬停展开=hover |
| `placement` | 展开方向 | select | `'bottom'` | 向下=bottom / 向上=top |
| `arrow` | 显示箭头 | switch | `true` | — |
| `width` | 浮层宽度 | range | `240` | 200 – 320px，步长 10 |

```tsx
import Popover from './effects/Popover'

<Popover params={{ trigger: 'click', placement: 'bottom', arrow: true, width: 240 }} replay={0} />
```

### 21 · 底部面板 `bottomSheet`

Bottom Sheet　·　弹窗提示　·　`src/effects/BottomSheet.tsx`

> 从屏幕底部升起，把操作放到拇指够得到的地方

底部面板是移动端的抽屉：从下往上滑出，承载筛选、分享、操作菜单等任务。顶部把手暗示它可以下拉关闭，高度可以停在半屏；与桌面端的侧边抽屉相比，它更符合单手操作的拇指热区。

- **标签**：底部面板 · 移动端 · 手势
- **适用场景**：筛选条件 · 分享菜单 · 操作选择 · 移动端表单
- **实现提示**：一定要提供明确的关闭方式（把手下滑、× 按钮或遮罩点击）。内容很多时先停靠半屏，再允许用户继续上拉。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `height` | 面板高度 | range | `62` | 40 – 85%，步长 1 |
| `backdrop` | 背景遮罩 | switch | `true` | — |
| `drag` | 下滑关闭 | switch | `true` | — |
| `radius` | 顶部圆角 | range | `22` | 12 – 32px，步长 1 |

```tsx
import BottomSheet from './effects/BottomSheet'

<BottomSheet params={{ height: 62, backdrop: true, drag: true, radius: 22 }} replay={0} />
```

### 22 · 通知卡片 `notification`

Notification　·　弹窗提示　·　`src/effects/Notification.tsx`

> 比 Toast 更完整，把需要稍后处理的消息留给你

通知从角落滑入，可以带标题、正文和操作入口，比只反馈结果的 Toast 更重，又比阻断操作的模态框更轻。多条通知自动堆叠、到时移除，进度条会把剩余时间明确地展示出来，适合后台任务完成、协作消息等场景。

- **标签**：通知 · 消息 · 堆叠
- **适用场景**：任务完成 · 协作提醒 · 系统公告 · 异步结果
- **实现提示**：通知不要超过 3 条同屏，正文控制在两行内。需要用户立刻处理的消息请改用模态弹窗。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `position` | 出现位置 | select | `'topRight'` | 右上角=topRight / 顶部居中=topCenter |
| `duration` | 存活时间 | range | `3600` | 2000 – 6000ms，步长 200 |
| `progress` | 倒计时进度 | switch | `true` | — |
| `accent` | 强调色 | color | `'#3b82f6'` | — |

```tsx
import Notification from './effects/Notification'

<Notification params={{ position: 'topRight', duration: 3600, progress: true, accent: '#3b82f6' }} replay={0} />
```

## 液态玻璃（glass）· 5 个

### 23 · 液态玻璃 `liquidGlass`

Liquid Glass　·　液态玻璃　·　`src/effects/LiquidGlass.tsx`

> 会折射光、会呼吸的玻璃，让界面拥有真实的材质感

液态玻璃在毛玻璃的基础上叠加折射、焦散和镜面高光：底层色彩被扭出流动的光学形变，边缘出现细亮的轮廓光，指针位置的改变会让高光跟着移动。它是 Apple 系统界面里最具辨识度的材质语言，适合强调层级与焦点的核心卡片、导航栏和控件。

- **标签**：液态玻璃 · 折射 · 材质
- **适用场景**：核心功能卡片 · 悬浮导航 · 播放器控件 · 系统级弹层
- **实现提示**：折射强度控制在 10–20 之间，过大会让文字难以阅读。真实设备 Safari 支持最佳，Chromium 需保留纯模糊降级路径。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `blur` | 背景模糊 | range | `12` | 0 – 24px，步长 1 |
| `saturation` | 色彩饱和 | range | `170` | 100 – 220%，步长 5 |
| `refraction` | 液态折射 | range | `14` | 0 – 30，步长 1 |
| `tint` | 玻璃染色 | color | `'#93c5fd'` | — |
| `radius` | 圆角 | range | `26` | 12 – 40px，步长 1 |
| `glow` | 边缘辉光 | switch | `true` | — |

```tsx
import LiquidGlass from './effects/LiquidGlass'

<LiquidGlass params={{ blur: 12, saturation: 170, refraction: 14, tint: '#93c5fd', radius: 26, glow: true }} replay={0} />
```

### 32 · 玻璃标签栏 `glassTabBar`

Glass Tab Bar　·　液态玻璃　·　`src/effects/GlassTabBar.tsx`

> 胶囊指示器按速度拉长压扁，落位时轻轻过冲弹回

液态玻璃标签栏的灵魂是那枚跟随指尖的玻璃胶囊：滑动时沿运动方向拉长、垂直方向压扁，停住时按弹簧参数过冲再回弹；图标在胶囊下方被放大。它不是「一个块跳到另一格」，而是一滴有惯性的玻璃。

- **标签**：液态玻璃 · 标签栏 · 弹簧
- **适用场景**：底部导航 · 分段控制 · 选择器 · 工具栏
- **实现提示**：弹簧刚度 300、阻尼比 0.5 手感最接近系统原生；拉长系数别超过 1.8，否则像橡皮筋。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `stiffness` | 弹簧刚度 | range | `300` | 180 – 420，步长 10 |
| `damping` | 阻尼比 | range | `0.5` | 0.3 – 0.8，步长 0.05 |
| `stretch` | 拉长系数 | range | `1.4` | 1.1 – 1.8，步长 0.05 |
| `blur` | 玻璃模糊 | range | `10` | 4 – 20px，步长 1 |

```tsx
import GlassTabBar from './effects/GlassTabBar'

<GlassTabBar params={{ stiffness: 300, damping: 0.5, stretch: 1.4, blur: 10 }} replay={0} />
```

### 33 · 果冻开关 `glassToggle`

Jelly Toggle　·　液态玻璃　·　`src/effects/GlassToggle.tsx`

> 磨砂旋钮按下变玻璃珠，横纵两轴不同阻尼出果冻感

开关静止时是白色磨砂，按下瞬间变成透明的玻璃珠；切换时横向与纵向用不同阻尼回弹，出现果冻般的挤压感，轨道填充同步跟上。一个小小的开关，也能有材质与性格。

- **标签**：液态玻璃 · 开关 · 果冻
- **适用场景**：设置开关 · 功能启用 · 专注模式 · 偏好切换
- **实现提示**：果冻形变只在按下与切换瞬间出现，静止时必须回到规整的圆形，不然会显得失控。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `jelly` | 果冻形变 | switch | `true` | — |
| `aniso` | 两轴差异 | range | `0.45` | 0.2 – 0.8，步长 0.05 |
| `blur` | 磨砂强度 | range | `8` | 2 – 16px，步长 1 |
| `tint` | 旋钮染色 | color | `'#ffffff'` | — |

```tsx
import GlassToggle from './effects/GlassToggle'

<GlassToggle params={{ jelly: true, aniso: 0.45, blur: 8, tint: '#ffffff' }} replay={0} />
```

### 34 · 放大镜滑块 `glassSlider`

Magnifier Slider　·　液态玻璃　·　`src/effects/GlassSlider.tsx`

> 拖动时旋钮放大成透镜，轨道、数值、填充三者同步

滑块被按住时，圆钮放大成放大镜，透过它能看清下方的轨道与刻度；轨道填充、旋钮位置、数值显示用同一套节奏同步变化，松手恢复原大小。同步是「顺滑」和「松垮」的分界线。

- **标签**：液态玻璃 · 滑块 · 放大镜
- **适用场景**：音量亮度 · 价格区间 · 进度调节 · 参数面板
- **实现提示**：放大倍数 1.6–2.0 最自然；轨道填充、滑块位置、数字三者必须同一时长，不能各走各的。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `magnify` | 放大倍数 | range | `1.9` | 1.2 – 2.2，步长 0.1 |
| `blur` | 透镜模糊 | range | `8` | 2 – 16px，步长 1 |
| `snap` | 整数吸附 | switch | `false` | — |
| `accent` | 轨道强调色 | color | `'#3b82f6'` | — |

```tsx
import GlassSlider from './effects/GlassSlider'

<GlassSlider params={{ magnify: 1.9, blur: 8, snap: false, accent: '#3b82f6' }} replay={0} />
```

### 35 · 跟随折射卡片 `glassCard`

Refraction Card　·　液态玻璃　·　`src/effects/GlassCard.tsx`

> 拖到哪儿，背后的光就在哪儿弯折

真正的液态玻璃不是「把背景模糊」，而是把背景弯折：中心几乎不变，越靠边缘越像凸透镜；边缘分出红蓝彩边，颜色来自背景本身，外圈用 1–2px 细白边收住形状，内部只保留极轻的模糊。拖动卡片时，这团光学形变跟着走。

- **标签**：液态玻璃 · 真折射 · 色散
- **适用场景**：悬浮卡片 · 玻璃面板 · 播放器控件 · 系统弹层
- **实现提示**：同屏玻璃不要超过 5 块；像素参数按 min(devicePixelRatio, 2) 封顶，否则移动端会掉帧。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `refraction` | 折射强度 | range | `24` | 0 – 40，步长 1 |
| `chromatic` | 色散像素 | range | `8` | 0 – 16px，步长 1 |
| `blur` | 内部模糊 | range | `2` | 0 – 12px，步长 1 |
| `edge` | 细白边 | range | `2` | 1 – 3px，步长 0.5 |

```tsx
import GlassCard from './effects/GlassCard'

<GlassCard params={{ refraction: 24, chromatic: 8, blur: 2, edge: 2 }} replay={0} />
```

## 组件交互（component）· 8 个

### 24 · 纸飞机发送 `paperPlane`

Paper Plane Send　·　组件交互　·　`src/effects/PaperPlane.tsx`

> 按钮轻压，纸飞机飞出，发送状态在原位交代清楚

分享类按钮不要只切换文字：按下时先给一个轻微压缩，纸飞机带着弧线从按钮里飞出，按钮进入「发送中」，落地后落定成「已分享」。动作有起点、有去向、有结果，用户的眼睛始终跟得上。

- **标签**：发送反馈 · 纸飞机 · 状态切换
- **适用场景**：分享行程 · 发布内容 · 发送消息 · 提交表单
- **实现提示**：飞行时长控制在 600–800ms。发送结果必须回到原按钮上，不要只靠远处 Toast 交代。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `pressScale` | 按下缩放 | range | `0.94` | 0.88 – 0.98，步长 0.01 |
| `flight` | 飞行时长 | range | `720` | 400 – 1000ms，步长 20 |
| `arc` | 弧线高度 | range | `100` | 40 – 160px，步长 10 |
| `trail` | 飞行尾迹 | switch | `true` | — |

```tsx
import PaperPlane from './effects/PaperPlane'

<PaperPlane params={{ pressScale: 0.94, flight: 720, arc: 100, trail: true }} replay={0} />
```

### 25 · 长按快捷菜单 `longPressMenu`

Long Press Menu　·　组件交互　·　`src/effects/LongPressMenu.tsx`

> 按住才浮起，快捷操作从卡片周围长出来

长按不是「点得久一点的点击」，而是一段明确的意图确认：按住超过阈值，卡片浮起、阴影加深，快捷操作错峰展开；提前松手就取消。选完操作后菜单收起、卡片归位，空间关系始终清楚。

- **标签**：长按 · 快捷操作 · 浮起
- **适用场景**：内容卡片 · 图片操作 · 文件管理 · 移动端菜单
- **实现提示**：长按阈值建议 500ms 左右，太短会误触、太长让人以为没反应；操作项不要超过 4 个。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `threshold` | 长按判定 | range | `520` | 300 – 900ms，步长 20 |
| `lift` | 浮起高度 | range | `10` | 4 – 16px，步长 1 |
| `scale` | 浮起放大 | range | `1.06` | 1.02 – 1.12，步长 0.01 |
| `blur` | 背景压暗 | switch | `true` | — |

```tsx
import LongPressMenu from './effects/LongPressMenu'

<LongPressMenu params={{ threshold: 520, lift: 10, scale: 1.06, blur: true }} replay={0} />
```

### 26 · 手风琴问答 `accordion`

Accordion　·　组件交互　·　`src/effects/Accordion.tsx`

> 答案推开下方内容，打开新的一项就收起旧的

手风琴列表用高度过渡把「展开」做成一次有方向的推移：问题行保持不动，答案从 0 高度长出来并把下面的内容顶开。手风琴模式下始终只留一个答案，让读者的视线不用在多个开放区块之间来回跳。

- **标签**：手风琴 · 问答 · 展开
- **适用场景**：FAQ 问答 · 设置分组 · 详情折叠 · 帮助中心
- **实现提示**：只动 grid-template-rows 或 max-height，不要改具体像素高度；内容多的答案要允许内部滚动。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `duration` | 展开时长 | range | `380` | 200 – 600ms，步长 20 |
| `easing` | 缓动曲线 | select | `'smooth'` | 平滑=smooth / 弹性=spring |
| `single` | 只开一项 | switch | `true` | — |
| `icon` | 图标样式 | select | `'plus'` | 加号=plus / 箭头=chevron |

```tsx
import Accordion from './effects/Accordion'

<Accordion params={{ duration: 380, easing: 'smooth', single: true, icon: 'plus' }} replay={0} />
```

### 27 · 多选操作栏 `multiSelectBar`

Multi Select Bar　·　组件交互　·　`src/effects/MultiSelectBar.tsx`

> 选中即浮出操作栏，数量与选择状态始终同步

多选态不需要额外的入口说明：第一项被选中的瞬间，底部操作栏滑入并显示已选数量；每次选择变化都同步刷新数字；全部取消后操作栏原路收回。勾选动画与计数联动，让用户确认「我选了什么」。

- **标签**：多选 · 操作栏 · 勾选
- **适用场景**：文件管理 · 任务批量处理 · 消息清理 · 相册选图
- **实现提示**：操作栏不要超过 3 个主操作；数量变化要有明确反馈，避免用户怀疑是否点中。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `accent` | 强调色 | color | `'#3b82f6'` | — |
| `barHeight` | 操作栏高度 | range | `60` | 48 – 80px，步长 2 |
| `anim` | 出现方式 | select | `'slide'` | 平滑滑入=slide / 弹性滑入=spring |
| `selectAll` | 显示全选 | switch | `true` | — |

```tsx
import MultiSelectBar from './effects/MultiSelectBar'

<MultiSelectBar params={{ accent: '#3b82f6', barHeight: 60, anim: 'slide', selectAll: true }} replay={0} />
```

### 28 · 数量步进器 `numberStepper`

Number Stepper　·　组件交互　·　`src/effects/NumberStepper.tsx`

> 数字纵向滚动，按钮轻弹，数量不会跌破下限

步进器的重点是「数字真的在滚动」：旧数字向上滑出、新数字从下方进入，按钮轻微回弹确认点击，金额与数量同步更新。减到下限后按钮禁用，不让用户点到没有结果的地方。

- **标签**：步进器 · 数字滚动 · 回弹
- **适用场景**：购物车数量 · 票数选择 · 人数配置 · 规格数量
- **实现提示**：数字滚动容器要有固定高度并 overflow hidden，不然会出现上下数字同时露出的穿帮。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `bounce` | 按钮回弹 | switch | `true` | — |
| `digitHeight` | 数字行高 | range | `34` | 24 – 48px，步长 2 |
| `duration` | 滚动时长 | range | `360` | 200 – 600ms，步长 20 |
| `min` | 最小值 | range | `0` | 0 – 5，步长 1 |

```tsx
import NumberStepper from './effects/NumberStepper'

<NumberStepper params={{ bounce: true, digitHeight: 34, duration: 360, min: 0 }} replay={0} />
```

### 29 · 卡片翻面 `cardFlip`

Card Flip　·　组件交互　·　`src/effects/CardFlip.tsx`

> 沿竖轴翻到背面，中途不会看到镜像文字

翻面卡用 3D 旋转把正反两面讲成一个连续动作：正面转过 90° 后交给背面，两面都设置 backface-visibility: hidden，背面文字始终正向。它适合会员凭证、支付方式、答案卡这类「一张卡两层信息」的场景。

- **标签**：翻面 · 3D · 凭证
- **适用场景**：会员凭证 · 支付卡 · 答案卡 · 双语信息卡
- **实现提示**：一定要给两面加 backface-visibility: hidden，并在 90° 前后切换可见面，否则会看到反字穿帮。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `duration` | 翻转时长 | range | `700` | 400 – 1000ms，步长 20 |
| `perspective` | 透视距离 | range | `1000` | 600 – 1400px，步长 50 |
| `axis` | 翻转轴 | select | `'y'` | 竖轴 Y=y / 横轴 X=x |
| `shadow` | 翻转投影 | switch | `true` | — |

```tsx
import CardFlip from './effects/CardFlip'

<CardFlip params={{ duration: 700, perspective: 1000, axis: 'y', shadow: true }} replay={0} />
```

### 30 · 搜索筛选标签 `searchFilter`

Search Filter Tabs　·　组件交互　·　`src/effects/SearchFilter.tsx`

> 选中底色滑到新标签，结果先淡出再依次落位

筛选切换不是整页刷新：胶囊底色从旧标签滑到新标签，结果列表先整体淡出，再按短间隔依次进入。用户的视线能跟住「我点了哪里」和「内容从哪里换掉」，列表就不会显得突然跳变。

- **标签**：筛选标签 · 胶囊指示 · 列表切换
- **适用场景**：搜索结果 · 内容分类 · 商品筛选 · 作品集过滤
- **实现提示**：切列表时先淡出再淡入，间隔别超过 100ms；否则用户会觉得内容来得拖沓。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `indicator` | 指示动画 | select | `'spring'` | 平滑滑动=slide / 弹性滑动=spring |
| `fade` | 淡出时长 | range | `260` | 150 – 500ms，步长 10 |
| `stagger` | 逐项间隔 | range | `80` | 40 – 140ms，步长 10 |
| `accent` | 强调色 | color | `'#3b82f6'` | — |

```tsx
import SearchFilter from './effects/SearchFilter'

<SearchFilter params={{ indicator: 'spring', fade: 260, stagger: 80, accent: '#3b82f6' }} replay={0} />
```

### 31 · 步骤进度条 `stepProgress`

Step Progress　·　组件交互　·　`src/effects/StepProgress.tsx`

> 圆点变对勾、连接线逐段填充，下一步自己亮起来

步骤条把「走到哪一步」画成一条会生长的路径：完成当前步骤时圆点缩一下并换成对勾，连接线按固定时长从左到右填满，下一步圆点放大高亮、说明文字同步更新。每个视觉变化都指向同一个事实。

- **标签**：步骤条 · 进度 · 对勾
- **适用场景**：注册流程 · 支付流程 · 表单向导 · 安装引导
- **实现提示**：不要让连接线提前填满：必须等当前步骤确认完成后才开始，否则进度会「说谎」。
- **被引用**：`src/effects/index.ts`

| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |
| --- | --- | --- | --- | --- |
| `fill` | 连线填充 | range | `520` | 300 – 800ms，步长 20 |
| `check` | 笔画对勾 | switch | `true` | — |
| `style` | 材质样式 | select | `'solid'` | 实色=solid / 玻璃=glass |
| `accent` | 强调色 | color | `'#3b82f6'` | — |

```tsx
import StepProgress from './effects/StepProgress'

<StepProgress params={{ fill: 520, check: true, style: 'solid', accent: '#3b82f6' }} replay={0} />
```

---

共 41 个动效。新增或修改动效请遵循 [AGENTS.md §5《新增 / 修改动效的规约》](../AGENTS.md)，改完跑 `npm run docs` 重新生成本文件（`docs:check` 会校验是否落后）。
