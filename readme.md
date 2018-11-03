# retext-smartypants [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

[smartypants][] in [**retext**][retext].

## Installation

[npm][]:

```bash
npm install retext-smartypants
```

## Usage

```javascript
var retext = require('retext')
var smartypants = require('retext-smartypants')

var file = retext()
  .use(smartypants)
  .processSync('He said, "A \'simple\' english sentence. . ."')

console.log(String(file))
```

Yields:

```text
He said, “A ‘simple’ english sentence…”
```

## API

### `retext().use(smartypants[, options])`

Replaces dumb/straight/typewriter punctuation marks with smart punctuation
marks.

##### `options`

###### `options.quotes`

Create smart quotes (`boolean`, default: `true`).

Converts straight double and single quotes to smart double or single quotes.

###### `options.ellipses`

Create smart ellipses (`boolean`, default: `true`).

Converts triple dot characters (with or without spaces between) into a single
unicode ellipsis character

###### `options.backticks`

Create smart quotes from backticks (`boolean` or `'all'`, default: `true`).

When `true`, converts double back-ticks into an opening double quote, and
double straight single quotes into a closing double quote.

When `'all'`: does the preceding and converts single back-ticks into an
opening single quote, and a straight single quote into a closing single
smart quote.

> **Note**: Quotes can not be `true` when `backticks` is `'all'`;

###### `options.dashes`

Create smart dashes (`boolean` or `'oldschool'`, `'inverted'`, default: `true`).

When `true`, converts two dashes into an em-dash character.

When `'oldschool'`, converts two dashes into an en-dash, and three dashes into
an em-dash.

When `'inverted'`, converts two dashes into an em-dash, and three dashes into
an en-dash.

## Contribute

See [`contributing.md` in `retextjs/retext`][contribute] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/retextjs/retext-smartypants.svg

[travis]: https://travis-ci.org/retextjs/retext-smartypants

[codecov-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-smartypants.svg

[codecov]: https://codecov.io/github/retextjs/retext-smartypants

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[smartypants]: http://daringfireball.net/projects/smartypants

[contribute]: https://github.com/retextjs/retext/blob/master/contributing.md

[coc]: https://github.com/retextjs/retext/blob/master/code-of-conduct.md
