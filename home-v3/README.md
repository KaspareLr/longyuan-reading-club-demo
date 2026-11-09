# 龙源读书会 · V3首页探索分支

这是独立的静态HTML/CSS/JavaScript项目，不覆盖原Demo。源目录没有Git仓库；发布使用独立Git工作副本。

## 接手先读

- [完整修改与交接说明](docs/V3-BRANCH-HANDOFF.md)：当前有效规则、各页面修改、文件导航、未完成事项与发布方式。
- [逐文件清单](docs/V3-FILE-INVENTORY.csv)：765个发布文件的新增／修改／复用状态及前后SHA。
- [各种场景的页面列表](docs/PUBLISHED-PAGE-LIST.md)：5个主要公网入口。

## 预览

在此目录执行：

```sh
python3 -m http.server 8770 --bind 0.0.0.0
```

打开 http://127.0.0.1:8770/preview-list.html 。手机同Wi-Fi访问电脑当前IPv4的8770端口。

- [公网全部页面](https://kasparelr.github.io/longyuan-reading-club-demo/home-v3/preview-list.html)
- [公网首页](https://kasparelr.github.io/longyuan-reading-club-demo/home-v3/)
- [GitHub快照分支](https://github.com/KaspareLr/longyuan-reading-club-demo/tree/home-v3-20261109/home-v3)

首页特例：`?recommendation=book|magazine|article`、`?lecturers=1`，可组合。移动端自动适配。

## 当前边界

账号、会员、报名、收藏、笔记和AI相关流程含本地演示。第一财经前5篇与一篇长文已接入下载全文重排，其他内容不能一概视为真实完整原文。PC双栏一屏高度限制仅已写入排版skill、尚未实现；近期改动未完成最终浏览器／实体手机视觉验收。

历史文档与当前实现存在差异，以交接说明和用户最新确认优先。原文快照和实验资料不在公网发布目录；交接说明与逐文件清单现随仓库发布。
