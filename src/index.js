'use strict'

/* eslint-env browser */

var unified = require('unified')
var english = require('retext-english')
var stringify = require('retext-stringify')
var smartypants = require('retext-smartypants')

var $areas = document.querySelectorAll('textarea')
var $form = document.querySelector('form')
var $quotes = document.getElementsByName('quotes')[0]
var $ellipses = document.getElementsByName('ellipses')[0]
var $dashes = document.getElementsByName('dashes')[0]
var $backticks = document.getElementsByName('backticks')[0]

var $input = $areas[0]
var $output = $areas[1]

var processor
var state = {options: {}}

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

function oncheckboxchange(event) {
  state.options[event.target.name] = event.target.checked
}

function onselectchange(event) {
  var value = event.target.selectedOptions[0]

  if (!value) {
    return
  }

  value = value.value

  if (value === 'true') {
    value = true
  } else if (value === 'false') {
    value = false
  }

  state.options[event.target.name] = value
}

function onbacktickschange() {
  if (state.options.backticks === 'all' && state.options.quotes) {
    $quotes.checked = false
    state.options.quotes = false
  }
}

function onquoteschange() {
  if (state.options.backticks === 'all' && state.options.quotes) {
    $backticks.selectedIndex = 1
    state.options.backticks = true
  }
}

function onsubmit(ev) {
  ev.preventDefault()
  onanyoptionchange()
}

function onanyoptionchange() {
  processor = unified()
    .use(english)
    .use(smartypants, state.options)
    .use(stringify)

  smarten()
}

function smarten() {
  $output.value = processor.processSync($input.value).toString()
}
