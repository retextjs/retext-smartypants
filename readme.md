# retext-smartypants [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

<!--lint disable heading-increment list-item-spacing-->

[smartypants][] in [**retext**][retext].

## Installation

[npm][npm-install]:

```bash
npm install retext-smartypants
```

**retext-smartypants** is also available as an AMD, CommonJS, and
globals module, [uncompressed and compressed][releases].

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

### `retext().use(smartypants[, options])`

Replaces “dumb” punctuation marks with “smart” punctuation marks.

###### `options`

*   `quotes` (`boolean`, default: `true`)
    — Converts “dumb” double and single quotes to smart double or
    single quotes;
*   `ellipses` (`boolean`, default: `true`)
    — Converts triple dot characters (with or without spaces between)
    into a single unicode ellipsis character;
*   `backticks` (`boolean` or `'all'`, default: `true`)
    — When `true`, converts double back-ticks into an opening double
    quote, and double “dumb” single quotes into a closing double quote;
    When `'all'`: does the preceding, and converts single back-ticks
    into an opening single quote, and a “dumb” single quote into a
    closing single quote.

    **Note!** Quotes can not be `true` when `backticks` is `'all'`;

*   `dashes` (`boolean` or `'oldschool'`, `'inverted'`, default: `true`)
    — When `true`, converts two dashes into an em-dash character;
    When `'oldschool'`, converts two dashes into an en-dash, and three
    dashes into an em-dash; When `'inverted'`, converts two dashes into
    an em-dash, and three dashes into an en-dash.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/retext-smartypants.svg

[travis]: https://travis-ci.org/wooorm/retext-smartypants

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/retext-smartypants.svg

[codecov]: https://codecov.io/github/wooorm/retext-smartypants

[npm-install]: https://docs.npmjs.com/cli/install

[releases]: https://github.com/wooorm/retext-smartypants/releases

[license]: LICENSE

[author]: http://wooorm.com

[retext]: https://github.com/wooorm/retext

[smartypants]: http://daringfireball.net/projects/smartypants
