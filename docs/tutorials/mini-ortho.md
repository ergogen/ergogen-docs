---
id: 'mini-ortho'
sidebar_label: 'Minimal Ortholinear 5x3+2'
sidebar_position: 0
---

# Minimal Ortholinear 5x3+2

## Objective

Our aim for this tutorial is to use Ergogen to create a pcb for a small split keyboard.
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

If we input our config so far into the gui, we see the following:
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
Putting our current config into the gui results in the following:
TODO: image

This is all we want for the finger keys, we are ready to move on to the thumb keys.

### Thumb keys

TODO: description
TODO: images from gui

### Outline

TODO: description using binding
TODO: images from gui

### Key footprints

TODO: description using mx footprint (reversible?, hotswap?)
TODO: images from KiCad

### ProMicro and TRRS

TODO: description
TODO: images from KiCad

### Outline again

TODO: description for adjusting outline to accommodate new components
TODO: images from KiCad

## Review

TODO: review steps taken
TODO: include final images from gui and KiCad
