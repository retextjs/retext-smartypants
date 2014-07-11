'use strict';

var visit, EXPRESSION_DECADE, THREE_DASHES, TWO_DASHES, EM_DASH, EN_DASH,
    THREE_DOTS, ELLIPSIS, DOT, TWO_BACKTICKS, BACKTICK, TWO_SINGLE_QUOTES,
    SINGLE_QUOTE, DOUBLE_QUOTE, OPENING_DOUBLE_QUOTE, CLOSING_DOUBLE_QUOTE,
    OPENING_SINGLE_QUOTE, CLOSING_SINGLE_QUOTE, CLOSING_QUOTE_MAP,
    OPENING_QUOTE_MAP, TRUE, educators;

visit = require('retext-visit');

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

educators = {
    'dashes' : {
        'true' : function () {
            var self = this,
                value = self.data.originalValue || self.toString();

            if (value === TWO_DASHES) {
                self.data.originalValue = value;
                self[0].fromString(EM_DASH);
            }
        },
        'oldschool' : function () {
            var self = this,
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
            var self = this,
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
            var self = this,
                value = self.data.originalValue || self.toString();

            if (value === THREE_DOTS) {
                self.data.originalValue = value;
                self[0].fromString(ELLIPSIS);
                return;
            }

            if (value !== DOT) {
                return;
            }

            var nodes = [],
                node = self.prev,
                count = 1,
                iterator = -1,
                type;

            while (node) {
                type = node.type;

                if (!(type === node.WHITE_SPACE_NODE &&
                    node.next.toString() === DOT) &&
                    !(type === node.PUNCTUATION_NODE &&
                    node.toString() === DOT)) {
                        break;
                }

                count++;
                nodes.push(node);
                node = node.prev;
            }

            if (count < 5) {
                return;
            }

            while (nodes[++iterator]) {
                nodes[iterator].remove();
            }

            self[0].fromString(self.data.originalValue = ELLIPSIS);
        }
    },
    'backticks' : {
        'true' : function () {
            var self = this,
                value = self.data.originalValue || self.toString();

            if (value === TWO_BACKTICKS) {
                self[0].fromString(OPENING_DOUBLE_QUOTE);
            } else if (value === TWO_SINGLE_QUOTES) {
                self[0].fromString(CLOSING_DOUBLE_QUOTE);
            }
        },
        'all' : function () {
            var self = this,
                value = self.data.originalValue || self.toString();

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
            if (!this.parent) {
                return;
            }

            var self = this,
                value = self.data.originalValue || self.toString(),
                next, nextNext, prev, nextValue;

            if (value !== DOUBLE_QUOTE && value !== SINGLE_QUOTE) {
                return;
            }

            next = self.next;
            nextNext = next && next.next;
            prev = self.prev;
            nextValue = next ?
                next.data.originalValue || next.toString() :
                '';

            /* Special case if the very first character is a quote
             * followed by punctuation at a non-word-break. Close the
             * quotes by brute force:
             */
            if (nextNext &&
                next.type === self.PUNCTUATION_NODE &&
                nextNext.type !== self.WORD_NODE) {
                    self.data.originalValue = value;
                    self[0].fromString(CLOSING_QUOTE_MAP[value]);
            /* Special case for double sets of quotes, e.g.:
             *    He said, "'Quoted' words in a larger quote."
             */
            } else if (nextNext && (nextValue === DOUBLE_QUOTE ||
                nextValue === SINGLE_QUOTE) &&
                nextNext.type === self.WORD_NODE) {
                    self.data.originalValue = value;
                    self[0].fromString(OPENING_QUOTE_MAP[value]);
                    next[0].fromString(OPENING_QUOTE_MAP[nextValue]);
            /* Special case for decade abbreviations (the '80s): */
            } else if (nextNext && EXPRESSION_DECADE.test(nextValue)) {
                    self.data.originalValue = value;
                    self[0].fromString(CLOSING_QUOTE_MAP[value]);
            /* Get most opening single quotes: */
            } else if (prev && next &&
                (prev.type === self.WHITE_SPACE_NODE ||
                prev.type === self.PUNCTUATION_NODE) &&
                next.type === self.WORD_NODE) {
                    self.data.originalValue = value;
                    self[0].fromString(OPENING_QUOTE_MAP[value]);
            /* Closing quotes: */
            } else if (prev && (prev.type !== self.WHITE_SPACE_NODE &&
                prev.type !== self.PUNCTUATION_NODE)) {
                    self.data.originalValue = value;
                    self[0].fromString(CLOSING_QUOTE_MAP[value]);
            } else if (!next || next.type === self.WHITE_SPACE_NODE ||
                (value === '\'' && nextValue === 's')) {
                    self.data.originalValue = value;
                    self[0].fromString(CLOSING_QUOTE_MAP[value]);
            } else {
                self.data.originalValue = value;
                self[0].fromString(OPENING_QUOTE_MAP[value]);
            }
        }
    }
};

function attachFactory(events) {
    return function (retext) {
        var PunctuationNode = retext.parser.TextOM.PunctuationNode,
            iterator, event, methods;

        retext.use(visit);

        for (event in events) {
            methods = events[event];
            iterator = -1;

            while (methods[++iterator]) {
                PunctuationNode.on(event, methods[iterator]);
            }
        }
    };
}

function smartypants(options) {
    if (arguments.length > 1) {
        throw new TypeError('Illegal invocation: smartypants was' +
            ' called by Retext, but should be called by the user');
    }

    var events, method, quotes, ellipses, backticks, dashes;

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
            throw new TypeError('Illegal invocation: \'' + quotes +
                '\' is not a valid option for `quotes` in ' +
                '\'smartypants\'');
        }
    }

    if ('ellipses' in options) {
        ellipses = options.ellipses;
        if (ellipses !== Boolean(ellipses)) {
            throw new TypeError('Illegal invocation: \'' + ellipses +
                '\' is not a valid option for `ellipses` in ' +
                '\'smartypants\'');
        }
    }

    if ('backticks' in options) {
        backticks = options.backticks;
        if (backticks !== Boolean(backticks) && backticks !== 'all') {
            throw new TypeError('Illegal invocation: \'' + backticks +
                '\' is not a valid option for `backticks` in ' +
                '\'smartypants\'');
        }
    }

    if ('dashes' in options) {
        dashes = options.dashes;
        if (dashes !== Boolean(dashes) && dashes !== 'oldschool' &&
            dashes !== 'inverted') {
                throw new TypeError('Illegal invocation: \'' + dashes +
                    '\' is not a valid option for `dashes` in ' +
                    '\'smartypants\'');
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

    function callback(tree) {
        tree.visitType(tree.PUNCTUATION_NODE, function (node) {
            var value = node[0].toString();
            node[0].fromString(null);
            node[0].fromString(value);
        });
    }

    callback.attach = attachFactory(events);

    return callback;
}

exports = module.exports = smartypants;
