'use strict';

/**
 * Module dependencies.
 */

var visit;

visit = require('retext-visit');

/**
 * Constants.
 */

var EXPRESSION_DECADE,
    THREE_DASHES,
    TWO_DASHES,
    EM_DASH,
    EN_DASH,
    THREE_DOTS,
    ELLIPSIS,
    DOT,
    TWO_BACKTICKS,
    BACKTICK,
    TWO_SINGLE_QUOTES,
    SINGLE_QUOTE,
    DOUBLE_QUOTE,
    OPENING_DOUBLE_QUOTE,
    CLOSING_DOUBLE_QUOTE,
    OPENING_SINGLE_QUOTE,
    CLOSING_SINGLE_QUOTE,
    CLOSING_QUOTE_MAP,
    OPENING_QUOTE_MAP,
    TRUE;

EXPRESSION_DECADE = /^\d\ds$/i;

THREE_DASHES = '---';
TWO_DASHES = '--';
EM_DASH = '—';
EN_DASH = '–';

THREE_DOTS = '...';
ELLIPSIS = '\u2026';
DOT = '.';

TWO_BACKTICKS = '``';
BACKTICK = '`';
TWO_SINGLE_QUOTES = '\'\'';

SINGLE_QUOTE = '\'';
DOUBLE_QUOTE = '"';

CLOSING_QUOTE_MAP = {};
OPENING_QUOTE_MAP = {};
OPENING_QUOTE_MAP[DOUBLE_QUOTE] = OPENING_DOUBLE_QUOTE = '“';
CLOSING_QUOTE_MAP[DOUBLE_QUOTE] = CLOSING_DOUBLE_QUOTE = '”';
OPENING_QUOTE_MAP[SINGLE_QUOTE] = OPENING_SINGLE_QUOTE = '‘';
CLOSING_QUOTE_MAP[SINGLE_QUOTE] = CLOSING_SINGLE_QUOTE = '’';

TRUE = 'true';

/**
 * Define the methods.
 */

var educators;

educators = {
    'dashes' : {
        'true' : function () {
            var self,
                value;

            self = this;

            value = self.data.originalValue || self.toString();

            if (value === TWO_DASHES) {
                self.data.originalValue = value;
                self[0].fromString(EM_DASH);
            }
        },
        'oldschool' : function () {
            var self,
                value;

            self = this;

            value = self.data.originalValue || self.toString();

            if (value === THREE_DASHES) {
                self.data.originalValue = value;
                self[0].fromString(EM_DASH);
            } else if (value === TWO_DASHES) {
                self.data.originalValue = value;
                self[0].fromString(EN_DASH);
            }
        },
        'inverted' : function () {
            var self,
                value;

            self = this;

            value = self.data.originalValue || self.toString();

            if (value === THREE_DASHES) {
                self.data.originalValue = value;
                self[0].fromString(EN_DASH);
            } else if (value === TWO_DASHES) {
                self.data.originalValue = value;
                self[0].fromString(EM_DASH);
            }
        }
    },
    'ellipses' : {
        'true' : function () {
            var self,
                value,
                nodes,
                node,
                count,
                index,
                type;

            self = this;

            value = self.data.originalValue || self.toString();

            if (value === THREE_DOTS) {
                self.data.originalValue = value;
                self[0].fromString(ELLIPSIS);
                return;
            }

            if (value !== DOT) {
                return;
            }

            nodes = [];
            node = self.prev;
            count = 1;
            index = -1;

            /**
             * This full stop is the first character
             * in a word.
             */

            if (
                !node &&
                self.parent &&
                self.parent.type === self.WORD_NODE
            ) {
                node = self.parent.prev;
            }

            while (node) {
                type = node.type;

                if (
                    !(
                        type === node.WHITE_SPACE_NODE &&
                        node.next.toString().charAt(0) === DOT
                    ) &&
                    !(
                        type === node.PUNCTUATION_NODE &&
                        node.toString() === DOT
                    )
                ) {
                    break;
                }

                count++;
                nodes.push(node);
                node = node.prev;
            }

            if (count < 5) {
                return;
            }

            while (nodes[++index]) {
                nodes[index].remove();
            }

            self[0].fromString(self.data.originalValue = ELLIPSIS);
        }
    },
    'backticks' : {
        'true' : function () {
            var self,
                value;

            self = this;

            value = self.toString();

            if (value === TWO_BACKTICKS) {
                self[0].fromString(OPENING_DOUBLE_QUOTE);
            } else if (value === TWO_SINGLE_QUOTES) {
                self[0].fromString(CLOSING_DOUBLE_QUOTE);
            }
        },
        'all' : function () {
            var self,
                value;

            self = this;

            value = self.toString();

            educators.backticks[TRUE].call(self);

            if (value === BACKTICK) {
                self[0].fromString(OPENING_SINGLE_QUOTE);
            } else if (value === SINGLE_QUOTE) {
                self[0].fromString(CLOSING_SINGLE_QUOTE);
            }
        }
    },
    'quotes' : {
        'true' : function () {
            var self,
                value,
                next,
                nextNext,
                prev,
                nextValue;

            self = this;

            if (!self.parent) {
                return;
            }

            value = self.data.originalValue || self.toString();

            if (value !== DOUBLE_QUOTE && value !== SINGLE_QUOTE) {
                return;
            }

            next = self.next;
            nextNext = next && next.next;
            prev = self.prev;

            nextValue = '';

            if (next) {
                nextValue = next.data.originalValue || next.toString();
            }

            if (
                nextNext &&
                next.type === self.PUNCTUATION_NODE &&
                nextNext.type !== self.WORD_NODE
            ) {
                /**
                 * Special case if the very first character is
                 * a quote followed by punctuation at a
                 * non-word-break. Close the quotes by brute
                 * force:
                 */

                self.data.originalValue = value;

                self[0].fromString(CLOSING_QUOTE_MAP[value]);
            } else if (
                nextNext &&
                (
                    nextValue === DOUBLE_QUOTE ||
                    nextValue === SINGLE_QUOTE
                ) &&
                nextNext.type === self.WORD_NODE
            ) {
                /**
                 * Special case for double sets of quotes:
                 *
                 *    He said, "'Quoted' words in a larger quote."
                 */

                self.data.originalValue = value;

                self[0].fromString(OPENING_QUOTE_MAP[value]);
                next[0].fromString(OPENING_QUOTE_MAP[nextValue]);
            } else if (
                nextNext &&
                EXPRESSION_DECADE.test(nextValue)
            ) {
                /**
                 * Special case for decade abbreviations:
                 *
                 *   the '80s
                 */

                self.data.originalValue = value;

                self[0].fromString(CLOSING_QUOTE_MAP[value]);
            } else if (
                prev &&
                next &&
                (
                    prev.type === self.WHITE_SPACE_NODE ||
                    prev.type === self.PUNCTUATION_NODE
                ) &&
                next.type === self.WORD_NODE
            ) {
                /**
                 * Get most opening single quotes.
                 */

                self.data.originalValue = value;

                self[0].fromString(OPENING_QUOTE_MAP[value]);
            } else if (
                prev &&
                (
                    prev.type !== self.WHITE_SPACE_NODE &&
                    prev.type !== self.PUNCTUATION_NODE
                )
            ) {
                /**
                 * Closing quotes
                 */

                self.data.originalValue = value;

                self[0].fromString(CLOSING_QUOTE_MAP[value]);
            } else if (
                !next ||
                next.type === self.WHITE_SPACE_NODE ||
                (
                    value === '\'' &&
                    nextValue === 's'
                )
            ) {
                self.data.originalValue = value;

                self[0].fromString(CLOSING_QUOTE_MAP[value]);
            } else {
                self.data.originalValue = value;

                self[0].fromString(OPENING_QUOTE_MAP[value]);
            }
        }
    }
};

/**
 * Define `attachFactory`.
 *
 * @param {Object.<string, Array.<function>>} events
 * @return {function}
 */

function attachFactory(events) {
    /**
     * @param {Retext} retext
     */

    return function (retext) {
        var PunctuationNode,
            index,
            event,
            methods;

        retext.use(visit);

        PunctuationNode = retext.TextOM.PunctuationNode;

        for (event in events) {
            methods = events[event];

            index = methods.length;

            while (index--) {
                PunctuationNode.on(event, methods[index]);
            }
        }
    };
}

/**
 * Define `smartypantsFactory`.
 *
 * @param {Object} options
 * @return {function}
 */

function smartypantsFactory(options) {
    var events,
        method,
        quotes,
        ellipses,
        backticks,
        dashes;

    if (arguments.length > 1) {
        throw new TypeError(
            'Illegal invocation: `smartypants` was ' +
            'invoked by `Retext`, but should be ' +
            'invoked by the user'
        );
    }

    events = {
        'changetextinside' : [],
        'changeprev' : [],
        'changenext' : []
    };

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
    }

    if (quotes !== false) {
        method = educators.quotes[quotes || true];

        events.changetextinside.push(method);
        events.changeprev.push(method);
        events.changenext.push(method);
    }

    if (ellipses !== false) {
        method = educators.ellipses[ellipses || true];

        events.changetextinside.push(method);
        events.changeprev.push(method);
    }

    if (backticks !== false) {
        events.changetextinside.push(educators.backticks[backticks || true]);
    }

    if (dashes !== false) {
        events.changetextinside.push(educators.dashes[dashes || true]);
    }

    /**
     * Define `smartypants`.
     *
     * @param {Node} tree
     */

    function smartypants(tree) {
        tree.visitType(tree.PUNCTUATION_NODE, function (node) {
            var value;

            value = node[0].toString();

            node[0].fromString(null);
            node[0].fromString(value);
        });
    }

    /**
     * Expose `attach`.
     */

    smartypants.attach = attachFactory(events);

    return smartypants;
}

/**
 * Expose `smartypantsFactory`.
 */

module.exports = smartypantsFactory;
