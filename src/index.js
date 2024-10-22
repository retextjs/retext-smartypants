/* eslint-env browser */

/**
 * @import {Root} from 'nlcst'
 * @import {Options} from 'retext-smartypants'
 * @import {Processor} from 'unified'
 */

import {ok as assert} from 'devlop'
import retextEnglish from 'retext-english'
import retextSmartypants from 'retext-smartypants'
import retextStringify from 'retext-stringify'
import {unified} from 'unified'

const $areas = document.querySelectorAll('textarea')
const $form = /** @type {HTMLFormElement} */ (document.querySelector('form'))
const $quotes = /** @type {HTMLInputElement} */ (
  document.getElementsByName('quotes')[0]
)
const $ellipses = /** @type {HTMLInputElement} */ (
  document.getElementsByName('ellipses')[0]
)
const $dashes = /** @type {HTMLSelectElement} */ (
  document.getElementsByName('dashes')[0]
)
const $backticks = /** @type {HTMLSelectElement} */ (
  document.getElementsByName('backticks')[0]
)

const $input = $areas[0]
const $output = $areas[1]

/** @type {Processor<Root, Root, undefined, Root, string> | undefined} */
let processor

/** @type {{options: Options}} */
const state = {options: {}}

$quotes.addEventListener('change', oncheckboxchange)
$ellipses.addEventListener('change', oncheckboxchange)
$dashes.addEventListener('change', onselectchange)
$backticks.addEventListener('change', onselectchange)

$quotes.addEventListener('change', onquoteschange)
$backticks.addEventListener('change', onbacktickschange)

$quotes.addEventListener('change', onanyoptionchange)
$ellipses.addEventListener('change', onanyoptionchange)
$dashes.addEventListener('change', onanyoptionchange)
$backticks.addEventListener('change', onanyoptionchange)

$form.addEventListener('submit', onsubmit)

$input.addEventListener('input', smarten)

oncheckboxchange({target: $quotes})
oncheckboxchange({target: $ellipses})
onselectchange({target: $dashes})
onselectchange({target: $backticks})

onanyoptionchange()

/**
 * @param {{target: EventTarget | null}} event
 * @returns {undefined}
 */
function oncheckboxchange(event) {
  // This is all just because TS doesn’t understand normal code.
  const target = /** @type {HTMLInputElement} */ (event.target)
  const name = target.name
  assert(name === 'ellipses' || name === 'quotes')

  state.options[name] = target.checked
}

/**
 * @param {{target: EventTarget | null}} event
 * @returns {undefined}
 */
function onselectchange(event) {
  // This is all just because TS doesn’t understand normal code.
  const target = /** @type {HTMLSelectElement} */ (event.target)

  const selectedOption = target.selectedOptions[0]

  if (!selectedOption) {
    return
  }

  /** @type {string | boolean} */
  let value = selectedOption.value

  if (value === 'true') {
    value = true
  } else if (value === 'false') {
    value = false
  }

  // @ts-expect-error: TS doesn’t understand normal code.
  state.options[target.name] = value
}

/**
 * @returns {undefined}
 */
function onbacktickschange() {
  if (state.options.backticks === 'all' && state.options.quotes) {
    $quotes.checked = false
    state.options.quotes = false
  }
}

/**
 * @returns {undefined}
 */
function onquoteschange() {
  if (state.options.backticks === 'all' && state.options.quotes) {
    $backticks.selectedIndex = 1
    state.options.backticks = true
  }
}

/**
 * @param {SubmitEvent} event
 * @returns {undefined}
 */
function onsubmit(event) {
  event.preventDefault()
  onanyoptionchange()
}

/**
 * @returns {undefined}
 */
function onanyoptionchange() {
  processor = unified()
    .use(retextEnglish)
    .use(retextSmartypants, state.options)
    .use(retextStringify)

  smarten()
}

/**
 * @returns {undefined}
 */
function smarten() {
  assert(processor)
  $output.value = processor.processSync($input.value).toString()
}
