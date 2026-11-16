# 《水浒传》叙事详情实验

入口：`water-margin.html`。新 Demo 的 `portal.html#/book/rb-ob-01` 自动进入实验；`portal.html#/book/rb-ob-01?view=classic` 保留普通详情。其他书籍与原 Demo 不受影响。

## 故事与交互

1. 入江湖：Three.js 实体书（独立封面、封底、内页、书脊），鼠标视差、滚动旋转，108 颗空间微粒。
2. 林冲雪夜：固定画面随原生滚动推进三段情节，风雪粒子与画面缓慢推近。
3. 停下来听：三段实际可播放的本地合成中文导读，支持进度、倍速、选集、文字稿。
4. 武松打虎：从逞强到求生再到英雄形象，滚动揭示不同读法。
5. 江湖六问：3D 翻面、掌握记录保存在本地、导出 UTF-8 CSV，可导入 Anki 的正面/背面/标签字段。
6. 梁山聚义：从不同来路、组织秩序，到招安分歧。
7. 知识地图：六个人物可点选，联动关系、阅读问题、场景返回入口。
8. 终章：三种观点选择与本地记录，之后进入前六回目录、原阅读页、书架和领读入口。

采用原生滚动，不接管滚轮；支持手机；减少动态效果时展开全部情节、关闭视差与持续动画。WebGL 不可用时保留 CSS 立体封面。渲染在首屏离开及页面不可见时暂停。所有素材、Three.js 与音频本地化，不依赖运行时 CDN。

## 参考

- [SBS — The Boat](https://www.sbs.com.au/theboat/)：插图、文本与阅读节奏的连续叙事。
- [My Little Storybook](https://www.awwwards.com/sites/my-little-storybook)：书本隐喻与沉浸式章节体验。
- [Three.js 官方场景文档](https://threejs.org/manual/pages/creating-a-scene.html)。使用 0.180.0，MIT 许可证保存在 vendor/three-LICENSE.txt。
- [中国哲学书电子化计划：明容与堂刻本水浒传](https://ctext.org/library.pl?if=en&remap=gb&res=81158)。故事按百回本回目脉络编排，非历史事件复原。原站图书资料沿用已有 Demo 元数据。章节正文仍是现有排版演示。

## 图片与语音

图片由内置 image_gen 生成，已人工查看；编码为 WebP 用于页面。最终素材位置：`assets/water-margin/snow.webp`、`tiger.webp`、`liangshan.webp`。语音是 macOS Tingting 合成的原创导读文案，非真人播客，界面已标明。

生成提示词（最终版）：

### snow
Create one ultra-wide cinematic Chinese ink-wash illustration for an immersive literary website about the classic Water Margin (Shui Hu Zhuan). Landscape ratio 3:2 or widescreen. Scene: Lin Chong, a lone small Song-dynasty swordsman seen from behind, straw rain cape, carrying a long spear, approaching an ancient mountain temple in a vast blizzard, distant temple emits a very tiny warm vermilion fire glow. Rich charcoal black craggy pines and cliffs frame the RIGHT and lower edges, sweeping snow and mist, silvery slate gray sky, subtle aged ivory paper grain. Strong atmospheric perspective, hand-painted sumi-e brushwork with refined realistic cinematic spatial depth, quiet and ominous, sophisticated museum editorial art. Reserve LEFT third in deep nearly-black mist with very little detail for cream website typography overlay, center-right hero figure and temple. Black, ash, muted parchment, ONE tiny vermilion accent. No letters, no typography, no logos, no borders, not an interface screenshot. This is a final website background asset.

### tiger
Final landscape illustration, cinematic Chinese ink painting for a Water Margin literary scrollytelling website. Wu Song on Jingyang Ridge: an imposing Chinese tiger with swirling textured ink-striped fur in the RIGHT half, facing a tiny Song dynasty traveler holding a broken staff at center-left, ancient gnarled pine trunks, moonlit mountain mist. Freeze the tense instant BEFORE confrontation, no violence, no blood. Sophisticated hand-painted black Chinese ink with delicate ivory highlights on muted warm parchment, a small deep rust-red moon in upper right, remarkable composition with dramatic empty space on LEFT for overlay text. Crisp engraving-like line detail mixed with atmospheric ink wash, editorial museum quality, not cartoon, no photorealism, no modern objects, no writing, no borders. Wide 3:2 or cinematic landscape aspect. Distinctive tiger closeup and small heroic human silhouette, dramatic scale.

### liangshan
Ultra-wide immersive cinematic Chinese ink-wash landscape for Water Margin classic novel webpage. Liangshan marsh under a giant muted vermilion setting sun, immense dark slate mountains fading into mist in distance, Song dynasty fortress watchtowers and a cluster of small dark banner silhouettes far away on center ridge, quiet marsh water in foreground with tiny wooden boat and reed silhouettes. Vast open negative space left and center for cream typography, detailed landscape RIGHT, rich velvet charcoal black foreground, ash-gray watercolor sky with warm parchment paper texture, ONE red sun. Refined East Asian ink painting meets dramatic film concept art, exquisite brushwork, literary and melancholic. Horizontal 3:2 or widescreen composition. No people closeup, no writing, no letters, no logos, no interface, no decorative frame. Final real website background asset.

## 验证

- JS 语法检查通过。
- 1440×810 与 390×844 无横向溢出，插图与 3D 书成功加载。
- 风雪场景随滚动推进到第二段，固定画面位置为 0。
- 实际播放确认 currentTime 增长；三段音频分别约 44 / 42 / 41 秒。
- 翻面、掌握记录、选集、导读文字、地图人物点击、观点选择已操作检查。
- CSV 下载成功，并核对 6 行、每行 3 个字段。
- 水浒传详情入口确实跳转到实验页。
