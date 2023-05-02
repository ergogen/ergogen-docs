---
sidebar_position: 4
---

# Units

In the optional `units` clause, we can define units to use in relative calculations.
The alias `variables` also works the same way.
The four predefined ones are `U`, `u`, `cx`, and `cy`.

```yaml
U: 19.05 # 19.05mm MX spacing
u: 19 # 19mm MX spacing
cx: 18 # 18mm Choc X spacing
cy: 17 # 17mm Choc Y spacing
```

But we can add any other (or modify these predefined ones), or even use an existing measure in calculating a new value (for example, `double: 2 u`).
Recall how each string that can be interpreted as a math formula will be treated like a number, so this is a great way to add math-level variables to your config.

```yaml
units:
  a: cy - 7
  b: a * 1.5
```

In fact, there are also a few internal variables that rely on previous units and formulas to provide easily overrideable default values to certain key-level attributes (for further explanation, see the [points section](./points.md)):

```yaml
$default_stagger: 0,
$default_spread: 'u',
$default_splay: 0,
$default_height: 'u-1',
$default_width: 'u-1',
$default_padding: 'u',
$default_autobind: 10
```