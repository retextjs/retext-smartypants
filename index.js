/**
 * @author Titus Wormer
 * @copyright 2014 Titus Wormer
 * @license MIT
 * @module retext:smartypants
 * @fileoverview Retext implementation of SmartyPants.
 */

'use strict';

/* eslint-env commonjs */

/* Dependencies. */
var visit = require('unist-util-visit');
var nlcstToString = require('nlcst-to-string');

/* Map of educators. */
var educators = {};

/* Types. */
var PUNCTUATION_NODE = 'PunctuationNode';
var SYMBOL_NODE = 'SymbolNode';
var WORD_NODE = 'WordNode';
var WHITE_SPACE_NODE = 'WhiteSpaceNode';

/* Characters. */
var EXPRESSION_DECADE = /^\d\ds$/;
var FULL_STOPS_THREE = /^\.{3,}$/;
var FULL_STOPS = /^\.+$/;
var THREE_DASHES = '---';
var TWO_DASHES = '--';
var EM_DASH = '—';
var EN_DASH = '–';
var ELLIPSIS = '\u2026';
var TWO_BACKTICKS = '``';
var BACKTICK = '`';
var TWO_SINGLE_QUOTES = '\'\'';
var SINGLE_QUOTE = '\'';
var APOSTROPHE = '\u2019';
var DOUBLE_QUOTE = '"';
var OPENING_DOUBLE_QUOTE = '“';
var CLOSING_DOUBLE_QUOTE = '”';
var OPENING_SINGLE_QUOTE = '‘';
var CLOSING_SINGLE_QUOTE = '’';
var CLOSING_QUOTE_MAP = {};
var OPENING_QUOTE_MAP = {};

OPENING_QUOTE_MAP[DOUBLE_QUOTE] = OPENING_DOUBLE_QUOTE;
CLOSING_QUOTE_MAP[DOUBLE_QUOTE] = CLOSING_DOUBLE_QUOTE;
OPENING_QUOTE_MAP[SINGLE_QUOTE] = OPENING_SINGLE_QUOTE;
CLOSING_QUOTE_MAP[SINGLE_QUOTE] = CLOSING_SINGLE_QUOTE;

/**
 * Transform two dahes into an em-dash.
 *
 * @param {NLCSTPunctuationNode} node - Node to transform.
 */
function dashes(node) {
    if (node.value === TWO_DASHES) {
        node.value = EM_DASH;
    }
}

/**
 * Transform three dahes into an em-dash, and two
 * into an en-dash.
 *
 * @param {NLCSTPunctuationNode} node - Node to transform.
 */
function oldschool(node) {
    if (node.value === THREE_DASHES) {
        node.value = EM_DASH;
    } else if (node.value === TWO_DASHES) {
        node.value = EN_DASH;
    }
}

/**
 * Transform three dahes into an en-dash, and two
 * into an em-dash.
 *
 * @param {NLCSTPunctuationNode} node - Node to transform.
 */
function inverted(node) {
    if (node.value === THREE_DASHES) {
        node.value = EN_DASH;
    } else if (node.value === TWO_DASHES) {
        node.value = EM_DASH;
    }
}

/**
 * Transform double backticks and single quotes into smart
 * quotes.
 *
 * @param {NLCSTPunctuationNode} node - Node to transform.
 */
function backticks(node) {
    if (node.value === TWO_BACKTICKS) {
        node.value = OPENING_DOUBLE_QUOTE;
    } else if (node.value === TWO_SINGLE_QUOTES) {
        node.value = CLOSING_DOUBLE_QUOTE;
    }
}

/**
 * Transform single and double backticks and single quotes
 * into smart quotes.
 *
 * @param {NLCSTPunctuationNode} node - Node to transform.
 */
function all(node) {
    backticks(node);

    if (node.value === BACKTICK) {
        node.value = OPENING_SINGLE_QUOTE;
    } else if (node.value === SINGLE_QUOTE) {
        node.value = CLOSING_SINGLE_QUOTE;
    }
}

/**
 * Transform multiple dots into unicode ellipses.
 *
 * @param {NLCSTPunctuationNode} node - Node to transform.
 * @param {number} index - Position of `node` in `parent`.
 * @param {Node} parent - Parent of `node`.
 */
function ellipses(node, index, parent) {
    var value = node.value;
    var siblings = parent.children;
    var position;
    var nodes;
    var sibling;
    var type;
    var count;
    var queue;

    /* Simple node with three dots and without white-space. */
    if (FULL_STOPS_THREE.test(node.value)) {
        node.value = ELLIPSIS;

        return;
    }

    if (!FULL_STOPS.test(value)) {
        return;
    }

    /* Search for dot-nodes with white-space between. */
    nodes = [];
    position = index;
    count = 1;

    /* It’s possible that the node is merged with an
     * adjacent word-node. In that code, we cannot
     * transform it because there’s no reference to the
     * grandparent. */
    while (--position > 0) {
        sibling = siblings[position];

        if (sibling.type !== WHITE_SPACE_NODE) {
            break;
        }

        queue = sibling;
        sibling = siblings[--position];
        type = sibling && sibling.type;

        if (
            sibling &&
            (type === PUNCTUATION_NODE || type === SYMBOL_NODE) &&
            FULL_STOPS.test(sibling.value)
        ) {
            nodes.push(queue, sibling);

            count++;

            continue;
        }

        break;
    }

    if (count < 3) {
        return;
    }

    siblings.splice(index - nodes.length, nodes.length);

    node.value = ELLIPSIS;
}

/**
 * Transform dumb single- and double quotes into smart
 * quotes.
 *
 * @param {NLCSTPunctuationNode} node - Node to transform.
 * @param {number} index - Position of `node` in `parent`.
 * @param {Node} parent - Parent of `node`.
 */
function quotes(node, index, parent) {
    var siblings = parent.children;
    var value = node.value;
    var next;
    var nextNext;
    var prev;
    var nextValue;

    if (value !== DOUBLE_QUOTE && value !== SINGLE_QUOTE) {
        return;
    }

    prev = siblings[index - 1];
    next = siblings[index + 1];
    nextNext = siblings[index + 2];
    nextValue = next && nlcstToString(next);

    if (
        next &&
        nextNext &&
        (next.type === PUNCTUATION_NODE || next.type === SYMBOL_NODE) &&
        nextNext.type !== WORD_NODE
    ) {
        /* Special case if the very first character is
         * a quote followed by punctuation at a
         * non-word-break. Close the quotes by brute
         * force. */
        node.value = CLOSING_QUOTE_MAP[value];
    } else if (
        nextNext &&
        (
            nextValue === DOUBLE_QUOTE ||
            nextValue === SINGLE_QUOTE
        ) &&
        nextNext.type === WORD_NODE
    ) {
        /* Special case for double sets of quotes:
         *
         *    He said, "'Quoted' words in a larger quote."
         */
        node.value = OPENING_QUOTE_MAP[value];
        next.value = OPENING_QUOTE_MAP[nextValue];
    } else if (
        next &&
        EXPRESSION_DECADE.test(nextValue)
    ) {
        /* Special case for decade abbreviations:
         *
         *   the '80s
         */
        node.value = CLOSING_QUOTE_MAP[value];
    } else if (
        prev &&
        next &&
        (
            prev.type === WHITE_SPACE_NODE ||
            prev.type === PUNCTUATION_NODE ||
            prev.type === SYMBOL_NODE
        ) &&
        next.type === WORD_NODE
    ) {
        /* Get most opening single quotes. */
        node.value = OPENING_QUOTE_MAP[value];
    } else if (
        prev &&
        (
            prev.type !== WHITE_SPACE_NODE &&
            prev.type !== SYMBOL_NODE &&
            prev.type !== PUNCTUATION_NODE
        )
    ) {
        /* Closing quotes */
        node.value = CLOSING_QUOTE_MAP[value];
    } else if (
        !next ||
        next.type === WHITE_SPACE_NODE ||
        (
            (value === SINGLE_QUOTE || value === APOSTROPHE) &&
            nextValue === 's'
        )
    ) {
        node.value = CLOSING_QUOTE_MAP[value];
    } else {
        node.value = OPENING_QUOTE_MAP[value];
    }
}

/* Expose educators. */
educators.dashes = {
    true: dashes,
    oldschool: oldschool,
    inverted: inverted
};

educators.backticks = {
    true: backticks,
    all: all
};

educators.ellipses = {
    true: ellipses
};

educators.quotes = {
    true: quotes
};

/**
 * Create a transformer for the bound methods.
 *
 * @param {Array.<Function>} methods - List of visitors.
 * @return {Function} - Transformer.
 */
function transformFactory(methods) {
    var length = methods.length;

    /**
     * Transformer.
     *
     * @param {NLCSTNode} cst - Syntax tree.
     */
    function transformer(cst) {
        visit(cst, function (node, position, parent) {
            var index;

            if (node.type === PUNCTUATION_NODE || node.type === SYMBOL_NODE) {
                index = -1;

                while (++index < length) {
                    methods[index](node, position, parent);
                }
            }
        })
    }

    return transformer;
}

/**
 * Attacher.
 *
 * @param {Unified} processor - Processor.
 * @param {Object} [options] - Configuration.
 * @return {Function} - `transformer`.
 */
function attacher(processor, options) {
    var methods = [];
    var quotes;
    var ellipses;
    var backticks;
    var dashes;

    if (!options) {
        options = {};
    }

    if ('quotes' in options) {
        quotes = options.quotes;

        if (quotes !== Boolean(quotes)) {
            throw new TypeError(
                'Illegal invocation: `' + quotes + '` ' +
                'is not a valid value for `quotes` in ' +
                '`smartypants`'
            );
        }
    } else {
        quotes = true;
    }

    if ('ellipses' in options) {
        ellipses = options.ellipses;

        if (ellipses !== Boolean(ellipses)) {
            throw new TypeError(
                'Illegal invocation: `' + ellipses + '` ' +
                'is not a valid value for `ellipses` in ' +
                '`smartypants`'
            );
        }
    } else {
        ellipses = true;
    }

    if ('backticks' in options) {
        backticks = options.backticks;

        if (
            backticks !== Boolean(backticks) &&
            backticks !== 'all'
        ) {
            throw new TypeError(
                'Illegal invocation: `' + backticks + '` ' +
                'is not a valid value for `backticks` in ' +
                '`smartypants`'
            );
        }

        if (
            backticks === 'all' &&
            quotes === true
        ) {
            throw new TypeError(
                'Illegal invocation: `backticks: ' +
                backticks + '` is not a valid value ' +
                'when `quotes: ' + quotes + '` in ' +
                '`smartypants`'
            );
        }
    } else {
        backticks = true;
    }

    if ('dashes' in options) {
        dashes = options.dashes;

        if (
            dashes !== Boolean(dashes) &&
            dashes !== 'oldschool' &&
            dashes !== 'inverted'
        ) {
            throw new TypeError(
                'Illegal invocation: `' + dashes + '` ' +
                'is not a valid value for `dahes` in ' +
                '`smartypants`'
            );
        }
    } else {
        dashes = true;
    }

    if (quotes !== false) {
        methods.push(educators.quotes[quotes]);
    }

    if (ellipses !== false) {
        methods.push(educators.ellipses[ellipses]);
    }

    if (backticks !== false) {
        methods.push(educators.backticks[backticks]);
    }

    if (dashes !== false) {
        methods.push(educators.dashes[dashes]);
    }

    return transformFactory(methods);
}

/* Expose. */
module.exports = attacher;
