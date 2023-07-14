---
sidebar_position: 8
---

# PCBs

TODO -> PCB illustration

Everything should be ready for a handwire, but if you'd like the design to be more accessible to, and easily replicable by others, you might want to design a PCB as well.
To help you get started, the necessary footprints and an edge cut can be automatically positioned so that all you need to do manually is the routing.

Footprints can be specified at the key-level (under the `points` section, like we discussed above), or here with manually given anchors.
The differences between the two footprint types are:

- an omitted `ref` in the anchor means the current key for key-level declarations, while here it defaults to `[0, 0]`
- a parameter starting with an equal sign `=` is an indirect reference to an eponymous key-level attribute -- so, for example, `{from: =column_net}` would mean that the key's `column_net` attribute is read there.

Additionally, the edge cut of the PCB (or other decorative outlines for the silkscreen maybe) can be specified using a previously defined outline name under the `outlines` key.

```yaml
pcbs:
    pcb_name:
        outlines:
            pcb_outline_name:
                outline: <outline reference>
                layer: <kicad layer to export to> # default = Edge.Cuts
            ...
        footprints:
            - type: <footprint type>
              anchor: <anchor declaration>
              nets: <type-specific net params>
              params: <type-specific (non-net) footprint params>
            - ...
    ...
```

Defining both the `outlines` and the `footprints` can be done either as arrays or objects, whichever is more convenient.
The currently supported footprint types can be viewed in [this folder](https://github.com/mrzealot/ergogen/tree/master/src/footprints), where:

- `nets` represents the available PCB nets the footprint should connect to, and
- `params` represents other, non-net parameters to customize the footprint.

These can be specified in the eponymous keys within `pcbs.pcb_name.footprints`.
