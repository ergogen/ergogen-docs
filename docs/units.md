---
sidebar_position: 3
---

# Units

We start with an optional `units` clause, where we can define units to use in relative calculations.  
The three predefined ones are `u`, `cx`, and `cy`.
```yaml
u: 19 # 19mm MX spacing
cx: 18 # 18mm Choc X spacing
cY: 17 # 17mm Choc Y spacing
```

But we can add any other (or modify these predefined ones), or even use an existing measure in calculating a new value (for example, `double: 2 u`).
Recall how each string that can be interpreted as a math formula will be treated like a number, so this is a great way to add math-level variables to your config.

```yaml
units:
  a: cy - 7
  b: a * 1.5
```