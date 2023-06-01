---
sidebar_position: 6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Outlines

## Overview

TODO points -> outlines illustration

Once the raw points are available, we often want to turn them into solid, continuous outlines.
We do this by selecting an arbitrary subset of points and placing shapes there to form a part, and then use boolean operations (i.e., addition, subtraction, or intersection) to combine parts into a final outline to export.
We'll get back to how an individual part looks soon &ndash; but first, we need to get familiar with binding and filtering.




## Binding

While the points are enough to place properly positioned and rotated shapes (most commonly, rectangles, representing the keys of the board), these usually won't combine into a contiguous shape since there won't be any overlap.
So the first part of outline generation is thinking about "binding", where we can make the individual switch holes reach out towards (or, _bind_ to) each other.
Think of this as a kind of "neighbor declaration", telling Ergogen which directions to grow towards (and by how much) to reach the next-door point.

Of course, overlap could be achieved by placing larger shapes at each of the points, causing them to overlap by default, but since everything is placed by its center point, these larger shapes would result in larger outside margins as well.
With bind, we can declare the selective directions in which to grow the shapes placed, so that their final combination can become contiguous, yet with as little (or as much) margin as we might want.

### Explicit

The fully customizable way to add binding to points is through the key-level attribute `bind`:

```yaml
bind: num | [num_x, num_y] | [num_t, num_r, num_b, num_l] # defer to autobind by default
```

To recap, key-level declaration means that `bind` should be specified in the `points` section, benefiting from the same extension process every key-level attribute does.
Valid values follow CSS standards, so `num` applies to all directions, `num_x` horizontally, `num_y` vertically, and the `t`/`r`/`b`/`l` versions to top/right/bottom/left, respectively.

:::tip
Don't recall seeing `bind` in the [Keys](./points.md#keys) section, where supposedly all key-level attributes were listed?
That's because those were only the ones with meaning to the layout system.
Apart from those, *anything* can be declared as a key-level attribute, and some might gain meaning in later stages, like `bind` did just now.
:::

### Automatic

To spare us the `bind` declaration whenever possible, Ergogen offers an `autobind` key-level attribute as well.
Its value is a single number (`10` by default), and the relevant directions are calculated automatically (by looking at intra- and inter-column bounding boxes).
Basically, if we want bound shapes, we only need to say so (by setting `bound: true`, see [below](#common-attributes)) in most cases &ndash; or specify a larger `autobind` value once if `10` wasn't enough to bridge the gaps.
And if autobinding fails for a more complex shape, we can always fall back to explicit `bind` declarations.

### Examples

- explicit bind and how it's smaller than just placing larger tiles
- autobind explanation/illustration



## Filtering

Filtering is how Ergogen decides which points to use when placing the shape we're currently placing.
After all, the points section might contain lots of zones, multiple *kinds* of points, helpers for mounting holes or one-off PCB footprints, etc.
So being able to easily select a subset of these points can come in handy.

### Basics

First up, let's see what a filter means depending on what datatype we use when declaring it:

- **`undefined`**: if left empty, a filter produces the default `[0, 0, 0°]` origin point.

- **boolean**: if the filter is `true`, all points are used; if it's `false`, no points are used.

- **string**: represents a single/simple filter &ndash; the workings of which we'll discuss in a second.

- **object**, or **array that contains an object** somewhere: will be parsed as an [anchor](./points.md#anchors), returning the single resulting point.

  :::note
  Although there can be valid anchor declarations that are neither objects, nor arrays containing an object at any depth, these are not supported where filters are expected because Ergogen would have no way to decide what it's looking at.
  Remember, however, that every anchor **can** be represented in full object form &ndash; any other representation is just a shorthand for convenience.
  :::

- **array containing no objects** at any depth: complex filter, see [Advanced usage](#advanced-usage).

So the undefined and boolean cases are easy, objects just redirect to anchors, and arrays are more advanced.
What about strings, then?

At their simplest, strings just compare the given value against the name of each key and check for straight equality.
Since names are unique, this makes it easy to single out a point, but not more. How do we get "real" subsets?

Enter the `tags` key-level attribute.
It can be either an array (containing string tags, or "labels" that should apply to the given point), or an object (in which case the keys from its key/value pairs count).
Arrays are probably more readable, while objects might be more easily extendable via inheritance or preprocessing.
Use whichever form makes sense.

:::tip
`tags` is yet another key-level attribute that gains meaning during outlining only, like `bind` did above.
:::

By default, string filters consider not only the name of each key but their tags, too.
And combining their basic exact matching behavior with a non-unique field leads to easy subset selection. Yay!

But wait, there's more!
If the string is surrounded by `/`s (slashes), it's interpreted as a regex, and exact matching changes to pattern matching.
So we might not even *need* tags for, say, differentiating zones because we know that key names by default are formatted as `zone_column_row` so we can just say something like `/^matrix_.*/` to filter any key whose name starts with the substring `matrix_`.
The usual regex flags are also supported if specified after the trailing slash, so feel free to use case-insensitive, multiline, or even unicode expressions should the need arise.

Finally, if it would be easier to select what we **don't** want instead of what we **do** want, filters support negation if prefixed by a `-` (minus).
So while saying `matrix_pinky_home` select only that one key, `-matrix_pinky_home` selects everything *except* that key.
This also works with both tags and regexes, of course, so `-alpha` selects everything that isn't tagged with `alpha` (assuming the existence of an alpha tag), and `-/pinky/` selects keys where the "pinky" substring *isn't* found anywhere within the name or any of its tags.



### Advanced usage

Every single filter actually consists of three components:

1. **which** key-level attributes to check against,
2. **how** to check against them, and
3. **what** value to check against them.

So far, we've only used the third component, as the **which** part was always the default `name` and `tags`, while the **how** part was interpreted as the special "similarity" operator, handling both exact matches and regexes.
But what if we want to check against some other key-level attribute; or check in a different way?

Enter full form filters.
In the background, writing `something` gets translated as `meta.name,meta.tags ~ something`, where `meta` is each key's metadata containing all key-level attributes (see [Keys](./points.md#keys)) and `~` is the similarity operator.

arrays

### Examples

- tag
- regex
- negated regex
- full form against other metadata
- combination



## Parts

With this, we can finally move on to the outlines themselves.
The relevant section in the config will look something like this:

<Tabs>
<TabItem value="array" label="Array notation" default>

```yaml
outlines:
  <outline_name>:
    - <part>
    - <part>
    - ...
  ...
```

</TabItem>
<TabItem value="object" label="Object notation">

```yaml
outlines:
  <outline_name>:
    part1: <part>
    part2: <part>
    ...
  ...
```

</TabItem>
</Tabs>

:::note
Listing parts within an outline can be an object as well as an array (see "Object notation" tab).
Objects might be beneficial if part names are important for config readability (or when YAML or built-in inheritance is used), while arrays are a bit more terse.
Use whichever form makes more sense.
:::

Now let's see how those `<part>`s are made.



### Common attributes

what
where
operation
bound
asym
adjust
fillet
expand
joints
scale

Operations are performed in order, and the resulting shape is exported as an output.
Additionally, it is going to be available for further export declarations to use (through the `outline` type) under the name specified (`my_name`, in this case).




### Shapes

rect/circle/poly/outline
shape-specific units

- `keys` : the combined outline that we've just created. Its parameters include:
    - `side: left | right | middle | both | glue` : the part we want to use
        - `left` and `right` are just the appropriate side of the laid out keys, without the glue.
        - `middle` means an "ideal" version of the glue (meaning that instead of the `outline.glue` we defined above, we get `both` - `left` - `right`, so the _exact_ middle piece we would have needed to glue everything together
        - `both` means both sides, held together by the glue
        - `glue` is just the raw glue shape we defined above under `outline.glue`
    - `tag: <array of tags>` : optional tags to filter which points to consider in this step, where tags can be specified as key-level attributes.
    - `glue: <glue_name>` : the name of the glue to use, if applicable
    - `size: num | [num_x, num_y]` : the width/height of the rectangles to lay onto the points. Note that these values are added to the evaluation context as the variables `sx` and `sy`. So during a `keys` layout with a size of 18, for example, a relative shift of `[.5 sx, .5 sy]` actually means `[9, 9]` in mms.
    - `corner: num # default = 0)` : corner radius of the rectangles
    - `bevel: num # default = 0)` : corner bevel of the rectangles, can be combined with rounding
    - `bound: boolean # default = true` : whether to use the binding declared previously
- `rectangle` : an independent rectangle primitive. Parameters:
    - `ref`, `rotate`, and `shift`, etc. (the usual anchor settings)
    - `size`, `corner` and `bevel`, just like for `keys`
- `circle` : an independent circle primitive. Parameters:
    - `ref`, `rotate`, and `shift`, etc. (the usual anchor settings)
    - `radius: num` : the radius of the circle
- `polygon` : an independent polygon primitive. Parameters:
    - `points: [<anchor>, ...]` : the points of the polygon. Each `<anchor>` can have its own `ref`, `shift`, etc. (all of which are still the same as above). The only difference here is that if a `ref` is unspecified, the previous point will be assumed (as in a continuous chain). For the first, it's `[0, 0]` by default.
- `outline` : a previously defined outline, see below.
    - `name: outline_name` : the name of the referenced outline







### Syntactic sugar

string shorthand
expand shorthand
"private" outlines

If we only want to use it as a building block for further exports, we can start the name with an underscore (e.g., `_my_name`) to prevent it from being actually exported.
(By convention, a starting underscore is kind of like a "private" marker.)

A shorthand version of a part can be given when the elements of the above arrays/objects are simple strings instead of further objects.
The syntax is a symbol from `[+, -, ~, ^]`, followed by a name, and is equivalent to adding/subtracting/intersecting/stacking an outline of that name, respectively.
More specifically, `~something` is equivalent to:

```yaml
type: outline
name: something
operation: intersect
```








### Examples





















```yaml
what:
where:
operation:


```











