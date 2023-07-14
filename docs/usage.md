---
sidebar_position: 10
---

# Usage

## Web

TODO

## CLI

### For end users

:::info
Requires node v14.4.0+ with npm v6.14.5+ to be installed.
:::

If command line is more your thing, you can install the latest ergogen release by issuing:

```shell
npm i -g ergogen
```

After this, you will be able to use the `ergogen` command - for example, by specifying an input config and an output folder like so:

```shell
ergogen input.yaml -o output_folder
```

For the full set command line options available, see `ergogen --help`.

### For development

If you want to sneak a peek of the features being developed on the cutting edge, or would like to contribute stuff, you can clone the repo locally by:

```shell
git clone https://github.com/ergogen/ergogen.git
cd ergogen
npm install
```

To use this local copy, you would call `node src/cli.js` instead of the global `ergogen` command.
So the above example would change to:

```shell
node src/cli.js input.yaml -o output_folder
```
