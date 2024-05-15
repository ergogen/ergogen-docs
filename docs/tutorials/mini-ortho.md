---
id: 'mini-ortho'
sidebar_label: 'Minimal Ortholinear 5x3+2'
sidebar_position: 0
---

# Minimal Ortholinear 5x3+2

## Objective

Our aim for this tutorial is to use Ergogen to create a PCB for a small split keyboard.
On each side it will have 5 columns of 3 rows each for the fingers, and 2 keys for the thumb.
It will also include a footprint for a ProMicro and a TRRS connector.

## Steps

### Finger keys

We begin by defining our points zone for the finger keys.
We could name the zone whatever we wanted, but for simplicity we will go with `fingers`.

```yaml
points:
    zones:
        fingers:
```

Our next step is to create some columns.
As before, we can name the columns however we like, but for simplicity we will name them as below:

```yaml
points:
    zones:
        fingers:
            columns:
                pinky:
                ring:
                middle:
                index:
                inner:
```

If we input our config so far into the GUI, we see the following:
TODO: image

We have our 5 columns, but we need our 3 rows; we will name them `bottom`, `home` and `top`.

```yaml
points:
    zones:
        fingers:
            columns:
                pinky:
                ring:
                middle:
                index:
                inner:
            rows:
                bottom:
                home:
                top:
```

:::note
Columns are named from left to right by default, and rows are named from bottom to top by default.
While this won't make a difference in this tutorial, in others it will.
:::
Putting our current config into the GUI results in the following:
TODO: image

This is all we want for the finger keys, so we are ready to move on to the thumb keys.

### Thumb keys

For our thumb keys, it is easiest to create a new zone, which we will name `thumb`.
With this zone, we want to specify a position to start from, to fix where it is in relation to the finger keys.
We do this using the `anchor` option.

```yaml
points:
    zones:
        fingers:
            columns:
                pinky:
                ring:
                middle:
                index:
                inner:
            rows:
                bottom:
                home:
                top:
        thumb:
            anchor:
                ref: fingers_inner_bottom
                shift: [0,-u]
```

This specifies that we want our first thumb key to be one `u` down from the `bottom` key in the `inner` column of the `fingers` zone.
Here `u` is a default unit from Ergogen that measure 19mm, and is the default spacing between keys.

Inputting this config into the GUI gives:
TODO: image

Our next step is to specify our second thumb key, which we do using `columns`.

```yaml
points:
    zones:
        fingers:
            columns:
                pinky:
                ring:
                middle:
                index:
                inner:
            rows:
                bottom:
                home:
                top:
        thumb:
            anchor:
                ref: fingers_inner_bottom
                shift: [0,-u]
            columns:
                tuck:
                reach:
```

At this point the positions of all of our keys have been specified as we want.
However, if we want to later refer to the position of our thumb keys, we would have to use names like `thumb_tuck_default`,
as we did not specify any rows.
We can override this behaviour by giving these keys names.

```yaml
points:
    zones:
        fingers:
            columns:
                pinky:
                ring:
                middle:
                index:
                inner:
            rows:
                bottom:
                home:
                top:
        thumb:
            anchor:
                ref: fingers_inner_bottom
                shift: [0,-u]
            columns:
                tuck:
                    key:
                        name: thumb_tuck
                reach:
                    key:
                        name: thumb_reach
```

:::note
The `name` option is a `key` level option, and thus must be nested within `key`.
:::

Since we aren't specifying any other information for the thumb keys, we can make our config more concise as follows:

```yaml
points:
    zones:
        fingers:
            columns:
                pinky:
                ring:
                middle:
                index:
                inner:
            rows:
                bottom:
                home:
                top:
        thumb:
            anchor:
                ref: fingers_inner_bottom
                shift: [0,-u]
            columns:
                tuck.key.name: thumb_tuck
                reach.key.name: thumb_reach
```

The output from the GUI now looks like:
TODO: image

### Outline

Now that we have positioned our keys, we will create a first draft of the outline of our PCB.

```yaml
points:
    # as above
outlines:
    draft:
        keys:
            what: rectangles
            where: true
            size: [u,u]
            bound: true
```

This is specifying that centered at each point we want a rectangle of size `u` by `u`.
The `bound` option asks Ergogen to connect the rectangles in each zone together where it is able to.

Previewing `draft.dxf` in the GUI gives the following:
TODO: image

We now add a polygon to provide some extra strength in the lower part of the PCB:

```yaml
points:
    # as above
outlines:
    draft:
        keys:
            what: rectangle
            where: true
            size: [u,u]
            bound: true
        lower:
            what: polygon
            points:
                - ref: thumb_tuck
                  shift: [-u/2,-u/2]
                - ref: fingers_pinky_bottom
                  shift: [-u/2,-u/2]
                - ref: fingers_inner_bottom
                  shift: [-u/2,-u/2]
```

This draws a triangle between the lower left corners of the referenced keys.
The shift option specifies to use the lower left corner, rather than the center of the keys.

Now viewing `draft.dxf` in the GUI gives the following:
TODO: image

### Key footprints

We now need to tell Ergogen to create a PCB, using the outline we have created.

```yaml
points:
    # as above
outlines:
    # as above
pcbs:
    main:
        outlines:
            - outline: draft
```

If you view the `main.kicad_pcb` file now, you will just see an outline, without anything to denote the key positions.
This is because we need to tell Ergogen to put a footprint at each of our `points`.

```yaml
points:
    # as above
outlines:
    # as above
pcbs:
    main:
        outlines:
            - outline: draft
        footprints:
            keys:
                what: mx
                where: true
                params:
                    from: ""
                    to: ""
```

This tells Ergogen to place the `mx` footprint (from `what: mx`) at all of our points (from `where: true`).
This footprint also requires some `params`: `from` and `to`, which we have left as the empty string `""` for the moment.

Our `main.kicad_pcb` file now looks like:
TODO: image

We now specify the nets in KiCad that each of our switches will connect to.
Since we only have 17 keys on each board, we don't need to use a matrix (TODO:helpful link).
Thus we will connect one side of our switch to the `GND` net, and the other side to
a net named after the point the footprint is placed at.

```yaml
points:
    # as above
outlines:
    # as above
pcbs:
    main:
        outlines:
            - outline: draft
        footprints:
            keys:
                what: mx
                where: true
                params:
                    from: GND
                    to: "{{name}}"
```

:::note
This `"{{name}}"` is a "redirection string" that accesses key level meta-data.
:::

In addition to the required `params` (`from` and `to`), the `mx` footprint also has optional parameters,
including `hotswap`, `reverse` and `keycaps`.
- enabling `hotswap` makes the board compatible with hotswap sockets, rather than directly soldering switches,
- enabling `reverse` makes the footprint reversible, so you can use the same board for both the left and right side,
- enabling `keycaps` adds a drawing to the footprint to show where the keycap will be.
We will enable all of them:

```yaml
points:
    # as above
outlines:
    # as above
pcbs:
    main:
        outlines:
            - outline: draft
        footprints:
            keys:
                what: mx
                where: true
                params:
                    from: GND
                    to: "{{name}}"
                    hotswap: true
                    reverse: true
                    keycaps: true
```

Viewing the resulting file in KiCad now shows:
TODO: image

### ProMicro and TRRS

We now add the footprints for the MCU (a ProMicro) and a TRRS connector:

```yaml
points:
    # as above
outlines:
    # as above
pcbs:
    main:
        outlines:
            - outline: draft
        footprints:
            keys:
                what: mx
                where: true
                params:
                    from: GND
                    to: "{{name}}"
                    hotswap: true
                    reverse: true
                    keycaps: true
            mcu:
                what: promicro
                where:
                    ref: fingers_inner_home
                    shift: [u,u/2]
                adjust:
                    rotate: -90
            trrs:
                what: trrs
                where:
                    ref: thumb_reach
                    shift: [u/2,u]
                adjust:
                    rotate: -90
                params:
                    A: ""
                    B: ""
                    C: ""
                    D: ""
```

This new config positions them to the right of the `fingers` zone and directly above the `thumb_reach` key.
Like with switches, these footprints have nets in KiCad associated to them, which we can change using `params`.

```yaml
points:
    # as above
outlines:
    # as above
pcbs:
    main:
        outlines:
            - outline: draft
        footprints:
            keys:
                what: mx
                where: true
                params:
                    from: GND
                    to: "{{name}}"
                    hotswap: true
                    reverse: true
                    keycaps: true
            mcu:
                what: promicro
                where:
                    ref: fingers_inner_home
                    shift: [u,u/2]
                adjust:
                    rotate: -90
                params:
                    P7: fingers_pinky_top
                    P18: fingers_ring_top
                    P19: fingers_middle_top
                    P20: fingers_index_top
                    P21: fingers_inner_top
                    P15: fingers_pinky_home
                    P14: fingers_ring_home
                    P16: fingers_middle_home
                    P10: fingers_index_home
                    P1: fingers_inner_home
                    P2: fingers_pinky_bottom
                    P3: fingers_ring_bottom
                    P4: fingers_middle_bottom
                    P5: fingers_index_bottom
                    P6: fingers_inner_bottom
                    P8: thumb_tuck
                    P9: thumb_reach
            trrs:
                what: trrs
                where:
                    ref: thumb_reach
                    shift: [u/2,u]
                adjust:
                    rotate: -90
                params:
                    reverse: true
                    symmetric: true
                    A: GND
                    B: GND
                    C: P0
                    D: VCC
```

We also enabled the `reverse` and `symetric` options for the `trrs` footprint.
Now the output in KiCad looks like this:
TODO: image

### Outline again

We notice from the last picture that our footprints for the MCU and TRRS connector lie outside of our outline.
So we update our outline to account for this:

```yaml
points:
    # as above
outlines:
    draft:
        keys:
            what: rectangle
            where: true
            size: [u,u]
            bound: true
        lower:
            what: polygon
            points:
                - ref: thumb_tuck
                  shift: [-u/2,-u/2]
                - ref: fingers_pinky_bottom
                  shift: [-u/2,-u/2]
                - ref: fingers_inner_bottom
                  shift: [-u/2,-u/2]
        right:
            what: rectangle
            where:
                - ref: fingers_inner_home
                  affect: y
                - ref: thumb_reach
                  affect: x
            size: [u, 3u]
pcbs:
    # as above
```

Now our outline includes all of our footprints:
TODO: image

Our final step is to then add a bit more room around the edge of our PCB, using the `expand` option.
(This has the added benefit of rounding off the corners slightly.)

```yaml
points:
    # as above
outlines:
    draft:
        keys:
            what: rectangle
            where: true
            size: [u,u]
            bound: true
        lower:
            what: polygon
            points:
                - ref: thumb_tuck
                  shift: [-u/2,-u/2]
                - ref: fingers_pinky_bottom
                  shift: [-u/2,-u/2]
                - ref: fingers_inner_bottom
                  shift: [-u/2,-u/2]
        right:
            what: rectangle
            where:
                - ref: fingers_inner_home
                  affect: y
                - ref: thumb_reach
                  affect: x
            size: [u, 3u]
    final:
        final:
            what: outline
            name: draft
            expand: 2
pcbs:
    main:
        outlines:
            - outline: final
        footprints:
            # as above
```

TODO: description for adjusting outline to accommodate new components
TODO: images from KiCad

## Review

So our full config is:
```yaml
points:
    zones:
        fingers:
            columns:
                pinky:
                ring:
                middle:
                index:
                inner:
            rows:
                bottom:
                home:
                top:
        thumb:
            anchor:
                ref: fingers_inner_bottom
                shift: [0,-u]
            columns:
                tuck.key.name: thumb_tuck
                reach.key.name: thumb_reach
outlines:
    draft:
        keys:
            what: rectangle
            where: true
            size: [u,u]
            bound: true
        lower:
            what: polygon
            points:
                - ref: thumb_tuck
                  shift: [-u/2,-u/2]
                - ref: fingers_pinky_bottom
                  shift: [-u/2,-u/2]
                - ref: fingers_inner_bottom
                  shift: [-u/2,-u/2]
        right:
            what: rectangle
            where:
                - ref: fingers_inner_home
                  affect: y
                - ref: thumb_reach
                  affect: x
            size: [u, 3u]
    final:
        final:
            what: outline
            name: draft
            expand: 2
pcbs:
    main:
        outlines:
            - outline: final
        footprints:
            keys:
                what: mx
                where: true
                params:
                    from: GND
                    to: "{{name}}"
                    hotswap: true
                    reverse: true
                    keycaps: true
            mcu:
                what: promicro
                where:
                    ref: fingers_inner_home
                    shift: [u,u/2]
                adjust:
                    rotate: -90
                params:
                    P7: fingers_pinky_top
                    P18: fingers_ring_top
                    P19: fingers_middle_top
                    P20: fingers_index_top
                    P21: fingers_inner_top
                    P15: fingers_pinky_home
                    P14: fingers_ring_home
                    P16: fingers_middle_home
                    P10: fingers_index_home
                    P1: fingers_inner_home
                    P2: fingers_pinky_bottom
                    P3: fingers_ring_bottom
                    P4: fingers_middle_bottom
                    P5: fingers_index_bottom
                    P6: fingers_inner_bottom
                    P8: thumb_tuck
                    P9: thumb_reach
            trrs:
                what: trrs
                where:
                    ref: thumb_reach
                    shift: [u/2,u]
                adjust:
                    rotate: -90
                params:
                    reverse: true
                    symmetric: true
                    A: GND
                    B: GND
                    C: P0
                    D: VCC
```

This gives us a PCB that looks like:
TODO: image

Obviously at the moment, none of the switches are connected to the ProMicro.
TODO: finish explanation of how to complete the PCB
