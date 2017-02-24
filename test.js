'use strict';

var test = require('tape');
var retext = require('retext');
var smartypants = require('./');

test('Curly quotes', function (t) {
  var processor = retext().use(smartypants);

  t.test('should throw when not given `true`, `false`, or omitted',
    function (st) {
      st.throws(function () {
        retext().use(smartypants, {quotes: 1}).freeze();
      }, /1/);

      st.end();
    }
  );

  t.test('should not throw when not omitted', function (st) {
    st.doesNotThrow(function () {
      retext().use(smartypants, {quotes: false}).freeze();
    });

    st.end();
  });

  t.test('should curl double quotes', function (st) {
    st.equal(
      processor.processSync('Alfred "bertrand" cees.').toString(),
      'Alfred “bertrand” cees.'
    );

    st.end();
  });

  t.test('should curl single quotes', function (st) {
    st.equal(
      processor.processSync('Alfred \'bertrand\' cees.').toString(),
      'Alfred ‘bertrand’ cees.'
    );

    st.end();
  });

  t.test('should curl initial double quotes', function (st) {
    st.equal(
      processor.processSync('"Alfred" bertrand.').toString(),
      '“Alfred” bertrand.'
    );

    st.end();
  });

  t.test('should curl initial single quotes', function (st) {
    st.equal(
      processor.processSync('\'Alfred\' bertrand.').toString(),
      '‘Alfred’ bertrand.'
    );

    st.end();
  });

  t.test('should curl final double quotes', function (st) {
    st.equal(
      processor.processSync('Alfred "bertrand".').toString(),
      'Alfred “bertrand”.'
    );

    st.end();
  });

  t.test('should curl final single quotes', function (st) {
    st.equal(
      processor.processSync('Alfred \'bertrand\'.').toString(),
      'Alfred ‘bertrand’.'
    );

    st.end();
  });

  t.test('should curl single quotes in double quotes', function (st) {
    st.equal(
      processor.processSync('"\'Alfred\' bertrand" cees.').toString(),
      '“‘Alfred’ bertrand” cees.'
    );

    st.equal(
      processor.processSync('"Alfred \'bertrand\'" cees.').toString(),
      '“Alfred ‘bertrand’” cees.'
    );

    st.end();
  });

  t.test('should curl double quotes in single quotes', function (st) {
    st.equal(
      processor.processSync('\'"Alfred" bertrand\' cees.').toString(),
      '‘“Alfred” bertrand’ cees.'
    );

    st.equal(
      processor.processSync('\'Alfred "bertrand"\' cees.').toString(),
      '‘Alfred “bertrand”’ cees.'
    );

    st.end();
  });

  t.test('should curl nested double quotes', function (st) {
    st.equal(
      processor.processSync('"Alfred "bertrand" cees."').toString(),
      '“Alfred “bertrand” cees.”'
    );

    st.end();
  });

  t.test('should curl nested single quotes', function (st) {
    st.equal(
      processor.processSync('\'Alfred \'bertrand\' cees.\'').toString(),
      '‘Alfred ‘bertrand’ cees.’'
    );

    st.end();
  });

  t.test('should curl initial double quotes when followed by a full stop',
    function (st) {
      st.equal(
        processor.processSync('Alfred ".bertrand" cees.').toString(),
        'Alfred “.bertrand” cees.'
      );

      st.end();
    }
  );

  t.test('should curl initial single quotes when followed by a full stop',
    function (st) {
      st.equal(
        processor.processSync('Alfred \'.bertrand\' cees.').toString(),
        'Alfred ‘.bertrand’ cees.'
      );

      st.end();
    }
  );

  t.test('should curl initial double quotes when preceded by a full stop',
    function (st) {
      st.equal(
        processor.processSync('Alfred "bertrand." cees.').toString(),
        'Alfred “bertrand.” cees.'
      );

      st.end();
    }
  );

  t.test('should curl initial single quotes when preceded by a full stop',
    function (st) {
      st.equal(
        processor.processSync('Alfred \'bertrand.\' cees.').toString(),
        'Alfred ‘bertrand.’ cees.'
      );

      st.end();
    }
  );

  t.test(
    'should curl initial double quotes when followed by a multiple ' +
    'full-stops',
    function (st) {
      st.equal(
        processor.processSync('"..Alfred"').toString(),
        '“..Alfred”'
      );

      st.end();
    }
  );

  t.test(
    'should curl initial single quotes when followed by a multiple ' +
    'full-stops',
    function (st) {
      st.equal(
        processor.processSync('\'..Alfred\'').toString(),
        '‘..Alfred’'
      );

      st.end();
    }
  );

  t.test(
    'should curl final double quotes when followed by a multiple ' +
    'full-stops',
    function (st) {
      st.equal(
        processor.processSync('"Alfred"..').toString(),
        '“Alfred”..'
      );

      st.end();
    }
  );

  t.test(
    'should curl final single quotes when followed by a multiple ' +
    'full-stops',
    function (st) {
      st.equal(
        processor.processSync('\'Alfred\'..').toString(),
        '‘Alfred’..'
      );

      st.end();
    }
  );

  t.test(
    'should curl final double quotes when followed by a comma',
    function (st) {
      st.equal(
        processor.processSync('"Alfred", bertrand.').toString(),
        '“Alfred”, bertrand.'
      );

      st.end();
    }
  );

  t.test(
    'should curl final single quotes when followed by a comma',
    function (st) {
      st.equal(
        processor.processSync('\'Alfred\', bertrand.').toString(),
        '‘Alfred’, bertrand.'
      );

      st.end();
    }
  );

  t.test('should curl apostrophes when followed `s`', function (st) {
    st.equal(
      processor.processSync('Alfred\'s bertrand.').toString(),
      'Alfred’s bertrand.'
    );

    st.end();
  });

  t.test('should curl apostrophes when followed by a decade (`80s`)',
    function (st) {
      st.equal(
        processor.processSync('In the \'90s.').toString(),
        'In the ’90s.'
      );

      st.end();
    }
  );

  t.test('should curl final double quotes when followed by a full stop',
    function (st) {
      st.equal(
        processor.processSync('"Alfred bertrand". Cees.').toString(),
        '“Alfred bertrand”. Cees.'
      );

      st.end();
    }
  );

  t.test(
    'should curl final single quotes when followed by a full stop',
    function (st) {
      st.equal(
        processor.processSync('\'Alfred bertrand\'. Cees.').toString(),
        '‘Alfred bertrand’. Cees.'
      );

      st.end();
    }
  );

  t.end();
});

test('En- and em-dashes', function (t) {
  t.test(
    'should throw when not given `true`, `false`, `oldschool`, ' +
    '`inverted`, or omitted',
    function (st) {
      st.throws(function () {
        retext().use(smartypants, {dashes: 'test'}).freeze();
      }, /test/);

      st.end();
    }
  );

  t.test('should not throw when not omitted', function (st) {
    retext().use(smartypants, {dashes: false}).freeze();

    st.end();
  });

  t.test('true', function (st) {
    st.test('should replace two dashes with an em-dash', function (sst) {
      sst.equal(
        retext().use(smartypants).processSync('Alfred--bertrand--cees.').toString(),
        'Alfred—bertrand—cees.'
      );

      sst.end();
    });

    st.end();
  });

  t.test('oldschool', function (st) {
    t.test(
      'should replace two dashes with an en-dash, three dashes with ' +
      'an em-dash',
      function (sst) {
        sst.equal(
          retext()
            .use(smartypants, {dashes: 'oldschool'})
            .processSync('Alfred--bertrand---cees.')
            .toString(),
          'Alfred–bertrand—cees.'
        );

        sst.end();
      }
    );

    st.end();
  });

  t.test('inverted', function (st) {
    t.test(
      'should replace two dashes with an em-dash, three dashes with ' +
      'an en-dash',
      function (sst) {
        sst.equal(
          retext()
            .use(smartypants, {dashes: 'inverted'})
            .processSync('Alfred--bertrand---cees.')
            .toString(),
          'Alfred—bertrand–cees.'
        );

        sst.end();
      }
    );

    st.end();
  });

  t.end();
});

test('Backticks', function (t) {
  t.test(
    'should throw when not given `true`, `false`, `all`, or omitted',
    function (st) {
      st.throws(function () {
        retext().use(smartypants, {backticks: Infinity}).freeze();
      }, /Infinity/);

      st.end();
    }
  );

  t.test('should not throw when not omitted', function (st) {
    retext().use(smartypants, {backticks: false}).freeze();

    st.end();
  });

  t.test('should throw when `all` is combined with `quotes`', function (st) {
    st.throws(function () {
      retext().use(smartypants, {backticks: 'all'}).freeze();
    }, /`backticks: all` is not a valid value when `quotes: true`/);

    st.end();
  });

  t.test('true', function (st) {
    var processor = retext().use(smartypants, {quotes: false});

    st.test(
      'should replace two backticks with an opening double quote',
      function (sst) {
        sst.equal(
          processor.processSync('``Alfred bertrand.').toString(),
          '“Alfred bertrand.'
        );

        sst.end();
      }
    );

    st.test(
      'should replace two single quotes with a closing double quote',
      function (sst) {
        sst.equal(
          processor.processSync('Alfred\'\' bertrand.').toString(),
          'Alfred” bertrand.'
        );

        sst.end();
      }
    );

    st.test('should NOT replace a single backtick', function (sst) {
      sst.equal(
        processor.processSync('`Alfred bertrand.').toString(),
        '`Alfred bertrand.'
      );

      sst.end();
    });

    st.test('should NOT replace a single quote', function (sst) {
      sst.equal(
        processor.processSync('Alfred\' bertrand.').toString(),
        'Alfred\' bertrand.'
      );

      sst.end();
    });
  });

  t.test('all', function (st) {
    var processor = retext().use(smartypants, {
      backticks: 'all',
      quotes: false
    });

    st.test(
      'should replace two backticks with an opening double quote',
      function (sst) {
        sst.equal(
          processor.processSync('``Alfred bertrand.').toString(),
          '“Alfred bertrand.'
        );

        sst.end();
      }
    );

    st.test('should replace two single quotes with a closing double quote',
      function (sst) {
        sst.equal(
          processor.processSync('Alfred\'\' bertrand.').toString(),
          'Alfred” bertrand.'
        );

        sst.end();
      }
    );

    st.test('should replace a single backtick', function (sst) {
      sst.equal(
        processor.processSync('`Alfred bertrand.').toString(),
        '‘Alfred bertrand.'
      );

      sst.end();
    });

    st.test('should replace a single quote', function (sst) {
      sst.equal(
        processor.processSync('Alfred\' bertrand.').toString(),
        'Alfred’ bertrand.'
      );

      sst.end();
    });

    st.end();
  });

  t.end();
});

test('Ellipses', function (t) {
  var processor = retext().use(smartypants);

  t.test(
    'should throw when not given `true`, `false`, or omitted',
    function (st) {
      st.throws(
        function () {
          retext().use(smartypants, {ellipses: Math}).freeze();
        },
        /\[object Math]/
      );

      st.end();
    }
  );

  t.test('should not throw when not omitted', function (st) {
    st.doesNotThrow(function () {
      retext().use(smartypants, {ellipses: false}).freeze();
    });

    st.end();
  });

  t.test('should replace three full stops', function (st) {
    st.equal(
      processor.processSync('Alfred... Bertrand.').toString(),
      'Alfred\u2026 Bertrand.'
    );

    st.end();
  });

  t.test('should replace three initial full stops', function (st) {
    st.equal(
      processor.processSync('...Alfred Bertrand.').toString(),
      '\u2026Alfred Bertrand.'
    );

    st.end();
  });

  t.test('should replace three final full stops', function (st) {
    st.equal(
      processor.processSync('Alfred Bertrand...').toString(),
      'Alfred Bertrand\u2026'
    );

    st.end();
  });

  t.test('should replace three padded full stops', function (st) {
    st.equal(
      processor.processSync('Alfred ... Bertrand.').toString(),
      'Alfred \u2026 Bertrand.'
    );

    st.end();
  });

  t.test('should replace three padded initial full stops', function (st) {
    st.equal(
      processor.processSync('... Alfred Bertrand.').toString(),
      '\u2026 Alfred Bertrand.'
    );

    st.end();
  });

  t.test('should replace three padded final full stops', function (st) {
    st.equal(
      processor.processSync('Alfred Bertrand ...').toString(),
      'Alfred Bertrand \u2026'
    );

    st.end();
  });

  t.test('should replace three padded full stops with spaces', function (st) {
    st.equal(
      processor.processSync('Alfred . . . Bertrand.').toString(),
      'Alfred \u2026 Bertrand.'
    );

    st.end();
  });

  t.test('should replace three padded initial full stops with spaces',
    function (st) {
      st.equal(
        processor.processSync('. . . Alfred Bertrand.').toString(),
        '\u2026 Alfred Bertrand.'
      );

      st.end();
    }
  );

  t.test('should replace three padded final full stops with spaces',
    function (st) {
      st.equal(
        processor.processSync('Alfred Bertrand . . .').toString(),
        'Alfred Bertrand \u2026'
      );

      st.end();
    }
  );

  t.test('should replace three full stops with spaces', function (st) {
    st.equal(
      processor.processSync('Alfred. . . Bertrand.').toString(),
      'Alfred\u2026 Bertrand.'
    );

    st.end();
  });

  t.test('should replace three initial full stops with spaces',
    function (st) {
      st.equal(
        processor.processSync('. . .Alfred Bertrand.').toString(),
        '\u2026Alfred Bertrand.'
      );

      st.end();
    }
  );

  t.test('should replace three final full stops with spaces',
    function (st) {
      st.equal(
        processor.processSync('Alfred Bertrand. . .').toString(),
        'Alfred Bertrand\u2026'
      );

      st.end();
    }
  );

  t.test('should replace more than three full stops', function (st) {
    st.equal(
      processor.processSync('Alfred..... Bertrand.').toString(),
      'Alfred\u2026 Bertrand.'
    );

    st.equal(
      processor.processSync('Alfred bertrand....').toString(),
      'Alfred bertrand\u2026'
    );

    st.equal(
      processor.processSync('......Alfred bertrand.').toString(),
      '\u2026Alfred bertrand.'
    );

    st.end();
  });

  t.test('should replace more than three full stops with funky spacing',
    function (st) {
      st.equal(
        processor.processSync('Alfred .. .. . Bertrand.').toString(),
        'Alfred \u2026 Bertrand.'
      );

      st.end();
    }
  );

  t.test('should NOT replace less than three full stops', function (st) {
    st.equal(
      processor.processSync('Alfred.. Bertrand.').toString(),
      'Alfred.. Bertrand.'
    );

    st.equal(
      processor.processSync('Alfred bertrand. .').toString(),
      'Alfred bertrand. .'
    );

    st.equal(
      processor.processSync('.Alfred bertrand.').toString(),
      '.Alfred bertrand.'
    );

    st.end();
  });

  t.end();
});
