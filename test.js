import test from 'tape'
import {retext} from 'retext'
import retextSmartypants from './index.js'

test('Curly quotes', (t) => {
  const processor = retext().use(retextSmartypants)

  t.test('should throw when not given `true`, `false`, or omitted', (st) => {
    st.throws(() => {
      // @ts-expect-error: runtime.
      retext().use(retextSmartypants, {quotes: 1}).freeze()
    }, /1/)

    st.end()
  })

  t.test('should not throw when not omitted', (st) => {
    st.doesNotThrow(() => {
      retext().use(retextSmartypants, {quotes: false}).freeze()
    })

    st.end()
  })

  t.test('should curl double quotes', (st) => {
    st.equal(
      processor.processSync('Alfred "bertrand" cees.').toString(),
      'Alfred “bertrand” cees.'
    )

    st.end()
  })

  t.test('should curl single quotes', (st) => {
    st.equal(
      processor.processSync("Alfred 'bertrand' cees.").toString(),
      'Alfred ‘bertrand’ cees.'
    )

    st.end()
  })

  t.test('should curl initial double quotes', (st) => {
    st.equal(
      processor.processSync('"Alfred" bertrand.').toString(),
      '“Alfred” bertrand.'
    )

    st.end()
  })

  t.test('should curl initial single quotes', (st) => {
    st.equal(
      processor.processSync("'Alfred' bertrand.").toString(),
      '‘Alfred’ bertrand.'
    )

    st.end()
  })

  t.test('should curl final double quotes', (st) => {
    st.equal(
      processor.processSync('Alfred "bertrand".').toString(),
      'Alfred “bertrand”.'
    )

    st.end()
  })

  t.test('should curl final single quotes', (st) => {
    st.equal(
      processor.processSync("Alfred 'bertrand'.").toString(),
      'Alfred ‘bertrand’.'
    )

    st.end()
  })

  t.test('should curl single quotes in double quotes', (st) => {
    st.equal(
      processor.processSync('"\'Alfred\' bertrand" cees.').toString(),
      '“‘Alfred’ bertrand” cees.'
    )

    st.equal(
      processor.processSync('"Alfred \'bertrand\'" cees.').toString(),
      '“Alfred ‘bertrand’” cees.'
    )

    st.end()
  })

  t.test('should curl double quotes in single quotes', (st) => {
    st.equal(
      processor.processSync('\'"Alfred" bertrand\' cees.').toString(),
      '‘“Alfred” bertrand’ cees.'
    )

    st.equal(
      processor.processSync('\'Alfred "bertrand"\' cees.').toString(),
      '‘Alfred “bertrand”’ cees.'
    )

    st.end()
  })

  t.test('should curl nested double quotes', (st) => {
    st.equal(
      processor.processSync('"Alfred "bertrand" cees."').toString(),
      '“Alfred “bertrand” cees.”'
    )

    st.end()
  })

  t.test('should curl nested single quotes', (st) => {
    st.equal(
      processor.processSync("'Alfred 'bertrand' cees.'").toString(),
      '‘Alfred ‘bertrand’ cees.’'
    )

    st.end()
  })

  t.test(
    'should curl initial double quotes when followed by a full stop',
    (st) => {
      st.equal(
        processor.processSync('Alfred ".bertrand" cees.').toString(),
        'Alfred “.bertrand” cees.'
      )

      st.end()
    }
  )

  t.test(
    'should curl initial single quotes when followed by a full stop',
    (st) => {
      st.equal(
        processor.processSync("Alfred '.bertrand' cees.").toString(),
        'Alfred ‘.bertrand’ cees.'
      )

      st.end()
    }
  )

  t.test(
    'should curl initial double quotes when preceded by a full stop',
    (st) => {
      st.equal(
        processor.processSync('Alfred "bertrand." cees.').toString(),
        'Alfred “bertrand.” cees.'
      )

      st.end()
    }
  )

  t.test(
    'should curl initial single quotes when preceded by a full stop',
    (st) => {
      st.equal(
        processor.processSync("Alfred 'bertrand.' cees.").toString(),
        'Alfred ‘bertrand.’ cees.'
      )

      st.end()
    }
  )

  t.test(
    'should curl initial double quotes when followed by a multiple ' +
      'full-stops',
    (st) => {
      st.equal(processor.processSync('"..Alfred"').toString(), '“..Alfred”')

      st.end()
    }
  )

  t.test(
    'should curl initial single quotes when followed by a multiple ' +
      'full-stops',
    (st) => {
      st.equal(processor.processSync("'..Alfred'").toString(), '‘..Alfred’')

      st.end()
    }
  )

  t.test(
    'should curl final double quotes when followed by a multiple ' +
      'full-stops',
    (st) => {
      st.equal(processor.processSync('"Alfred"..').toString(), '“Alfred”..')

      st.end()
    }
  )

  t.test(
    'should curl final single quotes when followed by a multiple ' +
      'full-stops',
    (st) => {
      st.equal(processor.processSync("'Alfred'..").toString(), '‘Alfred’..')

      st.end()
    }
  )

  t.test('should curl final double quotes when followed by a comma', (st) => {
    st.equal(
      processor.processSync('"Alfred", bertrand.').toString(),
      '“Alfred”, bertrand.'
    )

    st.end()
  })

  t.test('should curl final single quotes when followed by a comma', (st) => {
    st.equal(
      processor.processSync("'Alfred', bertrand.").toString(),
      '‘Alfred’, bertrand.'
    )

    st.end()
  })

  t.test('should curl apostrophes when followed `s`', (st) => {
    st.equal(
      processor.processSync("Alfred's bertrand.").toString(),
      'Alfred’s bertrand.'
    )

    st.end()
  })

  t.test('should curl apostrophes when followed by a decade (`80s`)', (st) => {
    st.equal(processor.processSync("In the '90s.").toString(), 'In the ’90s.')

    st.end()
  })

  t.test(
    'should curl final double quotes when followed by a full stop',
    (st) => {
      st.equal(
        processor.processSync('"Alfred bertrand". Cees.').toString(),
        '“Alfred bertrand”. Cees.'
      )

      st.end()
    }
  )

  t.test(
    'should curl final single quotes when followed by a full stop',
    (st) => {
      st.equal(
        processor.processSync("'Alfred bertrand'. Cees.").toString(),
        '‘Alfred bertrand’. Cees.'
      )

      st.end()
    }
  )

  t.end()
})

test('En- and em-dashes', (t) => {
  t.test(
    'should throw when not given `true`, `false`, `oldschool`, ' +
      '`inverted`, or omitted',
    (st) => {
      st.throws(() => {
        // @ts-expect-error: runtime.
        retext().use(retextSmartypants, {dashes: 'test'}).freeze()
      }, /test/)

      st.end()
    }
  )

  t.test('should not throw when not omitted', (st) => {
    retext().use(retextSmartypants, {dashes: false}).freeze()

    st.end()
  })

  t.test('true', (st) => {
    st.test('should replace two dashes with an em-dash', (sst) => {
      sst.equal(
        retext()
          .use(retextSmartypants)
          .processSync('Alfred--bertrand--cees.')
          .toString(),
        'Alfred—bertrand—cees.'
      )

      sst.end()
    })

    st.end()
  })

  t.test('oldschool', (st) => {
    t.test(
      'should replace two dashes with an en-dash, three dashes with ' +
        'an em-dash',
      (sst) => {
        sst.equal(
          retext()
            .use(retextSmartypants, {dashes: 'oldschool'})
            .processSync('Alfred--bertrand---cees.')
            .toString(),
          'Alfred–bertrand—cees.'
        )

        sst.end()
      }
    )

    st.end()
  })

  t.test('inverted', (st) => {
    t.test(
      'should replace two dashes with an em-dash, three dashes with ' +
        'an en-dash',
      (sst) => {
        sst.equal(
          retext()
            .use(retextSmartypants, {dashes: 'inverted'})
            .processSync('Alfred--bertrand---cees.')
            .toString(),
          'Alfred—bertrand–cees.'
        )

        sst.end()
      }
    )

    st.end()
  })

  t.end()
})

test('Backticks', (t) => {
  t.test(
    'should throw when not given `true`, `false`, `all`, or omitted',
    (st) => {
      st.throws(() => {
        retext()
          // @ts-expect-error: runtime.
          .use(retextSmartypants, {backticks: Number.POSITIVE_INFINITY})
          .freeze()
      }, /Infinity/)

      st.end()
    }
  )

  t.test('should not throw when not omitted', (st) => {
    retext().use(retextSmartypants, {backticks: false}).freeze()

    st.end()
  })

  t.test('should throw when `all` is combined with `quotes`', (st) => {
    st.throws(() => {
      retext().use(retextSmartypants, {backticks: 'all'}).freeze()
    }, /`backticks: all` is not a valid value when `quotes: true`/)

    st.end()
  })

  t.test('true', (st) => {
    const processor = retext().use(retextSmartypants, {quotes: false})

    st.test(
      'should replace two backticks with an opening double quote',
      (sst) => {
        sst.equal(
          processor.processSync('``Alfred bertrand.').toString(),
          '“Alfred bertrand.'
        )

        sst.end()
      }
    )

    st.test(
      'should replace two single quotes with a closing double quote',
      (sst) => {
        sst.equal(
          processor.processSync("Alfred'' bertrand.").toString(),
          'Alfred” bertrand.'
        )

        sst.end()
      }
    )

    st.test('should NOT replace a single backtick', (sst) => {
      sst.equal(
        processor.processSync('`Alfred bertrand.').toString(),
        '`Alfred bertrand.'
      )

      sst.end()
    })

    st.test('should NOT replace a single quote', (sst) => {
      sst.equal(
        processor.processSync("Alfred' bertrand.").toString(),
        "Alfred' bertrand."
      )

      sst.end()
    })
  })

  t.test('all', (st) => {
    const processor = retext().use(retextSmartypants, {
      backticks: 'all',
      quotes: false
    })

    st.test(
      'should replace two backticks with an opening double quote',
      (sst) => {
        sst.equal(
          processor.processSync('``Alfred bertrand.').toString(),
          '“Alfred bertrand.'
        )

        sst.end()
      }
    )

    st.test(
      'should replace two single quotes with a closing double quote',
      (sst) => {
        sst.equal(
          processor.processSync("Alfred'' bertrand.").toString(),
          'Alfred” bertrand.'
        )

        sst.end()
      }
    )

    st.test('should replace a single backtick', (sst) => {
      sst.equal(
        processor.processSync('`Alfred bertrand.').toString(),
        '‘Alfred bertrand.'
      )

      sst.end()
    })

    st.test('should replace a single quote', (sst) => {
      sst.equal(
        processor.processSync("Alfred' bertrand.").toString(),
        'Alfred’ bertrand.'
      )

      sst.end()
    })

    st.end()
  })

  t.end()
})

test('Ellipses', (t) => {
  const processor = retext().use(retextSmartypants)

  t.test('should throw when not given `true`, `false`, or omitted', (st) => {
    st.throws(() => {
      // @ts-expect-error: runtime.
      retext().use(retextSmartypants, {ellipses: Math}).freeze()
    }, /\[object Math]/)

    st.end()
  })

  t.test('should not throw when not omitted', (st) => {
    st.doesNotThrow(() => {
      retext().use(retextSmartypants, {ellipses: false}).freeze()
    })

    st.end()
  })

  t.test('should replace three full stops', (st) => {
    st.equal(
      processor.processSync('Alfred... Bertrand.').toString(),
      'Alfred\u2026 Bertrand.'
    )

    st.end()
  })

  t.test('should replace three initial full stops', (st) => {
    st.equal(
      processor.processSync('...Alfred Bertrand.').toString(),
      '\u2026Alfred Bertrand.'
    )

    st.end()
  })

  t.test('should replace three final full stops', (st) => {
    st.equal(
      processor.processSync('Alfred Bertrand...').toString(),
      'Alfred Bertrand\u2026'
    )

    st.end()
  })

  t.test('should replace three padded full stops', (st) => {
    st.equal(
      processor.processSync('Alfred ... Bertrand.').toString(),
      'Alfred \u2026 Bertrand.'
    )

    st.end()
  })

  t.test('should replace three padded initial full stops', (st) => {
    st.equal(
      processor.processSync('... Alfred Bertrand.').toString(),
      '\u2026 Alfred Bertrand.'
    )

    st.end()
  })

  t.test('should replace three padded final full stops', (st) => {
    st.equal(
      processor.processSync('Alfred Bertrand ...').toString(),
      'Alfred Bertrand \u2026'
    )

    st.end()
  })

  t.test('should replace three padded full stops with spaces', (st) => {
    st.equal(
      processor.processSync('Alfred . . . Bertrand.').toString(),
      'Alfred \u2026 Bertrand.'
    )

    st.end()
  })

  t.test('should replace three padded initial full stops with spaces', (st) => {
    st.equal(
      processor.processSync('. . . Alfred Bertrand.').toString(),
      '\u2026 Alfred Bertrand.'
    )

    st.end()
  })

  t.test('should replace three padded final full stops with spaces', (st) => {
    st.equal(
      processor.processSync('Alfred Bertrand . . .').toString(),
      'Alfred Bertrand \u2026'
    )

    st.end()
  })

  t.test('should replace three full stops with spaces', (st) => {
    st.equal(
      processor.processSync('Alfred. . . Bertrand.').toString(),
      'Alfred\u2026 Bertrand.'
    )

    st.end()
  })

  t.test('should replace three initial full stops with spaces', (st) => {
    st.equal(
      processor.processSync('. . .Alfred Bertrand.').toString(),
      '\u2026Alfred Bertrand.'
    )

    st.end()
  })

  t.test('should replace three final full stops with spaces', (st) => {
    st.equal(
      processor.processSync('Alfred Bertrand. . .').toString(),
      'Alfred Bertrand\u2026'
    )

    st.end()
  })

  t.test('should replace more than three full stops', (st) => {
    st.equal(
      processor.processSync('Alfred..... Bertrand.').toString(),
      'Alfred\u2026 Bertrand.'
    )

    st.equal(
      processor.processSync('Alfred bertrand....').toString(),
      'Alfred bertrand\u2026'
    )

    st.equal(
      processor.processSync('......Alfred bertrand.').toString(),
      '\u2026Alfred bertrand.'
    )

    st.end()
  })

  t.test(
    'should replace more than three full stops with funky spacing',
    (st) => {
      st.equal(
        processor.processSync('Alfred .. .. . Bertrand.').toString(),
        'Alfred \u2026 Bertrand.'
      )

      st.end()
    }
  )

  t.test('should NOT replace less than three full stops', (st) => {
    st.equal(
      processor.processSync('Alfred.. Bertrand.').toString(),
      'Alfred.. Bertrand.'
    )

    st.equal(
      processor.processSync('Alfred bertrand. .').toString(),
      'Alfred bertrand. .'
    )

    st.equal(
      processor.processSync('.Alfred bertrand.').toString(),
      '.Alfred bertrand.'
    )

    st.end()
  })

  t.end()
})
