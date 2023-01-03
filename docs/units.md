---
sidebar_position: 3
---

# Units

We start with an optional `units` clause, where we can define units to use in relative calculations.
The four predefined ones are `U`, `u`, `cx`, and `cy`.
```yaml
U: 19.05 # 19.05 MX spacing
u: 19 # 19mm MX spacing
cx: 18 # 18mm Choc X spacing
cy: 17 # 17mm Choc Y spacing
```

But we can add any other (or modify these predefined ones), or even use an existing measure in calculating a new value (for example, `double: 2 u`).
Recall how each string that can be interpreted as a math formula will be treated like a number, so this is a great way to add math-level variables to your config.

For example, the following units may be useful if you expect to only use "1.5u" key-caps:
```yaml
units:
  kx: u + 0.5
  ky: u * 1.5
```

# Variables

Variables are processed identically to units, but allow a user to separate those values that they expect to be changed during development
(for example, stagger of adjacent columns) from those that they expect to stay the same (for example, the size of the keycaps).
```yaml
variables:
  ring_stagger: u * 1/2
  middle_stagger: u * 1/4
  # ...
```

Like with units, you can perform mathematical operations within these variables.
For example:
```yaml
variables:
  # probably a more complicated splay value than required
  pinky_splay: atan(1/3) * 180/pi

  # a very important calculation for thumb key positioning
  a: pi^2
  b: e^pi
  c: (1+sqrt(5))/2
  thumb_x: (-b + sqrt(b^2-4*a*c))/(2*a)
  thumb_y: 1/a + 1/b + 1/c
```

# Internal default values

There are several internal default values that are used when arranging [points](points).
```yaml
    $default_stagger: 0
    $default_spread: u
    $default_splay: 0
    $default_height: u-1
    $default_width: u-1
    $default_padding: u
    $default_autobind: 10
```

:::caution
While these can be modified directly within the `units` or `variables` section;
they can only be reassigned using math involving the predefined units `U`, `u`, `cx`, and `cy`.
Reassigning these defaults using user defined units/variables will not work.
:::

For example, the following is valid (though probably unhelpful):
```yaml
units:
    $default_stagger: u/8
    $default_spread: u*1.1
    $default_splay: 10
    $default_height: u*0.95
    $default_width: u*0.95
    $default_padding: u+3
    $default_autobind: u/4
```
The following is invalid:
```yaml
units:
    kx: u+1
    $default_stagger: kx/8
    $default_spread: kx*1.1
    $default_splay: 10
    $default_height: kx*0.95
    $default_width: kx*0.95
    $default_padding: kx+3
    $default_autobind: kx/4
```

:::tip
Since some of these internal default values are defined in terms of `u`,
even if you aren't directly using `u`, you may find it helpful to redefine it.
:::
