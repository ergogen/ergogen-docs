---
sidebar_position: 1
---

# Config overview

The heart of Ergogen is a single YAML config file.
If you prefer JSON over YAML, feel free to use it, conversion is trivial and the generator will detect the input format.
You can even use javascript which, when evaluated in place, produces the config object.
The important thing is that the data you give Ergogen can contain the following keys:

```yaml
meta: <metadata> # optional
units: <units config...> # optional
points: <points config...> # required
outlines: <outline config...> #optional
cases: <case config...> #optional
pcbs: <pcb config...> #optional
```

### [`meta`](./metadata.md)
Provides a place to declare metadata about the board, the author, the required Ergogen version, etc.

### [`units`](./units.md)
Allows users to set additional units (read, variables) which can be used in the rest of the config.

### [`points`](./points.md)
Describes the core of the layout: the positions of the keys.

### [`outlines`](./outlines.md)
Uses the specified `points` to generate plate, case, and PCB outlines.  

### [`cases`](./cases.md)
Details how the case outlines are to be 3D-ized to form a 3D-printable object.  

### [`pcbs`](./pcbs.md)
Used to configure KiCAD PCB templates.


<hr/>

In the following sections we'll have an in-depth look into each of these.
There's also a completely separate [preprocessing](./preprocessing.md) step to help reduce unnecessary repetition.
Of course, if the declarative nature of the config is still not terse enough (despite the preprocessor, the built-in YAML references, and the Ergogen-based inheritance detailed later), there's nothing stopping you from writing code that generates the config.
It brings the game to yet another abstraction level higher, so that you can use branching, loops, and parametric functions to compose a "drier" keyboard definition.