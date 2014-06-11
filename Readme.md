# retext-smartypants [![Build Status](https://travis-ci.org/wooorm/retext-smartypants.svg?branch=master)](https://travis-ci.org/wooorm/retext-smartypants) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-smartypants.svg)](https://coveralls.io/r/wooorm/retext-smartypants?branch=master)

**[retext](https://github.com/wooorm/retext "Retext")** implementation of [smartypants](http://daringfireball.net/projects/smartypants/ "SmartyPants").

## Installation

```sh
$ npm install retext-smartypants
```

## Usage

```js
var Retext = require('retext'),
    smartypants = require('retext-smartypants');

new Retext()
    .use(smartypants()) // Note that `smartypants` is
                        // called (optionally with
                        // options).
    .parse('He said, "A \'simple\' english sentence. . ."')
    .toString(); // 'He said, “A ‘simple’ english sentence…”'
```

## API
### smartypants(options?)

```js
var root = new Retext()
    .use(smartypants({
        'ellipses' : false,
        'dashes' : 'oldschool'
    }))
    .parse('He said---A \'simple\' english sentence. . ."')
    .toString(); // 'He said—A ‘simple’ english sentence. . .'
```

- `options` (`null` or `Object`)
- `options.quotes` (`true` or `false`):
  - When `true`, converts dumb double and single quotes to smart double or single quotes;
  - When `false`, ignores dumb quotes;
- `options.ellipses` (`true` or `false`) - note the plural of `ellipsis`;
  - When `true`, converts triple dot characters (with or without spaces between) into a single unicode ellipsis character;
  - When `false`, ignores dumb ellipses;
- `options.backticks` (`"all"`, `true`, or `false`)
  - When `true`, converts double backticks into an opening double quote, and double dumb single quotes into a closing double quote;
  - When `"all"`, does the preceding, in addition of converting single backticks into an opening single quote, and a dumb single quote into a closing single quote;
  - When `false`, ignores dumb backticks and single quotes (although when `quotes` is true, dumb quotes might be converted to smart quotes anyway).
- `options.dashes` (`"oldschool"`, `"inverted"`, `true`, or `false`)
  - When `true`, converts two dashes into an em-dash character;
  - When `"oldschool"`, converts two dashes into an en-dash, and three dashes into an em-dash;
  - When `"inverted"`, converts two dashes into an em-dash, and three dashes into an en-dash;
  - When `false`, ignores dumb dashes.

All options can be omitted (i.e., `null` or `undefined`) to default to `true`.

## License

  MIT
