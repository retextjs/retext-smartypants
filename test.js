'use strict';

/**
 * Dependencies.
 */

var smartypants,
    Retext,
    assert;

smartypants = require('./');
Retext = require('retext');
assert = require('assert');

/**
 * Tests.
 */

describe('smartypants()', function () {
    it('should be a `function`', function () {
        assert(typeof smartypants === 'function');
    });

    it('should throw when invoked by the user', function () {
        assert.throws(function () {
            smartypants();
        }, /Illegal invocation/);

        assert.throws(function () {
            smartypants({
                'quotes': true
            });
        }, /Illegal invocation/);
    });
});

describe('Curly quotes', function () {
    var retext;

    retext = new Retext().use(smartypants);

    it('should throw when not given `true`, `false`, or omitted',
        function () {
            assert.throws(function () {
                new Retext().use(smartypants, {
                    'quotes': 1
                });
            }, /1/);
        }
    );

    it('should curl double quotes', function (done) {
        retext.parse('Alfred "bertrand" cees.', function (err, tree) {
            assert(tree.toString() === 'Alfred “bertrand” cees.');

            done(err);
        });
    });

    it('should curl single quotes', function (done) {
        retext.parse('Alfred \'bertrand\' cees.', function (err, tree) {
            assert(tree.toString() === 'Alfred ‘bertrand’ cees.');

            done(err);
        });
    });

    it('should curl double quotes at the beginning', function (done) {
        retext.parse('"Alfred" bertrand.', function (err, tree) {
            assert(tree.toString() === '“Alfred” bertrand.');

            done(err);
        });
    });

    it('should curl single quotes at the beginning', function (done) {
        retext.parse('\'Alfred\' bertrand.', function (err, tree) {
            assert(tree.toString() === '‘Alfred’ bertrand.');

            done(err);
        });
    });

    it('should curl double quotes at the end', function (done) {
        retext.parse('Alfred "bertrand".', function (err, tree) {
            assert(tree.toString() === 'Alfred “bertrand”.');

            done(err);
        });
    });

    it('should curl single quotes at the end', function (done) {
        retext.parse('Alfred \'bertrand\'.', function (err, tree) {
            assert(tree.toString() === 'Alfred ‘bertrand’.');

            done(err);
        });
    });

    it('should curl quotes when single quotes occur in double quotes',
        function (done) {
            retext.parse('"\'Alfred\' bertrand" cees.', function (err, tree) {
                assert(tree.toString() === '“‘Alfred’ bertrand” cees.');

                done(err);
            });
        }
    );

    it('should curl quotes when single quotes occur in double quotes #2',
        function (done) {
            retext.parse('He said, "\'Quoted\' words in a larger quote."',
                function (err, tree) {
                    assert(
                        tree.toString() ===
                        'He said, “‘Quoted’ words in a larger quote.”'
                    );

                    done(err);
                }
            );
        }
    );

    it('should curl quotes when double quotes occur in single quotes',
        function (done) {
            retext.parse('\'"Alfred bertrand"\' cees.', function (err, tree) {
                assert(tree.toString() === '‘“Alfred bertrand”’ cees.');

                done(err);
            });
        }
    );

    it('should curl quotes when double quotes occur in single quotes #2',
        function (done) {
            retext.parse('He said, \'"Quoted" words in a larger quote.\'',
                function (err, tree) {
                    assert(
                        tree.toString() ===
                        'He said, ‘“Quoted” words in a larger quote.’'
                    );

                    done(err);
                }
            );
        }
    );

    it('should curl quotes when double quotes occur in double quotes',
        function (done) {
            retext.parse('"Alfred "bertrand" cees."', function (err, tree) {
                assert(tree.toString() === '“Alfred “bertrand” cees.”');

                done(err);
            });
        }
    );

    it('should curl quotes when single quotes occur in single quotes',
        function (done) {
            retext.parse(
                '\'Alfred \'bertrand\' cees.\'',
                function (err, tree) {
                    assert(tree.toString() === '‘Alfred ‘bertrand’ cees.’');

                    done(err);
                }
            );
        }
    );

    it('should curl opening double quotes when followed by a full stop',
        function (done) {
            retext.parse('Alfred ".bertrand" cees.', function (err, tree) {
                assert(tree.toString() === 'Alfred “.bertrand” cees.');

                done(err);
            });
        }
    );

    it('should curl opening single quotes when followed by a full stop',
        function (done) {
            retext.parse('Alfred \'.bertrand\' cees.', function (err, tree) {
                assert(tree.toString() === 'Alfred ‘.bertrand’ cees.');

                done(err);
            });
        }
    );

    it('should curl closing double quotes when preceded by a full stop',
        function (done) {
            retext.parse('Alfred "bertrand." Cees.', function (err, tree) {
                assert(tree.toString() === 'Alfred “bertrand.” Cees.');

                done(err);
            });
        }
    );

    it('should curl closing single quotes when preceded by a full stop',
        function (done) {
            retext.parse('Alfred \'bertrand.\' Cees.', function (err, tree) {
                assert(tree.toString() === 'Alfred ‘bertrand.’ Cees.');

                done(err);
            });
        }
    );

    it('should curl opening double quotes when followed by a multiple ' +
        'full stops',
        function (done) {
            retext.parse('"..Alfred"', function (err, tree) {
                assert(tree.toString() === '“..Alfred”');

                done(err);
            });
        }
    );

    it('should curl closing double quotes when followed by a multiple ' +
        'full stops',
        function (done) {
            retext.parse('\'..Alfred\'', function (err, tree) {
                assert(tree.toString() === '‘..Alfred’');

                done(err);
            });
        }
    );

    it('should curl closing double quotes when followed by a comma',
        function (done) {
            retext.parse('"Alfred", bertrand.', function (err, tree) {
                assert(tree.toString() === '“Alfred”, bertrand.');

                done(err);
            });
        }
    );

    it('should curl closing single quotes when followed by a comma',
        function (done) {
            retext.parse('\'Alfred\', bertrand.', function (err, tree) {
                assert(tree.toString() === '‘Alfred’, bertrand.');

                done(err);
            });
        }
    );

    it('should curl single quotes when followed by `s`',
        function (done) {
            retext.parse('Alfred\'s bertrand.', function (err, tree) {
                assert(tree.toString() === 'Alfred’s bertrand.');

                done(err);
            });
        }
    );

    it('should curl single quotes when followed by a decade (e.g., `80s`)',
        function (done) {
            retext.parse('In the \'90s.', function (err, tree) {
                assert(tree.toString() === 'In the ’90s.');

                done(err);
            });
        }
    );

    it('should curl double quotes when followed by a full stop',
        function (done) {
            retext.parse('"Alfred bertrand". Cees.', function (err, tree) {
                assert(tree.toString() === '“Alfred bertrand”. Cees.');

                done(err);
            });
        }
    );

    it('should curl single quotes when followed by a full stop',
        function (done) {
            retext.parse('\'Alfred bertrand\'. Cees.', function (err, tree) {
                assert(tree.toString() === '‘Alfred bertrand’. Cees.');

                done(err);
            });
        }
    );
});

describe('En- and em-dashes', function () {
    it('should throw when not given `true`, `false`, `oldschool`, ' +
        '`inverted`, or omitted',
        function () {
            assert.throws(function () {
                new Retext().use(smartypants, {
                    'dashes': 'test'
                });
            }, /test/);
        }
    );

    it('should not replace double or triple dashes, when `dashes` is `false`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'dashes': false
            });

            retext.parse('Alfred--bertrand---cees.', function (err, tree) {
                assert(tree.toString() === 'Alfred--bertrand---cees.');

                done(err);
            });
        }
    );

    it('should replace two dashes with an em-dash, when `dashes` is `true`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'dashes': true
            });

            retext.parse('Alfred--bertrand--cees.', function (err, tree) {
                assert(tree.toString() === 'Alfred—bertrand—cees.');

                done(err);
            });
        }
    );

    it('should replace two dashes with an en-dash and three dashes with ' +
        'an em-dash, when `dashes` is `oldschool`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'dashes': 'oldschool'
            });

            retext.parse('Alfred--bertrand---cees.', function (err, tree) {
                assert(tree.toString() === 'Alfred–bertrand—cees.');

                done(err);
            });
        }
    );

    it('should replace two dashes with an em-dash and three dashes with ' +
        'an en-dash, when `dashes` is `inverted`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'dashes': 'inverted'
            });

            retext.parse('Alfred--bertrand---cees.', function (err, tree) {
                assert(tree.toString() === 'Alfred—bertrand–cees.');

                done(err);
            });
        }
    );

    it('should replace two dashes with an em-dash and three dashes with ' +
        'an en-dash, when `dashes` is `inverted`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'dashes': 'oldschool'
            });

            retext.parse(
                '"dashes"---without spaces--"are tricky."',
                function (err, tree) {
                    assert(
                        tree.toString() ===
                        '“dashes”—without spaces–“are tricky.”'
                    );

                    done(err);
                }
            );
        }
    );
});

describe('Ellipses', function () {
    it('should throw when not given `true`, `false`, or omitted',
        function () {
            assert.throws(function () {
                new Retext().use(smartypants, {
                    'ellipses': Infinity
                });
            }, /Infinity/);
        }
    );

    it('should not replace three full stops, when `ellipses` is `false`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'ellipses': false
            });

            retext.parse('Alfred... ...Bertrand.', function (err, tree) {
                assert(tree.toString() === 'Alfred... ...Bertrand.');

                done(err);
            });
        }
    );

    it('should replace three full stops, when `ellipses` is `true`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'ellipses': true
            });

            retext.parse('Alfred... Bertrand.', function (err, tree) {
                assert(tree.toString() === 'Alfred\u2026 Bertrand.');

                done(err);
            });
        }
    );

    it('should replace three full stops, when `ellipses` is `true`, ' +
        'when at the beginning',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'ellipses': true
            });

            retext.parse('...Alfred bertrand.', function (err, tree) {
                assert(tree.toString() === '\u2026Alfred bertrand.');

                done(err);
            });
        }
    );

    it('should replace three full stops, when `ellipses` is `true`, ' +
        'when at the end',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'ellipses': true
            });

            retext.parse('Alfred bertrand...', function (err, tree) {
                assert(tree.toString() === 'Alfred bertrand\u2026');

                done(err);
            });
        }
    );

    it('should replace three full stops with spaces, when `ellipses` is ' +
        '`true`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'ellipses': true
            });

            retext.parse('Alfred. . . Bertrand.', function (err, tree) {
                assert(tree.toString() === 'Alfred\u2026 Bertrand.');

                done(err);
            });
        }
    );

    it('should replace three full stops with spaces, when `ellipses` is ' +
        '`true`, when at the beginning',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'ellipses': true
            });

            retext.parse('. . .Alfred bertrand.', function (err, tree) {
                assert(tree.toString() === '\u2026Alfred bertrand.');

                done(err);
            });
        }
    );

    it('should replace three full stops with spaces, when `ellipses` is ' +
        '`true`, when at the end',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'ellipses': true
            });

            retext.parse('Alfred bertrand. . .', function (err, tree) {
                assert(tree.toString() === 'Alfred bertrand\u2026');

                done(err);
            });
        }
    );
});

describe('Backticks', function () {
    it('should throw when not given `true`, `false`, or omitted',
        function () {
            assert.throws(function () {
                new Retext().use(smartypants, {
                    'backticks': {}
                });
            }, /object Object/);
        }
    );

    it('should throw when `backticks` is `all`, and `quotes` is `true`',
        function () {
            assert.throws(function () {
                new Retext().use(smartypants, {
                    'backticks': 'all',
                    'quotes': true
                });
            }, 'Illegal invocation');
        }
    );

    it('should not replace two backticks with an opening double quote ' +
        'when `backticks` is `false`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'backticks': false,
                'quotes': false
            });

            retext.parse('``Alfred bertrand.', function (err, tree) {
                assert(tree.toString() === '``Alfred bertrand.');

                done(err);
            });
        }
    );

    it('should not replace two single quotes with a closing double quote ' +
        'when `backticks` is `false`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'backticks': false,
                'quotes': false
            });

            retext.parse('Alfred\'\' bertrand.', function (err, tree) {
                assert(tree.toString() === 'Alfred\'\' bertrand.');

                done(err);
            });
        }
    );

    it('should not replace a backtick with an opening single quote ' +
        'when `backticks` is `false`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'backticks': false,
                'quotes': false
            });

            retext.parse('`Alfred bertrand.', function (err, tree) {
                assert(tree.toString() === '`Alfred bertrand.');

                done(err);
            });
        }
    );

    it('should not replace a single quote with a closing single quote ' +
        'when `backticks` is `false`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'backticks': false,
                'quotes': false
            });

            retext.parse('Alfred\' bertrand.', function (err, tree) {
                assert(tree.toString() === 'Alfred\' bertrand.');

                done(err);
            });
        }
    );

    it('should replace two backticks with an opening double quote ' +
        'when `backticks` is `true`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'backticks': true,
                'quotes': false
            });

            retext.parse('``Alfred bertrand.', function (err, tree) {
                assert(tree.toString() === '“Alfred bertrand.');

                done(err);
            });
        }
    );

    it('should replace two single quotes with a closing double quote ' +
        'when `backticks` is `true`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'backticks': true,
                'quotes': false
            });

            retext.parse('Alfred\'\' bertrand.', function (err, tree) {
                assert(tree.toString() === 'Alfred” bertrand.');

                done(err);
            });
        }
    );

    it('should not replace a backtick with an opening single quote ' +
        'when `backticks` is `true`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'backticks': true,
                'quotes': false
            });

            retext.parse('`Alfred bertrand.', function (err, tree) {
                assert(tree.toString() === '`Alfred bertrand.');

                done(err);
            });
        }
    );

    it('should not replace a single quote with a closing single quote ' +
        'when `backticks` is `true`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'backticks': true,
                'quotes': false
            });

            retext.parse('Alfred\' bertrand.', function (err, tree) {
                assert(tree.toString() === 'Alfred\' bertrand.');

                done(err);
            });
        }
    );

    it('should replace two backticks with an opening double quote ' +
        'when `backticks` is `all`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'backticks': 'all',
                'quotes': false
            });

            retext.parse('``Alfred bertrand.', function (err, tree) {
                assert(tree.toString() === '“Alfred bertrand.');

                done(err);
            });
        }
    );

    it('should replace two single quotes with a closing double quote ' +
        'when `backticks` is `all`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'backticks': 'all',
                'quotes': false
            });

            retext.parse('Alfred\'\' bertrand.', function (err, tree) {
                assert(tree.toString() === 'Alfred” bertrand.');

                done(err);
            });
        }
    );

    it('should replace one backtick with an opening single quote, ' +
        'when `backticks` is `all`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'backticks': 'all',
                'quotes': false
            });

            retext.parse('`Alfred bertrand.', function (err, tree) {
                assert(tree.toString() === '‘Alfred bertrand.');

                done(err);
            });
        }
    );

    it('should replace one single quote with a closing single quote, ' +
        'when `backticks` is `all`',
        function (done) {
            var retext;

            retext = new Retext().use(smartypants, {
                'backticks': 'all',
                'quotes': false
            });

            retext.parse('Alfred\' bertrand.', function (err, tree) {
                assert(tree.toString() === 'Alfred’ bertrand.');

                done(err);
            });
        }
    );
});
