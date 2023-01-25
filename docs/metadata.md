---
sidebar_position: 3
---

# Metadata

The `meta` top level key can contain arbitrary metadata documenting the keyboard in question.
The only fields Ergogen interprets and uses from it are:

- **`engine`**: A [semver](https://semver.org/) declaration in the usual form `[major].[minor].[patch]` (so, e.g., `3.1.4`), stating which Ergogen version the config is supposed to work with. The semver check is then performed for *compatibility*, not exact equality, so and `engine` value of `3.1.4` means "at least `3.1.4`, up to (and excluding) `4.0.0`". It is possible that you config would work even on an older or newer engine, but Ergogen will give you an error until you update either your config proper or the `engine` field to match the current environment.

- **`version`**: Not to be confused with `engine`, `version` is just a piece of string metadata Ergogen embeds in the KiCAD PCBs it generates.

- **`author`**: Same as `version`, only for the author field of the KiCAD PCB metadata.

Otherwise, feel free to dump anything here from e-mail addresses and GitHub links to your Nan's favorite pie recipe. Ergogen won't complain - only it won't use those fields either.