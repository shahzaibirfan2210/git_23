# Character asset

The hero can load a rigged, Mixamo-compatible GLB character from
`public/models/shahzaib.glb`. Keep the model optimized (ideally under 8 MB)
and include its skeletal animation clips in the GLB.

After adding the model, set `characterModel` in `src/data/portfolio.js` to
`"/models/shahzaib.glb"`. With the setting empty, the hero shows an abstract
3D AI sculpture instead of pretending a static illustration is an animated
human. The first animation clip plays by default; clips whose names include
`walk`, `wave`, `greet`, `think`, `type`, or `look` can be triggered while
scrolling through the page.
