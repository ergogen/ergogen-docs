---
sidebar_position: 1
---

# Config overview

The whole Ergogen config is a single YAML file.
If you prefer JSON over YAML, feel free to use it, conversion is trivial and the generator will detect the input format.
The important thing is that the data can contain the following keys:

```yaml
points: <points config...> # required
units: <units config...> # optional
outlines: <outline config...> #optional
cases: <case config...> #optional
pcbs: <pcb config...> #optional
```

### [`units`](units)
Allows users to set additional units which can be used in the rest of your config

### [`points`](points)
Describes the core of the layout: the positions of the keys.

### [`outlines`](outlines)
Uses the specified `points` to generate plate, case, and PCB outlines.  

### [`cases`](cases)
Details how the case outlines are to be 3D-ized to form a 3D-printable object.  

### [`pcbs`](pcbs)
Used to configure KiCAD PCB templates.


<hr/>

In the following sections we'll have an in-depth look into each of these.
There's also a completely separate [preprocessing](preprocessing.md) step to help reduce unnecessary repetition.
Of course, if the declarative nature of the config is still not terse enough (despite the preprocessor, the built-in YAML references, and the Ergogen-based inheritance detailed below), there's nothing stopping you from writing code that generates the config.
It brings the game to yet another abstraction level higher, so that you can use branching, loops, and parametric functions to compose a "drier" keyboard definition.