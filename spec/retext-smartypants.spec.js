'use strict';

var smartypants = require('..'),
    Retext = require('retext'),
    assert = require('assert');

describe('smartypants()', function () {
    it('should be of type `function`', function () {
        assert(typeof smartypants === 'function');
    });

    it('should throw when invoked by Retext, rather than the user',
        function () {
            var retext = new Retext().use(smartypants);

            assert.throws(function () {
                assert(retext.parse());
            }, /Illegal invocation/);
        }
    );
});

describe('Curly quotes', function () {
    var retext = new Retext().use(smartypants());

    it('should throw when not given true, false, or omitted', function () {
        assert.throws(function () {
            new Retext().use(smartypants({
                'quotes' : 1
            }));
        }, /'1'/);
    });

    it('should curl quotes', function () {
        retext.parse('Alfred "bertrand" cees.');

        assert(
            retext.parse('Alfred "bertrand" cees.').toString() ===
            'Alfred “bertrand” cees.'
        );

        assert(
            retext.parse('Alfred \'bertrand\' cees.').toString() ===
            'Alfred ‘bertrand’ cees.'
        );
    });

    it('should curl quotes at the start of a sentence', function () {
        assert(
            retext.parse('"Alfred" bertrand.').toString() ===
            '“Alfred” bertrand.'
        );

        assert(
            retext.parse('\'Alfred\' bertrand.').toString() ===
            '‘Alfred’ bertrand.'
        );
    });

    it('should curl quotes at the end of a sentence', function () {
        assert(
            retext.parse('Alfred "bertrand".').toString() ===
            'Alfred “bertrand”.'
        );
        assert(
            retext.parse('Alfred \'bertrand\'.').toString() ===
            'Alfred ‘bertrand’.'
        );
    });

    it('should curl nested quotes', function () {
        assert(
            retext.parse('"\'Alfred\' bertrand" cees.').toString() ===
            '“‘Alfred’ bertrand” cees.'
        );

        assert(
            retext.parse('\'"Alfred" bertrand\' cees.').toString() ===
            '‘“Alfred” bertrand’ cees.'
        );

        assert(
            retext.parse('"Alfred "bertrand" cees."').toString() ===
            '“Alfred “bertrand” cees.”'
        );

        assert(
            retext.parse('\'Alfred \'bertrand\' cees.\'').toString() ===
            '‘Alfred ‘bertrand’ cees.’'
        );

        assert(
            retext.parse(
                'He said, "\'Quoted\' words in a larger quote."'
            ).toString() === 'He said, “‘Quoted’ words in a larger quote.”'
        );

        assert(
            retext.parse(
                'He said, \'"Quoted" words in a larger quote.\''
            ).toString() === 'He said, ‘“Quoted” words in a larger quote.’'
        );
    });

    it('should curl quotes when the opening quote is followed by a ' +
        'dot-character', function () {
            assert(
                retext.parse('Alfred ".bertrand" cees.').toString() ===
                'Alfred “.bertrand” cees.'
            );

            assert(
                retext.parse('Alfred \'.bertrand\' cees.').toString() ===
                'Alfred ‘.bertrand’ cees.'
            );
        }
    );

    it('should curl quotes when the closing quote is followed by a ' +
        'dot-character', function () {
            assert(
                retext.parse('Alfred "bertrand."').toString() ===
                'Alfred “bertrand.”'
            );

            assert(
                retext.parse('Alfred \'bertrand.\'').toString() ===
                'Alfred ‘bertrand.’'
            );
        }
    );

    it('should curl quotes when the closing quote is followed by ' +
        'multiple dot-characters', function () {
            assert(retext.parse('"..alfred"').toString() === '“..alfred”');
            assert(retext.parse('\'..alfred\'').toString() === '‘..alfred’');
        }
    );

    it('should curl quotes when the closing quote is followed by a comma',
        function () {
            assert(
                retext.parse('"Alfred", bertrand.').toString() ===
                '“Alfred”, bertrand.'
            );

            assert(
                retext.parse('\'Alfred\', bertrand.').toString() ===
                '‘Alfred’, bertrand.'
            );
        }
    );

    it('should curl a single quote when followed by an s-character',
        function () {
            assert(
                retext.parse('Alfred\'s bertrand.').toString() ===
                'Alfred’s bertrand.'
            );
        }
    );

    it('should curl a single quote when followed by an decade (e.g., ’80s)',
        function () {
            assert(
                retext.parse('In the \'90s.').toString() === 'In the ’90s.'
            );
        }
    );

    it('should curl quotes followed by a dot character', function () {
        assert(
            retext.parse('"Alfred bertrand". Cees.').toString() ===
            '“Alfred bertrand”. Cees.'
        );

        assert(
            retext.parse('\'Alfred bertrand\'. Cees.').toString() ===
            '‘Alfred bertrand’. Cees.'
        );
    });
});

describe('En- and em-dashes', function () {
    it('should throw when not given true, false, or omitted', function () {
        assert.throws(function () {
            new Retext().use(smartypants({
                'dashes' : 'test'
            }));
        }, /'test'/);
    });

    it('should not replace double or triple dashes, when `dashes` is set ' +
        'to `false`', function () {
            var retext = new Retext().use(smartypants({
                'dashes' : false
            }));

            assert(
                retext.parse('Alfred--bertrand---cees.').toString() ===
                'Alfred--bertrand---cees.'
            );
        }
    );

    it('should replace double dashes with an em-dash, when `dashes` is ' +
        'set to `true`', function () {
            var retext = new Retext().use(smartypants());

            assert(
                retext.parse('Alfred--bertrand--cees.').toString() ===
                'Alfred—bertrand—cees.'
            );
    });

    it('should replace double dashes with an en-dash and triple dashes ' +
        'with an em-dash, when `dashes` is set to `oldschool`', function () {
            var retext = new Retext().use(smartypants({
                'dashes' : 'oldschool'
            }));

            assert(
                retext.parse('Alfred--bertrand---cees.').toString() ===
                'Alfred–bertrand—cees.'
            );
        }
    );

    it('should replace double dashes with an em-dash and triple dashes ' +
        'with an en-dash, when `dashes` is set to `inverted`', function () {
            var retext = new Retext().use(smartypants({
                'dashes' : 'inverted'
            }));

            assert(
                retext.parse('Alfred--bertrand---cees.').toString() ===
                'Alfred—bertrand–cees.'
            );
        }
    );

    it('should replace double dashes without spaces', function () {
        var retext = new Retext().use(smartypants({
            'dashes' : 'oldschool'
        }));

        assert(
            retext.parse(
                '"dashes"---without spaces--"are tricky."'
            ).toString() ===
            '“dashes”—without spaces–“are tricky.”'
        );
    });
});

describe('Ellipses', function () {
    it('should throw when not given true, false, or omitted', function () {
        assert.throws(function () {
            new Retext().use(smartypants({
                'ellipses' : Infinity
            }));
        }, /'Infinity'/);
    });

    it('should not replace triple dot characters, when `ellipses` is set ' +
        'to `false`', function () {
            var retext = new Retext().use(smartypants({
                'ellipses' : false
            }));

            assert(
                retext.parse('Alfred... ...Bertrand.').toString() ===
                'Alfred... ...Bertrand.'
            );
        }
    );

    it('should replace triple dot characters with an ellipsis, when ' +
        '`ellipses` is set to `true`', function () {
            var retext = new Retext().use(smartypants());

            assert(
                retext.parse('Alfred... Bertrand.').toString() ===
                'Alfred\u2026 Bertrand.'
            );

            assert(
                retext.parse('Alfred bertrand...').toString() ===
                'Alfred bertrand\u2026'
            );

            assert(
                retext.parse('...Alfred bertrand.').toString() ===
                '\u2026Alfred bertrand.'
            );
        }
    );

    it('should replace triple dot characters with spaces between, when ' +
        '`ellipses` is set to `true`', function () {
            var retext = new Retext().use(smartypants());

            assert(
                retext.parse('Alfred. . . Bertrand.').toString() ===
                'Alfred\u2026 Bertrand.'
            );

            assert(
                retext.parse('Alfred bertrand. . .').toString() ===
                'Alfred bertrand\u2026'
            );

            assert(
                retext.parse('. . .Alfred bertrand.').toString() ===
                '\u2026Alfred bertrand.'
            );
        }
    );
});

describe('Backticks', function () {
    it('should throw when not given true, false, or omitted', function () {
        assert.throws(function () {
            new Retext().use(smartypants({
                'backticks' : {}
            }));
        }, /'\[object Object\]'/);
    });

    it('should not replace two backticks with an opening double quote, ' +
        'when `backticks` is set to `false`', function () {
            var retext = new Retext().use(smartypants({
                'backticks' : false, 'quotes' : false
            }));

            assert(
                retext.parse('``Alfred bertrand.').toString() ===
                '``Alfred bertrand.'
            );
        }
    );

    it('should not replace two single quotes with a closing double quote, ' +
        'when `backticks` is set to `false`', function () {
            var retext = new Retext().use(smartypants({
                'backticks' : false, 'quotes' : false
            }));

            assert(
                retext.parse('Alfred\'\' bertrand.').toString() ===
                'Alfred\'\' bertrand.'
            );
        }
    );

    it('should not replace one backtick with an opening single quote, ' +
        'when `backticks` is set to `false`', function () {
            var retext = new Retext().use(smartypants({
                'backticks' : false, 'quotes' : false
            }));

            assert(
                retext.parse('`Alfred bertrand.').toString() ===
                '`Alfred bertrand.'
            );
        }
    );

    it('should not replace one single quote with a closing single quote, ' +
        'when `backticks` is set to `false`', function () {
            var retext = new Retext().use(smartypants({
                'backticks' : false, 'quotes' : false
            }));

            assert(
                retext.parse('Alfred\' bertrand.').toString() ===
                'Alfred\' bertrand.'
            );
        }
    );

    it('should replace two backticks with an opening double quote, ' +
        'when `backticks` is set to `true`', function () {
            var retext = new Retext().use(smartypants({
                'quotes' : false
            }));

            assert(
                retext.parse('``Alfred bertrand.').toString() ===
                '“Alfred bertrand.'
            );
        }
    );

    it('should replace two single quotes with a closing double quote, ' +
        'when `backticks` is set to `true`', function () {
            var retext = new Retext().use(smartypants({
                'quotes' : false
            }));

            assert(
                retext.parse('Alfred\'\' bertrand.').toString() ===
                'Alfred” bertrand.'
            );
        }
    );

    it('should not replace one backtick with an opening single quote, ' +
        'when `backticks` is set to `true`', function () {
            var retext = new Retext().use(smartypants({
                'quotes' : false
            }));

            assert(
                retext.parse('`Alfred bertrand.').toString() ===
                '`Alfred bertrand.'
            );
        }
    );

    it('should not replace one single quote with a closing single quote, ' +
        'when `backticks` is set to `true`', function () {
            var retext = new Retext().use(smartypants({
                'quotes' : false
            }));

            assert(
                retext.parse('Alfred\' bertrand.').toString() ===
                'Alfred\' bertrand.'
            );
        }
    );

    it('should replace two backticks with an opening double quote, ' +
        'when `backticks` is set to `all`', function () {
            var retext = new Retext().use(smartypants({
                'backticks' : 'all',
                'quotes' : false
            }));

            assert(
                retext.parse('``Alfred bertrand.').toString() ===
                '“Alfred bertrand.'
            );
        }
    );

    it('should replace two single quotes with a closing double quote, ' +
        'when `backticks` is set to `all`', function () {
            var retext = new Retext().use(smartypants({
                'backticks' : 'all',
                'quotes' : false
            }));

            assert(
                retext.parse('Alfred\'\' bertrand.').toString() ===
                'Alfred” bertrand.'
            );
        }
    );

    it('should replace one backtick with an opening single quote, ' +
        'when `backticks` is set to `all`', function () {
            var retext = new Retext().use(smartypants({
                'backticks' : 'all',
                'quotes' : false
            }));

            assert(
                retext.parse('`Alfred bertrand.').toString() ===
                '‘Alfred bertrand.'
            );
        }
    );

    it('should replace one single quote with a closing single quote, ' +
        'when `backticks` is set to `all`', function () {
            var retext = new Retext().use(smartypants({
                'backticks' : 'all',
                'quotes' : false
            }));

            assert(
                retext.parse('Alfred\' bertrand.').toString() ===
                'Alfred’ bertrand.'
            );
        }
    );
});
// Due to popular demand, four consecutive dots (....) will now be turned into
// an ellipsis followed by a period.
