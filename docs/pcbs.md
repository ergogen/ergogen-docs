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
    template: <string> # name of the PCB template to use, default = kicad5
    params: <anything, pcb-level custom parameters passed to the template>
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

Footprint parameters can be simple values like booleans/numbers/strings, aggregate values like arrays/objects, or custom Ergogen-specific values like "net" or "anchor".

- **Nets** are identified by a unique string name, but they are also indexed internally so that KiCAD knows what should connect where. Every component designated to the same net should be connected together once the PCB is routed.

- **Anchors** can be used to pass points to the footprint other than the position it will be placed at.

It's important to uniformly note, though, that parameter parsing supports templating, as discussed under [Points](./points.md#keys). This means that key-level attributes can be passed along as footprint parameters, so when placing a footprint at multiple points, each footprint instance will have its appropriate parameter value overridden by the current point.

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

- Paste the calculated outlines and footprints into the correct PCB template (specified via `pcbs.<pcb_name>.template`).

The result is an **un-routed** KiCAD PCB, meaning that while everything knows what it **should** connect to, nothing's actually connected yet.
It's because the logistics (or, more like, the "topology") of potentially intersecting traces is not exactly trivial for a machine to automatically figure out.
From this point on, we can either trust an auto-router program to try and figure it out anyway (which is entirely possible for a simple keyboard project, even if not trivial), or we can route the connections manually (which is not nearly as hard as these disclaimers make it sound, by the way).

:::tip
Keyboards tend to incorporate lots of keys, while microcontrollers tend to lack that many general purpose I/O pins.
The most common solution is matrix wiring, which you can learn about [**here**](http://blog.komar.be/how-to-make-a-keyboard-the-matrix/) or [**here**](https://www.dairequinlan.com/2020/12/the-keyboard-part-2-the-matrix/).
Additionally, [**here**](https://wiki.ai03.com/books/pcb-design/page/pcb-guide-part-1---preparations)'s a very good introductory KiCAD tutorial covering most bases.
:::

<br />







## Examples

<details><summary>Simple Keys + MCU</summary>
<p>

<Tabs>
<TabItem value="config" label="Config" default>

```yaml

```

</TabItem>
<TabItem value="visualization" label="Visualization">
<div style={{textAlign: 'center'}}>

<!-- ![name](./assets/file.png) -->

</div>
</TabItem>
</Tabs>

</p>
</details>

<br />










## Footprints

Ergogen provides a set of default, built-in footprints for the most common use-cases (again, found and documented in [this folder](https://github.com/ergogen/ergogen/tree/master/src/footprints)), designers might want to (or need to) extend this set with custom footprints.
And while they don't have to modify the Ergogen codebase to achieve this (see [bundles](./formats.md#bundles)), they do need to provide an "Ergogen-ized" version of the raw KiCAD footprint file.
<!-- Note auto-parse option here once it's available -->

Each Ergogen-ized footprint is a `.js` file that looks something like the following:

```js
module.exports = {
  params: {
    designator: '_', // the only semi-required param, for naming components on the PCB
    // and now any other param names, with default values supplied
    // note that the default value also tells Ergogen the param's type
    bool_param: true,
    string_param: 'default',
    number_param: 42,
    array_param: ['a', 'b', 'c'], // regular array
    object_param: {a: 1, b: 2, c: 3}, // regular object
    // expanded definitions, so we know these are not just regular objects
    net_param: {type: 'net', value: 'GND'},
    anchor_param: {type: 'anchor', value: 'existing_point_name'}
  },
  body: parsed_params => {
    // any procedural code returning "filled out" KiCAD footprint
    return `
      (module something (layer something)
        ${parsed_params.at}
        // bla bla bla
        ${parsed_params.any_other_param}
        // bla bla bla
      )
    `
  }
}
```

So the main export is an object containing A) a `params` sub-object declaring what can be / should be supplied to this footprint as a parameter (as well as default values for these, hinging at the type of the param), and then a `body` function that gets the parsed (and potentially, user-overridden) parameters and spits out a KiCAD module that can be inserted into a template as a raw string.

Of the `params`, only the `designator` is shared among all footprint types, as the footprint needs to be called *something* on the generated PCB. By default, it's just an underscore (`_`). This then acts as a prefix that gets a number suffix to make the name for each footprint of this kind unique. All other parameters are optional and footprint-specific, which users can override in their configs.

The heavy lifting is done by the `body` function, that converts the footprint's template to an actual footprint string (after some optional procedural calculations, loops, parameter-based conditional branching, etc.). It's where the position and rotation of the footprint are inserted into its `at` clause (so it'll end up where we want it on the PCB), and where the reference name and any other custom parameters are "filled out" (for example, which pad or through-hole should connect to which net).

Boolean, string, number, array and object parameters can be used intuitively (since they're already JavaScript datatypes), but a note on Ergogen-specific nets and anchors:

- `net` type parameters return net-objects that have the following fields:
  - `name` - the name of the net
  - `index` - the numeric index of the net (sometimes KiCAD needs this info, too)
  - `str` - a string representation, containing both name and index, defined as `(net ${index} "${name}")` (and this is also the default string representation of the whole object, if printed directly).

- `anchor` type parameters get points that have the expected `x`/`y`/`r` fields, plus the corresponding metadata of the point under the `meta` key.

:::tip
If you're creating a custom Ergogen footprint, your best bet is looking at how an existing footprint incorporates the actual KiCAD footprint text and wraps it with its own minimal "infrastructure". From there, you can just A) make the positioning parametric, B) decouple a few parameters you want the users to be able to specify in their configs, and C) swap out the occurrences of those values in the footprint text for references to the corresponding parameter values.
:::




### Footprint API

As you saw in the previous section, the `body` function of a footprint gets a `parsed_params` object from which it can use the pre-parsed, footprint-specific, and potentially overridden parameter values declared in its `params` section, plus a few other values/functions Ergogen uniformly provides for all footprints:

- `ref`: The computed reference name of the component. Defined as the designator of the footprint plus a running index suffix. (So, for example, `D4` for the fourth diode, assuming `D` is the designator for diodes.)

- `ref_hide`: a boolean flag indicating whether to show the above `ref` on the silkscreen of the PCB (derived from `pcbs.<pcb_name>.references`)

- `x`/`y`/`r`/`rot`/`xy`/`at`: values to help position the footprint where it needs to go.
  - `x`/`y`/`r` contain plain numbers with the appropriate values for the current point (`rot` being a deprecated synonym for `r`),
  - `xy` is a string representation of `x` and `y` together, defined as `${x} ${y}`, and
  - `at` is the full `at` positioning clause expected by KiCAD containing all three coordinates, defined as `(at ${x} ${y} ${r})`.

- `isxy`, `iaxy`, `esxy`, `eaxy`: these functions help with positioning sub-elements inside and outside the main `module`/`footprint` context. See the next section for details.

- `local_net`: this function helps define nets that are local to each footprint instance - implemented as nets whose names are prefixed by the `ref`erence of the footprint they're local to. For example, the call `local_net('trace')` within the a diode footprint with designator `D` leads to (a properly indexed) `D1_trace` net object in the first instance, `D2_trace` in the second, etc. (so that you don't have to worry about ambiguous references when using a footprint multiple times).




### Footprint Coordinates


Footprint coordinate behavior has to be divided along the internal/external, and the symmetric/asymmetric axes. In this context, internal means coordinates within a KiCAD `module`/`footprint`, which are already going to be affected by the module's overall position and rotation, while external means coordinates outside of modules (for example, traces, segments, zones that accompany the main module in the same shared footprint file). Symmetric means that we want a clockwise rotation or a right-pointing trace to be counter-clockwise and left-pointing, respectively, when applied to a mirrored point, while asymmetric means that we don't want this special treatment. This leads to a nice 2x2 matrix:

- Internal Symmetric: use the `isxy` function (read **I**nternal **S**ymmetric **XY**-position), which just takes the input x and y values, inverts the x if the source is a mirrored point, and that's it.

- Internal Asymmetric: use the `iaxy` function (read **I**nternal **A**symmetric **XY**-position) to ignore whether a point is mirrored or not, so rightward shifts will be rightward, even on mirrored points (leading to an asymmetric end result, hence the name of this category).

  :::note
  This case doesn't need any functions, strictly speaking, as hardcoding the x and y values directly into the KiCAD string (within a module!) would behave like this by default anyway.
  `iaxy` is available mostly to complete the pattern and to prevent the author's OCD from flaring up.
  :::

- External Symmetric: use the `esxy` function (read **E**xternal **S**ymmetric **XY**-position), which applies the same shift and rotation context to the values as a module environment would first, so that the same relative input XY values can lead to the same location both inside and outside modules. The "S" in the same means that we want "Symmetry" through special mirroring treatment, thereby negating the horizontal shifts appropriately when dealing with mirrored points.

- External Asymmetric: use the `eaxy` function, which applies the same constant context as the External Symmetric case, only it does so (you guessed it) asymmetrically.

All four of these are used in the form `[i/e][s/a]xy(x, y)` - so, a function call with the desired `x` and `y` values supplied as parameters, returning an object with the following fields:

- `x`/`y` for the properly calculated coordinate values for the given use-case, and
- `str` containing both `x` and `y` in string form, similarly to how the footprint's global position was supplied via `parsed_params.xy`, defined as `${x} ${y}` (and this is also the default string representation of the whole object, if printed directly).

<br />






## Templates

Besides footprints, Ergogen also provides a set of default, built-in templates for different KiCAD versions (found in [this folder](https://github.com/ergogen/ergogen/tree/master/src/templates)). But, again, designers might want a custom template. And, again, they don't have to modify the Ergogen codebase to achieve this (see [bundles](./formats.md#bundles)), only supply a `.js` file that looks something like the following:

```js
module.exports = {
  // convert MakerJS shapes into KiCAD shapes
  convert_outline: (model, layer) => {
    // ...
  },
  // create the final KiCAD PCB from the precomputed parts
  body: parts => {
    // ...
  }
}
```

This stuff is really technical, but if you're this deep, you probably (need to) know that Ergogen relies on MakerJS for its 2D geometry. It's the template's job to convert these shapes to a format that KiCAD can understand for the Edge.Cuts (or any other silkscreen markings). It's also the template's job to take these converted shapes, along with the already prepared footprints, nets and other metadata, and combine them into a single text representation that is KiCAD's `.kicad_pcb` file. Or something else, if you're targeting another format...

`convert_outline` gets the shape in MakerJS format as `model` plus the `layer` onto which this shape needs to print, and returns a text representation of the shape in the PCB's language.

`body` creates the final PCB using the `parts` object that contains the following:

- `name`: the name of the PCB, based on the config,
- `version`: the version of the PCB, based on the [`meta` block](./metadata.md),
- `author`: the author of the PCB, based on the [`meta` block](./metadata.md),
- `nets`: an object containing all nets present in the PCB, formatted as `{name: index, ...}`,
- `footprints`: an array of all precomputed footprints, already in their final text form (see [Footprints](#footprints) above),
- `outlines`: an object of all precomputed shapes from `convert_outlines`, formatted as `{name: text, ...}`,
- `custom`: any other custom user-supplied parameters from `pcbs.<pcb_name>.params`.

:::tip
As with footprints, your best bet is looking at [existing PCB templates](https://github.com/ergogen/ergogen/tree/master/src/templates) when creating your own. There you will see how a conversion from MakerJS happens, and how the final PCB is laid out (both of which you can then modify according to the new format you're targeting).
:::