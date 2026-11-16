# Long-field validation branch

This is an independent local visual stress fixture copied from ../longyuan-reading-club-home-v3 on2026-11-16. See OVERFLOW-LAB.md. Do not change the source demo. overflow-stress.js substitutes rendered text only; never copy its fixture data back to production content. Images are shared hard links: do not overwrite image bytes in place.

# New homepage exploration branch

Before editing this branch's homepage, read `docs/HOME-V3-DESIGN-CONSTRAINTS.md`. It fixes the user-confirmed Figma 489:2631 structure, geometry, field limits, overflow behavior, and inherited interactions. The homepage has ONE recommendation slot with three possible types; daily magazine cards are 14:19 and daily cards stay 480px tall on desktop and 360px on mobile; the selected article section supports four resource types. Keep the original project in ../longyuan-reading-club-demo untouched.

Daily reading must contain 6 distinct resources; use the Figma 50px backdrop blur and no inherited extra overlay. V3 co-reading cover stays fixed, while the progress animation remains. Selected book footers are real authors; selected magazine covers use -z filenames. No play overlay on mixed-list podcast covers.

All pages must obey docs/COVER-RATIO-SPEC.md: book covers 2:3, magazine covers 14:19, standalone article covers 2:3. Apply the shared cover-ratios.css/js policy to new templates; do not change magazine article illustrations, podcast squares, avatars, icons, or event posters.

## Current text and feature rules (2026-11-12)

Read `docs/TEXT-OVERFLOW-POLICY.md` before adding or modifying text. Preserve full text. List summaries/descriptions/excerpts use ordinary CSS line-clamp ellipsis with no fade, disclosure or click interception. Other independently readable fields use a lower-half last-line fade only on actual overflow. No visible expand/collapse text buttons. Standalone prose expands inline; compact card fields open the shared single-field dialog. Main titles, article body and critical facts remain full. Use existing local iconfont, cover ratios, mobile navigation/back hierarchy and spacing. New search, sharing and personal-space behavior is documented in `docs/FEATURES-20261112.md`. Keep original demo and published copies untouched unless publishing is explicitly requested.

Personal-space baseline: read `docs/ACCOUNT-SOURCE-PARITY.md`. Actual online functions/fields take precedence over earlier demo additions. Profile has avatar, nickname (12), email (150), interests (60, max 8 items, 16 each), no city/bio fields. Do not reintroduce separate reading-history/notes tabs. Web avatar opens a categorized quick menu; all desktop account tabs use Figma 601:3112: centered 120px avatar and nickname (no description), three stats, 280px sidebar + 40px gap + 760px panel. Form avatar is 64px; desktop styles live in personal-space-desktop.css. Mobile retains its separate layout with the same functionality.

Search baseline: read `docs/SEARCH-SOURCE-PARITY.md`. Search follows Figma 592:2520: standalone page, one resource type at a time. 全部、文章、刊物 show four facets (刊物、年份、期号、栏目); 图书、音频 show none. Never reintroduce 整期杂志/刊内文章 scope toggles. `personalPreview=filled` is an isolated in-memory visual fixture; never seed real account storage for preview data.

Search detail rule: no separate active-filter tag/chip row. Show selected values only inside facet selects; place one Refresh-icon 清空筛选 button beside the four selects per Figma. Selected/active states must not introduce an outer outline.

Search current geometry: max-width 960px, desktop top100px, search form top40px/bottom80px. Four filters use the shared custom listbox per597:2574. Clear-query icon is absent on empty input; glyph16px in24px slot with44px hit area.

Search reset (latest user decision): do not reserve space when inactive. Collapse its slot to zero; keep four facet widths fixed to their reset-visible widths using the result-heading container size, and right-align the group across the last three columns of a four-column result heading. Expand reset to108px only with selected facets, using fade/slide and width transition. Keep shadows unclipped; hidden reset is inert and outside the tab order.

Desktop account per-tab layouts now follow601:3112,608:4601/4863/5049,610:5384/5700/5885. Use personal-space-desktop.js/css, not old generic cards. Account quick menu610:6124 has no reading stats, uses local Arrow_Forward-3 (e75e) at24px in24px slots; Web club sharing lives there rather than in the navigation. Web nickname aligns left; search has20px right gap. Preserve mobile's independent hub/subpages.

Mobile search615:6930: no duplicate resource tabs above the search input (user corrected the design). Keep only black-active type tabs below the separate input surface, with a48px circular Fliter button opening a bottom dialog. Four facets are single-column, one per row; keep dependencies, conditional reset, focus return and route/breakpoint close. Mobile nav hides club share, retains personal-space share item; nav search is44px square and never shrinks. No mobile personal welcome/bio line.

Mobile account secondary views share the new Web fields/content but use personal-space-mobile.css/js for phone layout/interactions. Keep the primary hub unchanged. Membership/order facts display directly in cards; saved row controls are44px, arrows Arrow_Forward-3 at24px. Profile inputs48px/16px, email keyboard; phone interests use a bottom multi-select/custom-tag dialog (8 items,16 chars each,60 total), committing to the form only until Save. Desktop interests remain editable text.

2026-11-16 最新列表标题规则：列表条目标题与摘要均用原行数CSS省略号，不使用渐变、文字预览弹窗或展开交互；整条点击仍按原逻辑进入详情。范围含首页精选列表、搜索、收藏、阅读记录、活动、共读、书刊列表与目录条目。独立详情页主标题、首页独立推荐标题等不套用本规则。

2026-11-16 卡片布局优先：超长字段不能撑宽卡片、改变网格分栏或挤压封面/操作区域。文字容器及中间flex/grid层必须允许min-width:0，长无空格串可断行；固定高度内受限字段允许收缩，沿用各字段原行数及E/M规则。不得通过缩小字号、改变封面比例、整卡overflow:hidden裁掉阴影/控件来掩盖问题。列表标题与摘要仍用普通省略号，独立字段仍保留已约定的完整查看方式。

2026-11-16 共读卡片专用约束：feature-copy h2、reading-home-identity h2、oc-reading-list-heading h3均为卡片资源标题，最多两行普通省略，优先于“共读主推名称完整显示”的历史规则；领读语最多三行，列表领读语用E普通省略，独立主推卡领读语沿用M单字段预览。状态/期次/人数等短枚举不注入长文测试，不能占据大段正文空间。

2026-11-16 测试数据分层：超长验证仅注入内容文案（资源标题、作者、身份、摘要、介绍、具体推荐理由等）。系统文案保持原样，包括“为什么选它？”、“导读”、“领读语”等字段标签、导航、栏目标题、操作按钮、表单标签、状态枚举、功能说明与会员固定权益。不能按main内h1/h2/p标签批量灌长文；字段标签与其内容须分别判断。

## 2026-11-16 当前统一规则：按容器决定展开方式

内容字段先逐项确定符合实际用途的行数，再判断所在容器：无卡片包裹的独立字段，超出后末行下半渐变，点击原位展开推动下文；实际卡片内的内容字段，按卡片布局限制行数，超出后同样渐变，点击共用单字段弹窗，绝不撑高卡片。不能把普通内容section当作卡片，也不能让显式inline/modal旧标记覆盖容器判断。

例外优先：系统标签、按钮、状态等保持正常；列表标题和摘要/详情预览使用E普通省略并保留正常跳转；文章正文不截断，独立详情主标题与关键事实仍完整展示。资源简介/领读人介绍/阅读观点默认6行，评论和笔记4行，编辑推荐4行，独立读书会简介3行，卡片领读语3行，作者/身份2行；各字段已登记的专用行数优先，不对全部字段统一套两行。首页推荐沿用各字段既有行数。只有真实溢出才出现遮罩和展开交互，数据与DOM全文保留。

2026-11-16 修正：任务卡片的任务范围说明与共读问题均最多3行，真实超出时渐变并弹窗展示；不再沿用旧的任务全文撑开卡片规则。日期、倒计时与操作标签不受截断影响。移动端共读列表封面align-self:start，与右侧状态标签顶部对齐，不能随右侧文字高度居中。

2026-11-16 领读人身份卡：“你好！”为固定系统文案；姓名和头衔分别最多2行，溢出渐变并打开单字段弹窗。姓名文本与“领读人”固定标签分开，不截断整个复合标题。超长验证版不显示固定悬浮场景入口，场景列表保留独立页面。

2026-11-16 固定状态标签：已完结、进行中、即将开始、已结束、报名中等为系统枚举，不注册到通用超长字段处理，不添加渐变、限行、省略或展开交互，也不注入验证长文。

2026-11-16 用户昵称在导航、快捷菜单、个人中心头部均单行省略，不渐变、不预览、不展开。顶部返回按钮使用明确父级路由，PC和移动端均不依赖history.back；个人中心二级页返回me?tab=overview（同步URL），文章返回所属资源、活动返回活动列表、图书返回书库。单领读人主页返回共读页，避免经领读人列表自动重定向回自身。

2026-11-16 最终整理：固定行数以text-overflow-limits.css的--to-limit为视觉配置源；text-overflow.js读取计算样式，不再维护特殊行数数组。最新完整规则见docs/TEXT-OVERFLOW-POLICY.md，本轮范围见docs/FEATURE-CHANGE-LIST-20261116.md，检查入口feature-review.html。勿把旧FEATURES-20261112.md历史记录当作现行设计。

2026-11-16 超长样例改为语义真实：正式项目不灌入样例，验证版使用overflow-fixture-data.js集中登记key/kind/originals/text，overflow-stress.js只替换渲染文本。不要为覆盖所有溢出强行拉长人名/刊名或编造人物职务；不要循环追加万能长句。同字段跨页样例编号一致不代表正式数据已贯通。字段缺位核对见docs/DETAIL-FIELD-AUDIT-20261116.md，未授权自动补齐详情模块。
