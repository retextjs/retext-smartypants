# retext-smartypants

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**retext**][retext] plugin to implement [SmartyPants][].

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install retext-smartypants
```

## Use

```js
import {retext} from 'retext'
import retextSmartypants from 'retext-smartypants'

const file = retext()
  .use(retextSmartypants)
  .processSync('He said, "A \'simple\' english sentence. . ."')

console.log(String(file))
```

Yields:

```txt
He said, “A ‘simple’ english sentence…”
```

## API

This package exports no identifiers.
The default export is `retextSmartypants`.

### `unified().use(retextSmartypants[, options])`

Replaces dumb/straight/typewriter punctuation marks with smart/curly punctuation
marks.

##### `options`

###### `options.quotes`

Create smart quotes (`boolean`, default: `true`).

Converts straight double and single quotes to smart double or single quotes.

###### `options.ellipses`

Create smart ellipses (`boolean`, default: `true`).

Converts triple dot characters (with or without spaces between) into a single
Unicode ellipsis character

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

See [`contributing.md`][contributing] in [`retextjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/retextjs/retext-smartypants/workflows/main/badge.svg

[build]: https://github.com/retextjs/retext-smartypants/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-smartypants.svg

[coverage]: https://codecov.io/github/retextjs/retext-smartypants

[downloads-badge]: https://img.shields.io/npm/dm/retext-smartypants.svg

[downloads]: https://www.npmjs.com/package/retext-smartypants

[size-badge]: https://img.shields.io/bundlephobia/minzip/retext-smartypants.svg

[size]: https://bundlephobia.com/result?p=retext-smartypants

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/retextjs/retext/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/retextjs/.github/blob/HEAD/support.md

[coc]: https://github.com/retextjs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext

[smartypants]: https://daringfireball.net/projects/smartypants
