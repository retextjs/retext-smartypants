# retext-smartypants [![Build Status](https://img.shields.io/travis/wooorm/retext-smartypants.svg?style=flat)](https://travis-ci.org/wooorm/retext-smartypants) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-smartypants.svg?style=flat)](https://coveralls.io/r/wooorm/retext-smartypants?branch=master)

**[retext](https://github.com/wooorm/retext)** implementation of [smartypants](http://daringfireball.net/projects/smartypants/).

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
$ npm install retext-smartypants
```

[Component.js](https://github.com/componentjs/component):

```bash
$ component install wooorm/retext-smartypants
```

[Bower](http://bower.io/#install-packages):

```bash
$ bower install retext-smartypants
```

## Usage

```javascript
var Retext = require('retext');
var smartypants = require('retext-smartypants');

var retext = new Retext().use(smartypants);

retext.parse(
    'He said, "A \'simple\' english sentence. . ."',
    function (err, tree) {
        console.log(tree.toString());
        /* 'He said, “A ‘simple’ english sentence…”' */
    }
);
```

## API

### smartypants

```javascript
var retext = new Retext().use(smartypants, {
    'ellipses': false,
    'dashes': 'oldschool'
});

retext.parse(
    'He said---A \'simple\' english sentence. . ."',
    function (err, tree) {
        console.log(tree.toString());
        /* 'He said—A ‘simple’ english sentence. . .' */
    }
);
```

Parameters:

All options can be omitted (as in, `null` or `undefined`) to default to `true`.

- `options` (`null` or `Object`)
- `options.quotes` (`true` or `false`):
  - `true`: converts dumb double and single quotes to smart double or single quotes;
  - `false`: ignores dumb quotes;
- `options.ellipses` (`true` or `false`) - note the plural of `ellipsis`;
  - `true`: converts triple dot characters (with or without spaces between) into a single unicode ellipsis character;
  - `false`: ignores dumb ellipses;
- `options.backticks` (`"all"`, `true`, or `false`)
  - `true`: converts double backticks into an opening double quote, and double dumb single quotes into a closing double quote;
  - `"all"`: does the preceding, in addition of converting single backticks into an opening single quote, and a dumb single quote into a closing single quote. **Note!** Quotes can not be `true` when backticks is `"all"` (Otherwise they'd keep arguing on about the direction of some quotes. Nothing good comes from that, only RangeErrors.);
  - `false`: ignores dumb backticks and single quotes (although when `quotes` is true, dumb quotes might be converted to smart quotes anyway).
- `options.dashes` (`"oldschool"`, `"inverted"`, `true`, or `false`)
  - `true`: converts two dashes into an em-dash character;
  - `"oldschool"`: converts two dashes into an en-dash, and three dashes into an em-dash;
  - `"inverted"`: converts two dashes into an em-dash, and three dashes into an en-dash;
  - `false`: ignores dumb dashes.

## Performance

On a MacBook Air, **retext** performs about 15% slower with **retext-smartypants**.

```text
           retext w/o retext-smartypants
  220 op/s » A paragraph (5 sentences, 100 words)
   24 op/s » A section (10 paragraphs, 50 sentences, 1,000 words)

           retext w/ retext-smartypants
  188 op/s » A paragraph (5 sentences, 100 words)
   20 op/s » A section (10 paragraphs, 50 sentences, 1,000 words)
```

## License

MIT © [Titus Wormer](http://wooorm.com)
