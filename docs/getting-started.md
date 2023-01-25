---
id: 'getting-started'
sidebar_label: 'Getting started'
sidebar_position: 0
slug: /
---

# Getting Started

Until there's a proper "Getting started" guide, try getting acquainted with Ergogen by following these steps in order:

1. Read the [docs](https://docs.ergogen.xyz). D'uuh. They're not complete by any measure, but should give you a fairly good idea what you're dealing with here.

1. Try one of the web-based deployments ([official](https://ergogen.xyz); [unofficial](https://ergogen.cache.works/) but probably better and soon to be official) - no need to download the CLI unless you want to A) preview in-development features, B) use custom modifications, or C) contribute code. Click things, look at outputs; see if things start to make sense.

1. Search the [`#ergogen`](https://github.com/topics/ergogen) topic on GitHub to look at (and reverse engineer) a variety of real life configs using ergogen. Pop them into the web UI, see what they do, tinker with them; things should start to make more and more sense.

1. If a question persists after all of the above, feel free to ask it over on [Discord](http://discord.ergogen.xyz) and we'll do our best to help you out.

## Command line usage

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

## Development usage

If you want to sneak a peek of the features being developed on the cutting edge, or would like to contribute stuff, you can clone the repo locally by:

```shell
git clone https://github.com/ergogen/ergogen.git
cd ergogen
npm install
```

To use this local copy, you would call `node src/cli.js` instead of the global `ergogen` command.
So the above example would change to:

```
node src/cli.js input.yaml -o output_folder
```
