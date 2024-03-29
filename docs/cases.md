---
sidebar_position: 7
---

# Cases

## Overview

TODO -> outline to case illustration

Cases add a pretty basic and minimal 3D aspect to the generation process.
In this phase, we take different outlines (defined in the previous section, even the "private" ones), extrude and position them in space, and combine them into one 3D-printable object.
That's it.
Declarations might look something like the following:

```yaml
cases:
    case_name:
        - what: outline # default option
          name: <outline ref>
          extrude: num # default = 1
          shift: [x, y, z] # default = [0, 0, 0]
          rotate: [ax, ay, az] # default = [0, 0, 0]
          operation: add | subtract | intersect # default = add
        - what: case
          name: <case_ref>
          # extrude makes no sense here...
          shift: # same as above
          rotate: # same as above
          operation: # same as above
        - ...
    ...
```

:::note
Individual case parts can be both arrays or objects, just like with outline parts previously.
Use whichever is more convenient.
:::

When the `what` is `outline`, `name` specifies which outline to import onto the xy plane, while `extrude` specifies how much it should be extruded along the z axis.
When the `what` is `case`, `name` specifies which previously defined case to use.
After having established our base 3D object, it is (relatively!) `rotate`d, `shift`ed, and combined with what we have so far according to `operation`.
If we only want to use an object as a building block for further objects, we can employ the same "start with an underscore" trick we learned at the outlines section to make it "private".

Individual case parts can again be listed as an object instead of an array, if that's more comfortable for inheritance/reuse (just like for outlines).
And speaking of outline similarities, the `[+, -, ~]` plus name shorthand is available again.
First it will try to look up cases, and then outlines by the name given.
Stacking is omitted as it makes no sense here.

## Examples

<details><summary>Simple Extrusion</summary>
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

<details><summary>Unibody Case</summary>
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