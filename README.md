# webstickfont

Fonts in userspace.

Fonts are typically complicated and wrapped in abstractions - they're easy to
render as-is, but some of the trickier aspects of their display are rarely
exposed to users.

This project is inspired by [typeode](http://moebio.com/research/typode/)
but aims to be slightly more general, by
using stick fonts, or 'single line fonts', usually intended for CNC cutting.

Basically this is just a [CamBam Stick Font](http://www.mrrace.com/CamBam_Fonts/),
through [fontforge](http://fontforge.org/) with `convert.pe`, parsed into JSON
with `parse.js`.
