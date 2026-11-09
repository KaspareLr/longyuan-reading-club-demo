> 交接提示（2026-11-09）：本文保留历史记录，其中部分导航、目录、字号及发布规则已更新。请先阅读 [V3分支当前交接说明](V3-BRANCH-HANDOFF.md)，冲突处以当前交接说明和用户最新要求为准。

# 本地功能图标规范

所有功能图标使用 `pages/assets/font_icon/iconfont.css` 的本地 `font_family`，以 `i.iconfont.icon-名称` 渲染；不依赖 CDN，不用 emoji、位图或独立 SVG 充当操作图标。控件必须保留可访问名称、原事件与选中状态。

新增图标必须先确认字体 CSS 中存在相应类；不存在时选择同义本地字形，不能输出空字形。封面、头像、品牌 Logo、AI 助手形象、装饰月桂/引号、进度环及知识图谱绘图仍是内容图片或图形，不作为功能图标替换。

## 本次统一范围
首页、图书/期刊列表及详情、领读人、阅读器、创建向导、底部导航、弹窗、播放器。清理阅读器隐藏 iconfont 的旧规则。

移动阅读器学习栏：顶部64px高，四个等宽入口使用统一字体图标和原文/增强/自测/地图短标签；右侧笔记和图谱独立44px高按钮，笔记带计数。全屏目录使用本地关闭图标，保留原生 dialog 的 Escape 和焦点返回。

## 保留的装饰图片审计
- `pages/scripts/books-home.js`: `<img src="assets/figma-books/recommend-left.svg" width="9.734" height="16" alt="">`
- `pages/scripts/books-home.js`: `<img src="assets/figma-books/recommend-right.svg" width="9.734" height="16" alt="">`
- `pages/scripts/magazines-home.js`: `<img src="assets/figma-magazines/laurel-left.svg" alt="">`
- `pages/scripts/magazines-home.js`: `<img src="assets/figma-magazines/laurel-right.svg" alt="">`
- `pages/scripts/claimed-guided-reading.js`: `<img class="oc-guided-quote" src="assets/figma-guided-detail/quote.svg" alt="" width="42" height="32">`

## 用户确认的例外（优先）
读书智能体入口保留原图片：原文、增强、Anki、音频、自测、地图和图谱，包括详情能力入口、阅读工具栏与目录章节工具。只有笔记使用 iconfont。移动端工具栏仍保持顶部单行与独立笔记/图谱按钮。

返回按钮统一使用本地 `icon-Arrow_Forward-2`，以一次180度旋转显示朝左；不得使用 Arrow_Back 或叠加父级翻转。


2026-11-06 更新：图书、杂志统一使用 mark / mark_Fill（选中 #131921）；文章使用 Star / StarFill（选中 #FA8C16）。不得把杂志保存按钮改为 Star。
