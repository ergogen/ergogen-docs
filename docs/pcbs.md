---
sidebar_position: 8
---

# PCBs

## Overview

Everything should be ready for a handwire at this point, but if you'd like the design to be more accessible to, and easily replicable by others, you might want to design a PCB as well.
To help you get started, Ergogen can automatically position the necessary footprints and an edge cut (or, other markings) so that all you need to do manually in KiCAD is the routing.
(Or, not even that, if you decide to use an auto-router.)

<br />





## Usage

A `pcbs` block in the config looks something like the following:

```yaml
pcbs:
  <pcb_name>:
    outlines:
      - outline: <reference to existing outline> # required
        layer: <which KiCAD layer to draw on> # default = Edge.Cuts
      ...
    footprints:
      - where: <filter> # same as for outlines
        asym: source | clone | both # same as for outlines, default = both
        adjust: <anchor> # same as for outlines
        what: <footprint to use>
        params: <param object for the footprint>
      ...
    references: <boolean, whether to show component references on the pcb> # default = false
  ...
```

:::note
The `pcbs.outlines` and the `pcbs.footprints` sections can both contain either arrays or objects, just like with outline or case parts previously.
Use whichever is more convenient.
:::

The most common use for the `pcbs.<pcb_name>.outlines` section is to define an edge cut for the pcb.
Simply reference one of the previously defined outlines through the `outline` setting and you're good to go.
Additionally, the section can also be used to send arbitrary marks to other silk or user defined layers, if its `layer` setting is specified.

Then comes the meat of the pcb declaration: placing footprints.
The `where`/`asym`/`adjust` keys do the exact same thing they did for [Outlines](./outlines.md#common-attributes), only now the points they produce will be used to place the footprint selected by the `what` key.
For a list of built-in footprints available, please check the contents of [this folder](https://github.com/ergogen/ergogen/tree/master/src/footprints) &ndash; the basename of each file here is what we can specify under the `what` key.
As for what parameters the chosen footprint can take, please refer to the footprint file's top comment (or the `params` section within the module exports).

:::tip
Footprint parameters can be simple values like booleans/numbers/strings, aggregate values like arrays/objects, or custom ergogen-specific values like "net" or "anchor".

- **Nets** are identified by a unique string name, but they are also indexed internally so that KiCAD knows what should connect where. Every component designated to the same net should be connected together once the PCB is routed.

- **Anchors** can be used to pass points to the footprint other than the position it will be placed at.
:::

It's important to uniformly note, though, that parameter parsing supports templating, as discussed under [Points](./points.md#keys).This means that key-level attributes can be passed along as footprint parameters, so when placing a footprint at multiple points, each footprint instance will have its appropriate parameter value overridden by the current point.

:::info
For example: assuming custom `from_net` and `to_net` attributes have been filled out in the points section, all keys on the keyboard can be placed by a single footprint declaration through templating, like so:

```yaml
pcbs.<pcb_name>.footprints:
  - where: true # everywhere
    what: mx # Cherry MX type switches
    params:
      from: "{{from_net}}" # double curly braces means templating...
      to: "{{to_net}}" # so, reading from the point's key-level attributes
```
:::

After both outlines and footprints are placed, only some fine-tuning is left for Ergogen to do:

- Globally show or hide all footprint references on the final PCB according to the `references` key.

- Fill the PCB metadata:
  - the name according to the `<pcb_name>` given in the config,
  - the version and author according to the top level `meta.version` and `meta.author` (see [Metadata](./metadata.md)).

The result is an **un-routed** KiCAD PCB, meaning that while everything knows what it **should** connect to, nothing's actually connected yet.
It's because the logistics (or, more like, the "topology") of potentially intersecting traces is not exactly trivial for a machine to automatically figure out.
From this point on, we can either trust an auto-router program to try and figure it out anyway (which is entirely possible for a simple keyboard project, even if not trivial), or we can route the connections manually (which is not nearly as hard as these disclaimers make it sound, by the way).

:::tip
Keyboards tend to incorporate lots of keys, while microcontrollers tend to lack that many general purpose I/O pins.
The most common solution is matrix wiring, which you can learn about [**here**](http://blog.komar.be/how-to-make-a-keyboard-the-matrix/) or [**here**](https://www.dairequinlan.com/2020/12/the-keyboard-part-2-the-matrix/).
Additionally, [**here**](https://wiki.ai03.com/books/pcb-design/page/pcb-guide-part-1---preparations)'s a very good introductory KiCAD tutorial covering most bases.
:::

<br />







## Footprints

inside the footprints
a params object declaring what can be / should supplied (as well as default values), and then a `body` function that gets the parsed (and potentially, used-overridden) parameters and spits out a kicad module that can be inserted into a template.

available within the body are
- all the footprint's params, PLUS
- ref, ref_hide, x/y/xy/at, r/rot, isxy, iaxy, esxy, eaxy, local_net







Footprint coordinate behavior has to be divided along the internal/external, and the symmetric/asymmetric axes. In this context, internal means coordinates within a module, which are already going to be affected by the module's overall position and rotation, while external means coordinates outside of modules (for example, traces, segments, zones). Symmetric means that we want a clockwise rotation or a right-pointing trace to be counter-clockwise and left-pointing, respectively, when applied to a mirrored point, while asymmetric means that we don't want this special treatment. This leads to a nice 2x2 matrix:

- Internal Symmetric: use the `isxy` function (read **I**nternal **S**ymmetric **XY**-position), which just takes the input x and y values, inverts the x if the source is a mirrored point, and that's it.

- Internal Asymmetric: use the `iaxy` function (read **I**nternal **A**symmetric **XY**-position) to ignore whether a point is mirrored or not, so rightward shifts will be rightward, even on mirrored points (leading to an asymmetric end result, hence the name of this category).

  :::note
  This case doesn't need any functions, strictly speaking, as hardcoding the x and y values directly into the KiCAD string (within a module!) would behave like this by default anyway.
  `iaxy` is available mostly to complete the pattern and to prevent the author's OCD from flaring up.
  :::

- External Symmetric: use the `esxy` function (read **E**xternal **S**ymmetric **XY**-position), which applies the same shift and rotation context to the values as a module environment would first, so that the same relative input XY values can lead to the same location both inside and outside modules. The "S" in the same means that we want "Symmetry" through special mirroring treatment, thereby negating the horizontal shifts appropriately when dealing with mirrored points.

- External Asymmetric: use the `eaxy` function, which applies the same constant context as the External Symmetric case, only it does so (you guessed it) asymmetrically.
