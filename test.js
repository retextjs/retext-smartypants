'use strict';

/* eslint-env mocha */

/*
 * Dependencies.
 */

var assert = require('assert');
var retext = require('retext');
var smartypants = require('./');

/*
 * Methods.
 */

var equal = assert.strictEqual;
var throws = assert.throws;

/*
 * Tests.
 */

describe('Curly quotes', function () {
    var processor = retext.use(smartypants);

    it('should throw when not given `true`, `false`, or omitted',
        function () {
            throws(function () {
                retext.use(smartypants, {
                    'quotes': 1
                });
            }, /1/);
        }
    );

    it('should not throw when not omitted', function () {
        retext.use(smartypants, {
            'quotes': false
        });
    });

    it('should curl double quotes', function () {
        equal(
            processor.process('Alfred "bertrand" cees.'),
            'Alfred “bertrand” cees.'
        );
    });

    it('should curl single quotes', function () {
        equal(
            processor.process('Alfred \'bertrand\' cees.'),
            'Alfred ‘bertrand’ cees.'
        );
    });

    it('should curl initial double quotes', function () {
        equal(
            processor.process('"Alfred" bertrand.'),
            '“Alfred” bertrand.'
        );
    });

    it('should curl initial single quotes', function () {
        equal(
            processor.process('\'Alfred\' bertrand.'),
            '‘Alfred’ bertrand.'
        );
    });

    it('should curl final double quotes', function () {
        equal(
            processor.process('Alfred "bertrand".'),
            'Alfred “bertrand”.'
        );
    });

    it('should curl final single quotes', function () {
        equal(
            processor.process('Alfred \'bertrand\'.'),
            'Alfred ‘bertrand’.'
        );
    });

    it('should curl single quotes in double quotes', function () {
        equal(
            processor.process('"\'Alfred\' bertrand" cees.'),
            '“‘Alfred’ bertrand” cees.'
        );

        equal(
            processor.process('"Alfred \'bertrand\'" cees.'),
            '“Alfred ‘bertrand’” cees.'
        );
    });

    it('should curl double quotes in single quotes', function () {
        equal(
            processor.process('\'"Alfred" bertrand\' cees.'),
            '‘“Alfred” bertrand’ cees.'
        );

        equal(
            processor.process('\'Alfred "bertrand"\' cees.'),
            '‘Alfred “bertrand”’ cees.'
        );
    });

    it('should curl nested double quotes', function () {
        equal(
            processor.process('"Alfred "bertrand" cees."'),
            '“Alfred “bertrand” cees.”'
        );
    });

    it('should curl nested single quotes', function () {
        equal(
            processor.process('\'Alfred \'bertrand\' cees.\''),
            '‘Alfred ‘bertrand’ cees.’'
        );
    });

    it('should curl initial double quotes when followed by a full stop',
        function () {
            equal(
                processor.process('Alfred ".bertrand" cees.'),
                'Alfred “.bertrand” cees.'
            );
        }
    );

    it('should curl initial single quotes when followed by a full stop',
        function () {
            equal(
                processor.process('Alfred \'.bertrand\' cees.'),
                'Alfred ‘.bertrand’ cees.'
            );
        }
    );

    it('should curl initial double quotes when preceded by a full stop',
        function () {
            equal(
                processor.process('Alfred "bertrand." cees.'),
                'Alfred “bertrand.” cees.'
            );
        }
    );

    it('should curl initial single quotes when preceded by a full stop',
        function () {
            equal(
                processor.process('Alfred \'bertrand.\' cees.'),
                'Alfred ‘bertrand.’ cees.'
            );
        }
    );

    it('should curl initial double quotes when followed by a multiple ' +
        'full-stops', function () {
            equal(processor.process('"..Alfred"'), '“..Alfred”');
        }
    );

    it('should curl initial single quotes when followed by a multiple ' +
        'full-stops', function () {
            equal(processor.process('\'..Alfred\''), '‘..Alfred’');
        }
    );

    it('should curl final double quotes when followed by a multiple ' +
        'full-stops', function () {
            equal(processor.process('"Alfred"..'), '“Alfred”..');
        }
    );

    it('should curl final single quotes when followed by a multiple ' +
        'full-stops', function () {
            equal(processor.process('\'Alfred\'..'), '‘Alfred’..');
        }
    );

    it('should curl final double quotes when followed by a comma',
        function () {
            equal(
                processor.process('"Alfred", bertrand.'),
                '“Alfred”, bertrand.'
            );
        }
    );

    it('should curl final single quotes when followed by a comma',
        function () {
            equal(
                processor.process('\'Alfred\', bertrand.'),
                '‘Alfred’, bertrand.'
            );
        }
    );

    it('should curl apostrophes when followed `s`', function () {
        equal(
            processor.process('Alfred\'s bertrand.'),
            'Alfred’s bertrand.'
        );
    });

    it('should curl apostrophes when followed by a decade (`80s`)',
        function () {
            equal(
                processor.process('In the \'90s.'),
                'In the ’90s.'
            );
        }
    );

    it('should curl final double quotes when followed by a full stop',
        function () {
            equal(
                processor.process('"Alfred bertrand". Cees.'),
                '“Alfred bertrand”. Cees.'
            );
        }
    );

    it('should curl final single quotes when followed by a full stop',
        function () {
            equal(
                processor.process('\'Alfred bertrand\'. Cees.'),
                '‘Alfred bertrand’. Cees.'
            );
        }
    );
});

describe('En- and em-dashes', function () {
    it('should throw when not given `true`, `false`, `oldschool`, ' +
        '`inverted`, or omitted',
        function () {
            throws(function () {
                retext.use(smartypants, {
                    'dashes': 'test'
                });
            }, /test/);
        }
    );

    it('should not throw when not omitted', function () {
        retext.use(smartypants, {
            'dashes': false
        });
    });

    describe('true', function () {
        it('should replace two dashes with an em-dash', function () {
            equal(
                retext.use(smartypants).process('Alfred--bertrand--cees.'),
                'Alfred—bertrand—cees.'
            );
        });
    })

    describe('oldschool', function () {
        it('should replace two dashes with an en-dash, three dashes with ' +
            'an em-dash',
            function () {
                equal(
                    retext.use(smartypants, {
                        'dashes': 'oldschool'
                    }).process('Alfred--bertrand---cees.'),
                    'Alfred–bertrand—cees.'
                );
            }
        );
    })

    describe('inverted', function () {
        it('should replace two dashes with an em-dash, three dashes with ' +
            'an en-dash',
            function () {
                equal(
                    retext.use(smartypants, {
                        'dashes': 'inverted'
                    }).process('Alfred--bertrand---cees.'),
                    'Alfred—bertrand–cees.'
                );
            }
        );
    })
});

describe('Backticks', function () {
    it('should throw when not given `true`, `false`, `all`, or omitted',
        function () {
            throws(function () {
                retext.use(smartypants, {
                    'backticks': Infinity
                });
            }, /Infinity/);
        }
    );

    it('should not throw when not omitted', function () {
        retext.use(smartypants, {
            'backticks': false
        });
    });

    it('should throw when `all` is combined with `quotes`', function () {
        throws(function () {
            retext.use(smartypants, {
                'backticks': 'all'
            });
        }, /`backticks: all` is not a valid value when `quotes: true`/);
    });

    describe('true', function () {
        var processor = retext.use(smartypants, {
            'quotes': false
        });

        it('should replace two backticks with an opening double quote',
            function () {
                equal(
                    processor.process('``Alfred bertrand.'),
                    '“Alfred bertrand.'
                );
            }
        );

        it('should replace two single quotes with a closing double quote',
            function () {
                equal(
                    processor.process('Alfred\'\' bertrand.'),
                    'Alfred” bertrand.'
                );
            }
        );

        it('should NOT replace a single backtick', function () {
            equal(
                processor.process('`Alfred bertrand.'),
                '`Alfred bertrand.'
            );
        });

        it('should NOT replace a single quote', function () {
            equal(
                processor.process('Alfred\' bertrand.'),
                'Alfred\' bertrand.'
            );
        });
    });

    describe('all', function () {
        var processor = retext.use(smartypants, {
            'backticks': 'all',
            'quotes': false
        });

        it('should replace two backticks with an opening double quote',
            function () {
                equal(
                    processor.process('``Alfred bertrand.'),
                    '“Alfred bertrand.'
                );
            }
        );

        it('should replace two single quotes with a closing double quote',
            function () {
                equal(
                    processor.process('Alfred\'\' bertrand.'),
                    'Alfred” bertrand.'
                );
            }
        );

        it('should replace a single backtick', function () {
            equal(
                processor.process('`Alfred bertrand.'),
                '‘Alfred bertrand.'
            );
        });

        it('should replace a single quote', function () {
            equal(
                processor.process('Alfred\' bertrand.'),
                'Alfred’ bertrand.'
            );
        });
    });
});

describe('Ellipses', function () {
    var processor = retext.use(smartypants);

    it('should throw when not given `true`, `false`, or omitted',
        function () {
            throws(function () {
                retext.use(smartypants, {
                    'ellipses': Math
                });
            }, /\[object Math\]/);
        }
    );

    it('should not throw when not omitted', function () {
        retext.use(smartypants, {
            'ellipses': false
        });
    });

    it('should replace three full stops', function () {
        equal(
            processor.process('Alfred... Bertrand.'),
            'Alfred\u2026 Bertrand.'
        );
    });

    it('should replace three initial full stops', function () {
        equal(
            processor.process('...Alfred Bertrand.'),
            '\u2026Alfred Bertrand.'
        );
    });

    it('should replace three final full stops', function () {
        equal(
            processor.process('Alfred Bertrand...'),
            'Alfred Bertrand\u2026'
        );
    });

    it('should replace three padded full stops', function () {
        equal(
            processor.process('Alfred ... Bertrand.'),
            'Alfred \u2026 Bertrand.'
        );
    });

    it('should replace three padded initial full stops', function () {
        equal(
            processor.process('... Alfred Bertrand.'),
            '\u2026 Alfred Bertrand.'
        );
    });

    it('should replace three padded final full stops', function () {
        equal(
            processor.process('Alfred Bertrand ...'),
            'Alfred Bertrand \u2026'
        );
    });

    it('should replace three padded full stops with spaces', function () {
        equal(
            processor.process('Alfred . . . Bertrand.'),
            'Alfred \u2026 Bertrand.'
        );
    });

    it('should replace three padded initial full stops with spaces',
        function () {
            equal(
                processor.process('. . . Alfred Bertrand.'),
                '\u2026 Alfred Bertrand.'
            );
        }
    );

    it('should replace three padded final full stops with spaces',
        function () {
            equal(
                processor.process('Alfred Bertrand . . .'),
                'Alfred Bertrand \u2026'
            );
        }
    );

    it('should replace three full stops with spaces', function () {
        equal(
            processor.process('Alfred. . . Bertrand.'),
            'Alfred\u2026 Bertrand.'
        );
    });

    it('should replace three initial full stops with spaces',
        function () {
            equal(
                processor.process('. . .Alfred Bertrand.'),
                '\u2026Alfred Bertrand.'
            );
        }
    );

    it('should replace three final full stops with spaces',
        function () {
            equal(
                processor.process('Alfred Bertrand. . .'),
                'Alfred Bertrand\u2026'
            );
        }
    );

    it('should replace more than three full stops', function () {
        equal(
            processor.process('Alfred..... Bertrand.'),
            'Alfred\u2026 Bertrand.'
        );

        equal(
            processor.process('Alfred bertrand....'),
            'Alfred bertrand\u2026'
        );

        equal(
            processor.process('......Alfred bertrand.'),
            '\u2026Alfred bertrand.'
        );
    });

    it('should replace more than three full stops with funky spacing',
        function () {
            equal(
                processor.process('Alfred .. .. . Bertrand.'),
                'Alfred \u2026 Bertrand.'
            );
        }
    );

    it('should NOT replace less than three full stops', function () {
        equal(
            processor.process('Alfred.. Bertrand.'),
            'Alfred.. Bertrand.'
        );

        equal(
            processor.process('Alfred bertrand. .'),
            'Alfred bertrand. .'
        );

        equal(
            processor.process('.Alfred bertrand.'),
            '.Alfred bertrand.'
        );
    });
});
