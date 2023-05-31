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

While the points are enough to create properly positioned and rotated rectangles (with parametric side lengths), they usually won't combine into a contiguous shape since there won't be any overlap.
So the first part of the outline generation is "binding", where we make the individual switch holes _bind_ to each other.


### Explicit

We use a key-level declarations for this:

```yaml
bind: num | [num_x, num_y] | [num_t, num_r, num_b, num_l] # default = 0
```

Again, key-level declaration means that both of these should be specified in the `points` section, benefiting from the same extension process every key-level setting does.
This field declares how much we want to bind in each direction, i.e., the amount of overlap we want to make sure that we can reach the neighbor (`num` applies to all directions, `num_x` horizontally, `num_y` vertically, and the t/r/b/l versions to top/right/bottom/left, respectively).
Note that it might make sense to have negative `bind` values, in case we not only don't want to bind in the given direction, but also don't want to "cover up" a potential corner rounding or bevel (see below).

### Automatic

### Examples



## Filtering

### Basic

### Advanced

### Examples




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











