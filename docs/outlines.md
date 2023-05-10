---
sidebar_position: 6
---

# Outlines

Once the raw points are available, we often want to turn them into solid, continuous outlines.
And while the points are enough to create properly positioned and rotated rectangles (with parametric side lengths), they won't combine since there won't be any overlap.
So the first part of the outline generation is "binding", where we make the individual holes _bind_ to each other.
We use a key-level declarations for this:

```yaml
bind: num | [num_x, num_y] | [num_t, num_r, num_b, num_l] # default = 0
```

Again, key-level declaration means that both of these should be specified in the `points` section, benefiting from the same extension process every key-level setting does.
This field declares how much we want to bind in each direction, i.e., the amount of overlap we want to make sure that we can reach the neighbor (`num` applies to all directions, `num_x` horizontally, `num_y` vertically, and the t/r/b/l versions to top/right/bottom/left, respectively).
Note that it might make sense to have negative `bind` values, in case we not only don't want to bind in the given direction, but also don't want to "cover up" a potential corner rounding or bevel (see below).

If it's a one-piece design, we also need to "glue" the halves together (or we might want to leave some extra space for the controller on the inner side for splits).

...

Note that this outline is still parametric, so that we can specify different width/height values for the rectangles.

Now we can configure what we want to "export" as outlines from this phase, given by the boolean combination of the following primitives:

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

Using these, we define exports as follows:

```yaml
exports:
    my_name:
        - operation: add | subtract | intersect | stack # default = add
          type: <one of the types> # default = outline
          <type-specific params>
        - ...
```

Individual parts can also be specified as an object instead of an array (which could be useful when YAML or built-in inheritance is used), like so:

```yaml
exports:
    my_name:
        first_phase:
            operation: add | subtract | intersect | stack # default = add
            type: <one of the types> # default = outline
            <type-specific params>
        second:
            ...
```

Operations are performed in order, and the resulting shape is exported as an output.
Additionally, it is going to be available for further export declarations to use (through the `outline` type) under the name specified (`my_name`, in this case).
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
