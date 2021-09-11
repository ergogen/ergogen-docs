---
id: 'getting-started'
sidebar_label: 'Getting started'
sidebar_position: 0
slug: /
---

# Getting Started

You can use ergogen either on the command line, or through the [web UI](https://zealot.hu/ergogen/).

## Command line usage
:::info
Requires node v14.4.0+ with npm v6.14.5+ to be installed.
:::

Clone the repository and run `npm install` to install the dependencies 
```shell
git clone https://github.com/mrzealot/ergogen.git
cd ergogen
npm install
```


You can then use ergogen with any config file 

```
node src/cli.js demo.yaml -o demo/output
```

