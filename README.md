# StringFormat
## Description
This module provides a simple function that can be used to format strings,
using replacements such as {0}, {foo}, etc.

## Features
* Node/browser compatible.
* Order-independent replacements, so that format strings can be localized.
    * Example: `Hello {firstname} {lastname}` in English, `こんにちは、{lastname}{firstname}さん` in Japanese.
* Can pass one or several objects, and use property names instead of numbers.
* Support modifiers to output values as integers or JSON.
* Opt-in `String.prototype` extension (using `extendString()`)

## API
### format(*format string*, *parameters*...)
Returns a new string formatted according to *format string*.

#### Example usage:
```js
var $ = require('stringformat')
console.log($.format("Hello, {0}!", "World"))
```

…would output `Hello, World!` to the console.

### extendString([*methodName*])
Installs the module as `String.prototype.methodName`.
If omitted, *methodName* defaults to **format**.

#### Example usage:
```js
var $ = require('stringformat')

$.extendString('coolFormat')
console.log("Hello, {0}!".coolFormat("World"))
```

…would output `Hello, World!` to the console.

## Format strings syntax
### Basic replacements
The most simple replacements look like `{0}`, `{1}` and so on.
The number is the index of the parameter.

**Example:** `"Hello, {1}! I feed {0} today!".format("great", "World")`
**Result:** `Hello, World! I feed great today!`

You can also use functions:
**Example:** `"Hello, {1}! I feed {0} today!".format("great", function() { return "World" })`
**Result:** `Hello, World! I feed great today!`

**Example:** `var x = 0; "{0} {0} {0}…".format(function() { return ++x })`
**Result:** `1 2 3…`

If a replacement cannot be resolved, the method does nothing:

**Example:** `"Hello, {1}! I feed {0} today!".format("great")`
**Result:** `Hello, {1}! I feed great today!`

### Padding
If you can to pad the result, for instance to print a list of values, you can do it like this:

**Example:** `"User name: [{0:20}]".format("Bob Harris")`
**Result:** `User name: [          Bob Harris]`

…this gives you a replaced content that is at least 20 characters wide.
Positive integers mean the value will get right-aligned. To align it to the left, use a negative value:

**Example:** `"User name: [{0:-20}]".format("Bob Harris")`
**Result:** `User name: [Bob Harris          ]`

### The JSON modifier
If you want to output a JSON version of the value, you can use it with the **j** modifier.
Compare the output above with the one below:

**Example:** `"User name: {0:j}".format("Bob Harris")`
**Result:** `User name: "Bob Harris"`

Of course you can use objects slightly more complex than a string:

**Example:** `"User name: {0:j}".format({foo:{bar:1}})`
**Result:** `User name: {"foo":{"bar":1}}`

…or even a function:

**Example:** `"User name: {0:j}".format(function() { return {foo:{bar:1}} })`
**Result:** `User name: {"foo":{"bar":1}}`

### The integer modifier
If you want to output integer values only, use the **i** modifier.
Floating values will get rounded, and values that are not numbers will output `NaN`.

**Example:** `"value = {0:i}".format(12.5)`
**Result:** `value = 13`

**Example:** `"[value:{0:4i}]".format(12.5)`
**Result:** `[value:  13]`

**Example:** `"[value:{0:4i}]".format("foo")`
**Result:** `[value: NaN]`

**Example:** `"[value:{0:4i}]".format()`
**Result:** `[value: NaN]`

**Example:** `"[value:{0:4i}]".format(function() { var undef; return undef })`
**Result:** `[value: NaN]`

As an exception to the rule mentioned above,
> If a replacement cannot be resolved, the method does nothing
…if the integer modifier is specified, unresolved replacements will result in a `NaN`
being outputted.

### Named properties
You can also use names instead of indexes.

**Example:** `"[{foo:-4i}]".format({foo:1})`
**Result:** `[1   ]`

**Example:** `"[{foo.bar:-4i}]".format({foo:{bar:1}})`
**Result:** `[1   ]`

**Example:** `"The string {0:j} is {length}-character long".format("Hello, World!")`
**Result:** `The string "Hello, World!" is 13-character long`

**Example:**
```js
var Foo = function() {
	this.foo = 1
}
"[{foo:-4i}]".format(new Foo)
```
**Result:** `[1   ]`

**Example:**
```js
var Foo = function() {
	this.foo = 1
}
Foo.prototype.bar = function() { return this.foo + 1 }
"[{bar:-4i}]".format(new Foo)
```
**Result:** `[2   ]`

If you specify a property as `foo.bar.baz` and `baz` is a function,
`this` will be equal to `foo.bar` when it gets called.

### Accessing properties from multiple objects
Each replacement can be prefixed with an object index followed by a pipe symbol.

**Example:** `"[{0|foo.bar:4}] [{1|foo.bar:4}]".format({foo:{bar:4}}, {foo:{bar:8}})`
**Result:** `[   4] [   8]`

### Escaping
Replacement specifiers can be escaped by doubling the opening and closing braces:

**Example:** `"{{0}} is [{0}]".format(1)`
**Result:** `{0} is [1]`

## License
(The MIT License)

Copyright (c) 2012 Julien Cayzac <julien.cayzac@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
