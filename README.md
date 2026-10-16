# 龙源读书会 · 独立 Demo

打开 `index.html` 即可运行；本地预览地址为 http://127.0.0.1:8768/ 。

首页文件位于当前目录，期刊、图书、领读详情、领读人等复用页面的独立副本位于 `pages/`，图片、脚本、样式均复制在新 Demo 内，未使用软链接，不再依赖原 Demo 目录或 8767 服务。

原 Demo：`../longyuan-flow-demo/index.html`。两边各自修改，互不自动同步。

新 Demo 使用统一顶部导航、二级页面返回按钮和智能助手浮窗；普通杂志详情不展示单期或全年购买。数据与交互为本地演示，未接入真实付款、报名或大模型服务。

公网预览：https://kasparelr.github.io/longyuan-reading-club-demo/

独立仓库：https://github.com/KaspareLr/longyuan-reading-club-demo

GitHub Pages：main 分支根目录，2026-10-15 发布提交 `edc035a`。本地发布副本保存在 `../deliverables/github-pages-20261015/longyuan-reading-club-demo/`，已关联独立仓库；源目录不依赖该发布副本。

## 新增主题与阅读页面

- `portal.html#/reading`：共读主题与计划筛选。
- `portal.html#/people`：书友、领读人与阅读分享。
- `portal.html#/events`：活动列表与活动详情，模拟报名。
- `portal.html#/membership`：会员方案、体验开通和兑换码。价格取自十月少年文学读书会 2026-10-15 公开接口快照（0.01 / 49 / 168 元，月 / 季 / 年）。
- `portal.html#/me`：演示登录后的个人资料、会员信息、收藏与活动报名。
- `portal.html#/book/rb-ob-01`：独立图书详情，包含目录、简介、推荐语、领读和学习工具。
- `portal.html#/article/0?context=book&resource=rb-ob-01`：保留图书目录的章节阅读。
- `portal.html#/article/0?context=magazine&resource=第一财经`：保留期刊目录的文章阅读。
- `portal.html#/article/shared-0`：无目录的独立文章阅读。

账号、会员、报名、收藏、笔记均使用本地模拟数据；不登录真实服务、不收款。阅读正文为排版演示，保留原站链接；未接入完整正文、真实 AI 和音频。兑换演示码：`READ2026`。

所有修改仅在新 Demo 内，原 Demo 不变。

3D 封面的书脊与封底统一取自封面左侧边缘。取色表为 `pages/scripts/cover-edge-palette.js`，添加或替换本地封面后可运行 `python3 pages/scripts/build/generate-cover-edge-palette.py` 重新生成；无需浏览器 Canvas 权限，支持本地文件预览。

### 领读人首次配置演示

- 打开 `index.html?setup=1`：所有首页模块使用用户提供的虚拟封面与配套演示文案，底部提供前台配置入口。
- 按助手提示选择领读类型及各资源模块，首页同步预览；跳过的模块滚动定位后淡出收起。
- 汇总时可修改选择，确认后展示模拟生成进度，跳转至 `index.html?club=mine`。
- 配置结果只存在当前浏览器；完成页的「重新配置演示」可以重走流程。普通首页页脚也有演示入口。
- 演示登录新增「领读人」身份：未配置时进入引导，已配置时进入个人读书会首页。
- 生成内容均为虚拟演示，没有接入 AI、真实资源或后台。


首页模板图片保存在 `assets/home-template/`，原始图片仅转换为 WebP，不改变构图。`home-template.js` 集中维护虚拟图书、期刊、播客、文章、每日一读、活动与领读人的数据；复用普通首页的 DOM 模板、CSS、首屏滚动和卡片入场逻辑。虚拟资源点击只进入对应的演示预览，不跳转真实资源。
