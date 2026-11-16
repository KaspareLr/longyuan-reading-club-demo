# 2026-11-16 GitHub发布记录

- GitHub项目：https://github.com/KaspareLr/longyuan-reading-club-demo
- 本轮目录：https://github.com/KaspareLr/longyuan-reading-club-demo/tree/main/home-v3
- 代码目录：home-v3/_app（原静态源码及文档；外层为公共资源加载入口）
- 本轮快照分支：home-v3-20261116
- 功能代码提交：f89f51fe85e0f69a895106216e4e5bcddacbaaf1
- 公共图片提交：79aa882f36112c4dc14f1847771cf9f7f34149e2
- 正常内容入口：https://kasparelr.github.io/longyuan-reading-club-demo/home-v3/feature-review.html
- 超长样例入口：https://kasparelr.github.io/longyuan-reading-club-demo/home-v3/overflow-lab/overflow-check.html
- 字段核对：https://kasparelr.github.io/longyuan-reading-club-demo/home-v3/field-audit.html

## 范围

同步我的、搜索、分享、超长文案控制、合理测试文案、字段审计、两端推荐标题最多3行及桌面侧栏重复昵称修复；运行所需的现有页面继续保留。只替换仓库home-v3子树，不改旧Demo及其他项目。

## 资源与构建

发布构建目录为deliverables/home-v3-publication-20261116。本次通过GitHub API使用已有Git凭据提交，本机Git网络代理不可用，连接器Git写入接口返回403，故没有把旧发布工作副本当成已同步。

图片仅放公共图片站：https://kasparelr.github.io/agentui-shared-images/ ，本次补充224个所需不可变对象，保留旧哈希。项目内没有复制图片字节。service worker资源适配保持本地assets路径及动态路由语义，实际图片由公共站提供；首次进入会准备资源并自动重载，需要HTTPS和支持service worker的浏览器。

截图、设计参考、原文网页快照、完整本地资源清单及私人账户状态未发布；文档与运行所需的已接入文章数据保留。正常版不会注入超长测试文本，验证版位于独立overflow-lab路径。手机分享仍为演示流程，未接入平台SDK。

## 检查

提交前检查了JS语法、构建入口、共享图片映射、根路径/嵌套路由及查询参数、字体请求和项目无图片字节。代码提交不等于Pages已部署；外网HTTP检查另行执行，不宣称本轮完成真实手机浏览器视觉验收。

未来发布应重新从本地源生成资源依赖计划，仅上传必要图片到公共站，再构建发布副本。旧发布副本与旧分支不会自动同步，不应直接覆盖main其他目录。
