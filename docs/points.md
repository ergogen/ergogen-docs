---
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Points

A point in this context refers to a 2D point `[x,y]` with a rotation/orientation `r` and some extra metadata added in.
These can be thought of as the middle points of the keycaps in a resulting keyboard layout, with the additional handling of the angle of the keycap, plus, again, some metadata (like names, row/column information, custom variables, etc.).
Points can later be used to position shapes (to form board outlines) and PCB footprints – optionally by using filters to use only a subset.

But thing would get pretty tedious if we had to lay out each point manually, and downright horrific if any kind of trigonometry came into play!
So Ergogen tries to do as much of the heavy lifting as it can while providing more comfortable declaration alternatives.





## Anchors

One of these alternatives is the use of anchors, where we don't *directly* specify a point's `x`/`y`/`r` coordinates, but compute it from an already existing starting point through some translation/rotation.
Anchors try to be very flexible, and it naturally comes with some complexity – but remember that they are just another way to declare a point.

Anchors can be parsed from the following data types:

- A ***string*** means it's just a reference to an already existing point with that name, without any further modifications.

- An ***array*** means it's a multipart anchor (or, multi-anchor), each item being an anchor itself, recursively.
  But why would we need multiple anchors for a single point, you might ask.
  Because each sub-anchor becomes the starting point of the next.
  
  :::tip
  Think of this as a kind of treasure hunt where you first have to find a clue to know where the next clue will be.
  Through this *follow-the-dots* functionality, you can get to many interesting, exact locations on your board without having to actually calculate where that is.
  :::

- An ***object*** means it's a full anchor declaration.


### Attributes

In a full, object anchor declaration, the following fields can be used:

- **`ref`** is the starting point from where the anchor will perform its additional modifications.
  This field is parsed as an anchor itself, recursively.
  So in its easiest form, it can be a string to designate an existing starting point by name (more on names later), but it can also be a full nested anchor if so desired.

- **`aggregate`** is an alternative to `ref` when the combination of several locations is required as the starting point for further adjustment.
  They're mutually exclusive, so we can use either `ref` or `aggregate` in any given anchor.
  The aggregate field is always an object, containing:

  - a `parts` array containing the sub-anchors we want to aggregate, and 
  - a `method` string to indicate *how* we want to aggregate them.

  The only method implemented so far is `average`, which is the default anyway, so the `method` can be omitted for now.

  :::note
  Averaging applies to both the `x`/`y` coordinates *and* the `r` rotation.
  :::

- **`orient`** is a kind of pre-rotation, meaning it happens before any shifting is done.
  The value can be:

  - a ***number***, in which case that number is simply added to the current rotation of the in-progress point calculation; or
  - a ***sub-anchor***, in which case the point "turns towards" the point we reference (meaning its rotations will be exactly set to hit that point if a line was projected from it).

  <br/>

  :::note
  Orienting only affects the `r` value of the point we're calculating.
  :::

- **`shift`** is for shifting (or, more formally, translating) the point on the XY plane.
  The value can be:

  - a ***array of exactly two numbers***, specifying the `x` and `y` shift, respectively, or
  - a single ***number***, which would get parsed as `[number, number]`.

  <br/>

  :::caution
  It's important that shifting happens according to the current rotation of the point.
  By default, a 0° rotation is "looking right", so that positive `x` shifts move it to the right, negative `x` shifts to the left, positive `y` shifts up, negative `y` shifts down.
  But if r=90° (so the point is "looking down", as rotation works clockwise), then a positive `x` shift would move it downward.
  :::

- **`rotate`** is a kind of *post*-rotation after shifting, as opposed to how `orient` was the *pre*-rotation.
  Otherwise, it works the exact same way.

- **`affect`** can specify an override to what fields we want to affect during the current anchor calculation.
  The value can be:

  - a ***string*** containing a subset of the characters `x`, `y`, or `r` only; or
  - an ***array*** containing a subset of the one letter strings `"x"`, `"y"`, or `"r"` only.

  <br/>

  :::tip
  Let's say you have a point rotated 45° and want to shift is "visually right". You could either reset its rotation via `orient`, then shift, then re-set the rotation with `rotate`; or, you could do the shift and then declare that this whole anchor only `affect`s `"x"`.

  Or let's say you want to copy the rotation of another, already existing point into your current anchor calculation. You can do so using a multi-anchor (see above), `ref`erencing the existing point in the second part, and then declare `affect: "r"` to prevent it from overwriting anything else, thereby setting just the rotation.
  :::

- **`resist`** states that we do **not** want the special treatment usually afforded to mirrored points.
  We'll get to [mirroring](#mirroring) in a second, but from an anchor perspective, all we need to know is that shifting and orienting/rotating are all mirrored for mirrored points, to keep things symmetric.
  So if we specify a shift of `[1, 1]`, what actually gets applied is `[-1, 1]`, and rotations are counter-clockwise in those cases, too.
  But if we don't want this behavior, (say, because PCB footprints go on the same, upward facing side of the board, no matter the half) we can `resist` it.





### Examples

<details><summary>Basic</summary>
<p>

To get the gist of what's happening, take a look at the following anchor config and its visualization.
It first orients itself -45°, so 45° counter-clockwise.
Then it shift "one to the right", but since its orientation is now -45°, "right" means along the diagonal line.
Once it gets there (at [&radic;2/2, &radic;2/2], on the unit circle), it finally rotates another -135°, which (when added to its existing rotation) results is -180°, so it's looking "left".

<Tabs>
<TabItem value="config" label="Config" default>

```yaml
anchor:
  orient: -45
  shift: [1, 0]
  rotate: -135
```

</TabItem>
<TabItem value="visualization" label="Visualization">

![Anchor basic example](./assets/anchor_basic.png)

</TabItem>
</Tabs>

</p>
</details>



## Zones

### Layout basics

### Inheritance

### Columns

### Rows

### Keys

## Rotation

## Mirroring























What makes this generator "ergo" is the implicit focus on the column-stagger.
And since we're focusing on column-stagger, keys are laid out in columns, and a collection of columns is called a "zone".
For example, we can define multiple, independent zones to make it easy to differentiate between the keywell and the thumb fan/cluster.

Points can be described as follows:

```yaml
points:
    zones:
        my_zone_name: # A unique key for each zone which will be used to refer to it
            anchor: # Optional - Anchor to position the zone 
                ref: <point reference> # Optional - Reference to another point to anchor to
                orient: <num> # default = 0
                shift: [x, y] # default = [0, 0]
                rotate: <num> # default = 0
                affect: <string> # default = xyr - Specifies which axis are affected by this anchor 
            columns: 
              column_name:
                stagger: <num> # default = 0
                spread: <num> # default = 19
                rotate: <num> # default = 0
                origin: [x, y] # relative to center of column's first key, default = [0, 0]
                rows:
                  row_name: <key-specific key def> # Optional - Key properties set here apply to this colrow intersection 
                key: <column-level key def> # Optional - Key properties set here apply to the whole column
              second_column: <column def>
            rows:
                row_name: <row-level key def> # Optional - Key properties set here affect the whole row
            key: <zone-level key def> # Optional - Key properties set here affect the whole zone
        another_zone:
          [...]
    key: # Optional - Key properties set here affect all zones
```

## `zones`

We start with a `zones` clause, under which we can define the individual, named zones.

### `anchor`
Anchors are used to anchor and shift zones around an origin 
#### `ref`
An anchor has `[0, 0]` origin with a 0 degree orientation by default, but it can be changed to any other pre-existing point using `ref`. *(Consequently, the first zone can't use a ref, because there isn't any yet.)*  

The `ref` field can also be an array of references, in which case their average is used -- mostly useful for anchoring to the center, by averaging a key and its mirror; see later.
This initial position can then be changed with the `orient`, `shift`, and `rotate` options.
`shift` adds extra translation, while the difference between `orient` and `rotate` is whether they add their rotation before or after the translation.

:::note
Anywhere an anchor can be specified, a list of anchors is also valid.
It would be meaningless, though, if each subsequent anchor would override the previous one, so the `affect` clause helps to affect only certain dimensions of the anchor.
It can be declared using a string containing any of `x`, `y`, or `r`, which stand for the x and y coordinates and the rotation of the anchor, respectively.
:::

### `columns`

Once we know _where_ to start, we can describe the `columns` of our layout.

```yaml
columns:
    column_name:
      stagger: num # default = 0
      spread: num # default = 19
      rotate: num # default = 0
      origin: [x, y] # relative to center of column's first key, default = [0, 0]
      rows:
        row_name: <key-specific key def>
        ...
      key: <column-level key def>
    ...
```

#### `stagger`
`stagger` means an extra vertical shift to the starting point of the whole column compared to the previous one (initially 0, cumulative afterwards).
The layout of the column then proceeds according to the appropriate key declarations (more on this in a minute).

#### `spread`
Once the column has been laid out, `spread` (the horizontal space between this column and the next) is applied, and an optional (cumulative) rotation is added around the `origin` if `rotate` is specified.
We repeat this until the end of the column definitions, then move on to the next zone.

<hr />

Regarding lower level layout, rows appear both in zones and columns, and keys can be defined in five (!) different places. So what gives?
Don't worry, all this is there just so that we can keep repetition to a minimum.
We could safely remove the `rows` and `key` options from zones, and the `key` option from column definitions, without losing any of the functionality.
But we'd have to repeat ourselves a lot more.

### `rows`
Let's start with rows.
`zone.rows` can give an overall picture about how many rows we'll have, and set key-related options on a per-row basis.
But what if we want to extend this initial picture with some column-specific details? (More on "extension" in a bit.)
For example, we want an outer pinky column where padding is tighter than it is for the others.
That's where `column.rows` can help, specifying a row "extension" for just that column.

And what if we want to **override** the zone-level declarations in a certain column?
For example, we don't just want to modify a row's attributes for a given column, but actually override the amount of rows there are.
Like an outer pinky column with just two keys instead of the regular three.
That's where `column.row_overrides` can help, specifying a row-level override that disregards the zone-level defaults.
Easy.

### `keys`

Now for the trickier part: keys.
There are five ways to set key-related options (again, to minimize the need for repetition):

1. at the global-level (affecting all zones)
2. at the zone-level
3. at the column-level
4. at the row-level
5. at the key-level

These "extend" each other in this order so by the time we reach a specific key, every level had an opportunity to modify something.

:::info
Note that unlike the overriding for rows, key-related extension is additive.
:::

For example, let's suppose that a key-related attribute is already defined at the column-level.
When we later encounter a key-level extension for this key that specifies a few things but not this exact key, its value will stay the same instead of disappearing.


When there is a "collision", simple values (like booleans, numbers, or strings) replace the old ones, while composites (arrays or objects) apply this same extension recursively, element-wise.
So when `key = 1` is extended by `key = 2`, the result is `key = 2`.
But if `key = {a: 1}` is extended by `key = {b: 2}`, the result is `key = {a: 1, b: 2}`.

Lastly, while there are a few key-specific attributes that have special meaning in the context of points (listed below), any key with any data can be specified here.
This can be useful for storing arbitrary meta-info about the keys, or just configuring later stages with key-level parameters.
So, for example, when the outline phase specifies `bind` as a key-level parameter (see below), it means that it can be specified just like any other key-level attribute.

Now for the "official" key-level attributes:

```yaml
name: name_override # default = a concatenation of zone, column, and row
shift: [x, y] # default = [0, 0]
rotate: num # default = 0
padding: num # default = 19
skip: boolean # default = false
asym: left | right | both # default = both
mirror: <arbitrary key-level data>
```

`name` is the unique identifier of this specific key.
It defaults to a `<row>_<column>` format, but can be overridden if necessary.
`shift` and `rotate` declare an extra, key-level translation or rotation, respectively.
Then we leave `padding` amount of vertical space before moving on to the next key in the column.
`skip` signals that the point is just a "helper" and should not be included in the output.
This can happen when a _real_ point is more easily calculable through a "stepping stone", but then we don't actually want the stepping stone to be a key itself.
Finally, `asym` and `mirror` relate to mirroring, which we'll cover in a second.

<hr />

Since `zones` was only a single key within the `points` section, it's reasonable to expect something more.
Indeed:

```yaml
points:
    zones: <what we talked about so far...>
    key: <global key def>
    rotate: num # default = 0
    mirror:
        axis: num # default = 0
        ref: <point reference> # and other anchor-level settings
        distance: num # default = 0
```

Here, `rotate` can apply a global angle to all the points, which can simulate the inter-half angle of one-piece boards.

## `mirror`
Then comes the mirroring step, where the generator automatically copies and mirrors each point.
If there's an `axis` set within the `mirror` key, points will be mirrored according to that.
If not, the axis will be calculated so that there will be exactly `distance` mms between the `ref`erenced point and its duplicate.

Now if our design is symmetric, we're done.
Otherwise, we need to use the `asym` key-level attribute to indicate which side the key should appear on.
If it's set as `left`, mirroring will simply skip this key.
If it's `right`, mirroring will "move" the point instead of copying it.
The default `both` assumes symmetry.

Using the _key-level_ `mirror` key (not to be confused with the global `mirror` setting we just discussed above), we can set additional data for the mirrored version of the key.
It will use the same extension mechanism as it did for the 5 levels before.

And this concludes point definitions.
This should be generic enough to describe any ergo layout, yet easy enough so that you'll appreciate not having to work in raw CAD.