# New homepage exploration branch

Before editing this branch's homepage, read `docs/HOME-V3-DESIGN-CONSTRAINTS.md`. It fixes the user-confirmed Figma 489:2631 structure, geometry, field limits, overflow behavior, and inherited interactions. The homepage has ONE recommendation slot with three possible types; daily magazine cards are 14:19 and daily cards stay 480px tall on desktop and 360px on mobile; the selected article section supports four resource types. Keep the original project in ../longyuan-reading-club-demo untouched.

Daily reading must contain 6 distinct resources; use the Figma 50px backdrop blur and no inherited extra overlay. V3 co-reading cover stays fixed, while the progress animation remains. Selected book footers are real authors; selected magazine covers use -z filenames. No play overlay on mixed-list podcast covers.

All pages must obey docs/COVER-RATIO-SPEC.md: book covers 2:3, magazine covers 14:19, standalone article covers 2:3. Apply the shared cover-ratios.css/js policy to new templates; do not change magazine article illustrations, podcast squares, avatars, icons, or event posters.
