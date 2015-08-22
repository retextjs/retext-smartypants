# retext-smartypants [![Build Status](https://img.shields.io/travis/wooorm/retext-smartypants.svg)](https://travis-ci.org/wooorm/retext-smartypants) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/retext-smartypants.svg)](https://codecov.io/github/wooorm/retext-smartypants)

[**retext**](https://github.com/wooorm/retext) implementation of [smartypants](http://daringfireball.net/projects/smartypants/).

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install retext-smartypants
```

**retext-smartypants** is also available for [bower](http://bower.io/#install-packages),
[component](https://github.com/componentjs/component), and
[duo](http://duojs.org/#getting-started), and as an AMD, CommonJS, and globals
module, [uncompressed](retext-smartypants.js) and
[compressed](retext-smartypants.min.js).

## Usage

```js
var retext = require('retext');
var smartypants = require('retext-smartypants');

var doc = retext().use(smartypants).process('He said, "A \'simple\' english sentence. . ."');
```

Yields:

```text
He said, “A ‘simple’ english sentence…”
```

## API

### [retext](https://github.com/wooorm/retext/tree/feature/stable#api).[use](https://github.com/wooorm/retext/tree/feature/stable#retextuseplugin-options)(smartypants\[, options\])

Replaces “dumb” punctuation marks with “smart” punctuation marks.

**Parameters**

*   `smartypants` — This plug-in;

*   `options` (`Object`, optional): Any option can be set to `false` to be
    turned off.

    *   `quotes` (`boolean`, default: `true`)
        — Converts dumb double and single quotes to smart double or single
        quotes;

    *   `ellipses` (`boolean`, default: `true`)
        — Converts triple dot characters (with or without spaces between) into
        a single unicode ellipsis character;

    *   `backticks` (`boolean` or `"all"`, default: `true`)
        — When `true`, converts double back-ticks into an opening double quote,
        and double dumb single quotes into a closing double quote;
        When `"all"`: does the preceding, and converts single back-ticks into an
        opening single quote, and a dumb single quote into a closing single
        quote.

        **Note!** Quotes can not be `true` when `backticks` is `"all"`;

    *   `dashes` (`boolean` or `"oldschool"`, `"inverted"`, default: `true`)
        — When `true`, converts two dashes into an em-dash character;
        When `"oldschool"`, converts two dashes into an en-dash, and three
        dashes into an em-dash; When `"inverted"`, converts two dashes into
        an em-dash, and three dashes into an en-dash.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
