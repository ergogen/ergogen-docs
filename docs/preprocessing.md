---
sidebar_position: 2
---

# Preprocessing

Ergogen does a separate preprocessor pass on the config before starting to interpret it.
This consists of the following steps:

- **Unnesting**: any object key containing dots (as in, `.`s) will be unnested. This allows the use of the so called "dot notation". For example, `nested.key.definition: value` will turn into `{nested: {key: {definition: value}}}` in the preprocessed config object.


- **Inheritance**: the `$extends` key can be used in any declaration to inherit values from another declaration. Extension happens according to the following rules:
    - if the new value is `undefined`, the old value will be used as a default;
    - if both values are defined (and have the same type), the new one will override the old;
    - if both values have different types, the new value will take precedence;
    - if the new value is `$unset`, the resulting value will be `undefined`, regardless of previous type;
    - for arrays or objects, extension is called for each child element recursively.

  The actual value of the `$extends` key should be the full absolute path of the declaration we wish to inherit from (using the above mentioned, nested "dot notation" if necessary). For example:

    ```yaml
    top:
        parent:
            a: 1
            b: 2
    child:
        $extends: top.parent
        c: 3
    ```

  This declaration will lead to `child` containing all three letter keys: `{a: 1, b: 2, c: 3}`.


- **Parameterization**: allows regex replacements within declarations. Take the following declaration as a starting point:

    ```yaml
    top:
        value: placeholder
        double_value: placeholder * 2
        $params: [placeholder]
        $args: [3]
    ```

  In this case, every occurrence of the value "placeholder" will be replaced with "3", which allows us to define it only once and still use it in multiple places (kind of like a pseudo-variable).


- **Skipping**: the `$skip` key can be used anywhere to, well, skip (or "comment out" entire declarations). It can also be useful when combining inheritance and parameterization. For example:

    ```yaml
    grandparent:
        a: placeholder1
        b: placeholder2
        $params: [placeholder1, placeholder2]
    parent:
        $extends: grandparent
        $args: [value1]
        $skip: true
    child:
        $extends: parent
        $args: [,value2]
    ```

  Here, the grandparent defines two different parameters, but only the child knows both arguments that should be substituted. This would lead to an error at the parent's level, because it has two parameters, and only one argument. But, assuming that this is just an intermediary abstract declaration and we wouldn't want to use it anyway, we can just declare `$skip: true`.

The result of the preprocessor is *almost* just a plain JSON object.
The only semantic difference is how numbers are handled. For example, the value `3 * 2` would lead to a string type in JSON, but since it's a mathematical formula, it can also be interpreted as a number.
Ergogen tries this interpretation for every string value, and if it succeeds, it calculates the results and converts them to JSON numbers.
This syntax also works with variables, which we can use to define units (see below).

Otherwise, we can begin with the actual keyboard-related layout...