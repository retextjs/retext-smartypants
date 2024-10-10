import assert from 'node:assert/strict'
import test from 'node:test'
import {retext} from 'retext'
import retextSmartypants from 'retext-smartypants'

test('retextSmartypants', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('retext-smartypants')).sort(), [
      'default'
    ])
  })
})

test('Curly quotes', async function (t) {
  const processor = retext().use(retextSmartypants)

  await t.test('should not throw when not omitted', async function () {
    assert.doesNotThrow(async function () {
      retext().use(retextSmartypants, {quotes: false}).freeze()
    })
  })

  await t.test('should curl double quotes', async function () {
    assert.equal(
      processor.processSync('Alfred "bertrand" cees.').toString(),
      'Alfred “bertrand” cees.'
    )
  })

  await t.test('should curl single quotes', async function () {
    assert.equal(
      processor.processSync("Alfred 'bertrand' cees.").toString(),
      'Alfred ‘bertrand’ cees.'
    )
  })

  await t.test('should curl initial double quotes', async function () {
    assert.equal(
      processor.processSync('"Alfred" bertrand.').toString(),
      '“Alfred” bertrand.'
    )
  })

  await t.test('should curl initial single quotes', async function () {
    assert.equal(
      processor.processSync("'Alfred' bertrand.").toString(),
      '‘Alfred’ bertrand.'
    )
  })

  await t.test('should curl final double quotes', async function () {
    assert.equal(
      processor.processSync('Alfred "bertrand".').toString(),
      'Alfred “bertrand”.'
    )
  })

  await t.test('should curl final single quotes', async function () {
    assert.equal(
      processor.processSync("Alfred 'bertrand'.").toString(),
      'Alfred ‘bertrand’.'
    )
  })

  await t.test('should curl single quotes in double quotes', async function () {
    assert.equal(
      processor.processSync('"\'Alfred\' bertrand" cees.').toString(),
      '“‘Alfred’ bertrand” cees.'
    )

    assert.equal(
      processor.processSync('"Alfred \'bertrand\'" cees.').toString(),
      '“Alfred ‘bertrand’” cees.'
    )
  })

  await t.test('should curl double quotes in single quotes', async function () {
    assert.equal(
      processor.processSync('\'"Alfred" bertrand\' cees.').toString(),
      '‘“Alfred” bertrand’ cees.'
    )

    assert.equal(
      processor.processSync('\'Alfred "bertrand"\' cees.').toString(),
      '‘Alfred “bertrand”’ cees.'
    )
  })

  await t.test('should curl nested double quotes', async function () {
    assert.equal(
      processor.processSync('"Alfred "bertrand" cees."').toString(),
      '“Alfred “bertrand” cees.”'
    )
  })

  await t.test('should curl nested single quotes', async function () {
    assert.equal(
      processor.processSync("'Alfred 'bertrand' cees.'").toString(),
      '‘Alfred ‘bertrand’ cees.’'
    )
  })

  await t.test(
    'should curl initial double quotes when followed by a full stop',
    async function () {
      assert.equal(
        processor.processSync('Alfred ".bertrand" cees.').toString(),
        'Alfred “.bertrand” cees.'
      )
    }
  )

  await t.test(
    'should curl initial single quotes when followed by a full stop',
    async function () {
      assert.equal(
        processor.processSync("Alfred '.bertrand' cees.").toString(),
        'Alfred ‘.bertrand’ cees.'
      )
    }
  )

  await t.test(
    'should curl initial double quotes when preceded by a full stop',
    async function () {
      assert.equal(
        processor.processSync('Alfred "bertrand." cees.').toString(),
        'Alfred “bertrand.” cees.'
      )
    }
  )

  await t.test(
    'should curl initial single quotes when preceded by a full stop',
    async function () {
      assert.equal(
        processor.processSync("Alfred 'bertrand.' cees.").toString(),
        'Alfred ‘bertrand.’ cees.'
      )
    }
  )

  await t.test(
    'should curl initial double quotes when followed by a multiple ' +
      'full-stops',
    async function () {
      assert.equal(processor.processSync('"..Alfred"').toString(), '“..Alfred”')
    }
  )

  await t.test(
    'should curl initial single quotes when followed by a multiple ' +
      'full-stops',
    async function () {
      assert.equal(processor.processSync("'..Alfred'").toString(), '‘..Alfred’')
    }
  )

  await t.test(
    'should curl final double quotes when followed by a multiple ' +
      'full-stops',
    async function () {
      assert.equal(processor.processSync('"Alfred"..').toString(), '“Alfred”..')
    }
  )

  await t.test(
    'should curl final single quotes when followed by a multiple ' +
      'full-stops',
    async function () {
      assert.equal(processor.processSync("'Alfred'..").toString(), '‘Alfred’..')
    }
  )

  await t.test(
    'should curl final double quotes when followed by a comma',
    async function () {
      assert.equal(
        processor.processSync('"Alfred", bertrand.').toString(),
        '“Alfred”, bertrand.'
      )
    }
  )

  await t.test(
    'should curl final single quotes when followed by a comma',
    async function () {
      assert.equal(
        processor.processSync("'Alfred', bertrand.").toString(),
        '‘Alfred’, bertrand.'
      )
    }
  )

  await t.test('should curl apostrophes when followed `s`', async function () {
    assert.equal(
      processor.processSync("Alfred's bertrand.").toString(),
      'Alfred’s bertrand.'
    )
  })

  await t.test(
    'should curl apostrophes when followed by a decade (`80s`)',
    async function () {
      assert.equal(
        processor.processSync("In the '90s.").toString(),
        'In the ’90s.'
      )
    }
  )

  await t.test(
    'should curl final double quotes when followed by a full stop',
    async function () {
      assert.equal(
        processor.processSync('"Alfred bertrand". Cees.').toString(),
        '“Alfred bertrand”. Cees.'
      )
    }
  )

  await t.test(
    'should curl final single quotes when followed by a full stop',
    async function () {
      assert.equal(
        processor.processSync("'Alfred bertrand'. Cees.").toString(),
        '‘Alfred bertrand’. Cees.'
      )
    }
  )

  await t.test('should use quotes from options', async function () {
    assert.equal(
      retext()
        .use(retextSmartypants, {
          closingQuotes: {double: '»', single: '›'},
          openingQuotes: {double: '«', single: '‹'}
        })
        .processSync('Alfred "bertrand" \'cees\'.')
        .toString(),
      'Alfred «bertrand» ‹cees›.'
    )
  })

  await t.test(
    'should use correct quotes around work breaks',
    async function () {
      assert.equal(processor.processSync('("A.")').toString(), '(“A.”)')
    }
  )

  await t.test(
    'should use correct quotes around work breaks #1',
    async function () {
      assert.equal(processor.processSync('"~a').toString(), '“~a')
    }
  )

  await t.test(
    'should use correct quotes around work breaks #2',
    async function () {
      assert.equal(processor.processSync('"~*').toString(), '”~*')
    }
  )

  await t.test(
    'should use correct quotes around work breaks #3',
    async function () {
      assert.equal(processor.processSync('"~').toString(), '”~')
    }
  )
})

test('En- and em-dashes', async function (t) {
  await t.test('should not throw when not omitted', async function () {
    retext().use(retextSmartypants, {dashes: false}).freeze()
  })

  await t.test('true', async function (t) {
    await t.test(
      'should replace two dashes with an em-dash',
      async function () {
        assert.equal(
          retext()
            .use(retextSmartypants)
            .processSync('Alfred--bertrand--cees.')
            .toString(),
          'Alfred—bertrand—cees.'
        )
      }
    )
  })

  await t.test('oldschool', async function (t) {
    await t.test(
      'should replace two dashes with an en-dash, three dashes with ' +
        'an em-dash',
      async function () {
        assert.equal(
          retext()
            .use(retextSmartypants, {dashes: 'oldschool'})
            .processSync('Alfred--bertrand---cees.')
            .toString(),
          'Alfred–bertrand—cees.'
        )
      }
    )

    await t.test(
      'should turn an en dash + dash into an em-dash',
      async function () {
        assert.equal(
          retext()
            .use(retextSmartypants, {dashes: 'oldschool'})
            .processSync('Alfred–-')
            .toString(),
          'Alfred—'
        )
      }
    )
  })

  await t.test('inverted', async function (t) {
    await t.test(
      'should replace two dashes with an em-dash, three dashes with ' +
        'an en-dash',
      async function () {
        assert.equal(
          retext()
            .use(retextSmartypants, {dashes: 'inverted'})
            .processSync('Alfred--bertrand---cees.')
            .toString(),
          'Alfred—bertrand–cees.'
        )
      }
    )

    await t.test(
      'should turn an em dash + dash into an en-dash',
      async function () {
        assert.equal(
          retext()
            .use(retextSmartypants, {dashes: 'inverted'})
            .processSync('Alfred—-')
            .toString(),
          'Alfred–'
        )
      }
    )
  })
})

test('Backticks', async function (t) {
  await t.test('should not throw when not omitted', async function () {
    retext().use(retextSmartypants, {backticks: false}).freeze()
  })

  await t.test(
    'should throw when `all` is combined with `quotes`',
    async function () {
      assert.throws(function () {
        retext().use(retextSmartypants, {backticks: 'all'}).freeze()
      }, /Cannot accept `backticks: 'all'` with `quotes: true`/)
    }
  )

  await t.test('true', async function (t) {
    const processor = retext().use(retextSmartypants, {quotes: false})

    await t.test(
      'should replace two backticks with an opening double quote',
      async function () {
        assert.equal(
          processor.processSync('``Alfred bertrand.').toString(),
          '“Alfred bertrand.'
        )
      }
    )

    await t.test(
      'should replace two single quotes with a closing double quote',
      async function () {
        assert.equal(
          processor.processSync("Alfred'' bertrand.").toString(),
          'Alfred” bertrand.'
        )
      }
    )

    await t.test('should NOT replace a single backtick', async function () {
      assert.equal(
        processor.processSync('`Alfred bertrand.').toString(),
        '`Alfred bertrand.'
      )
    })

    await t.test('should NOT replace a single quote', async function () {
      assert.equal(
        processor.processSync("Alfred' bertrand.").toString(),
        "Alfred' bertrand."
      )
    })
  })

  await t.test('all', async function (t) {
    const processor = retext().use(retextSmartypants, {
      backticks: 'all',
      quotes: false
    })

    await t.test(
      'should replace two backticks with an opening double quote',
      async function () {
        assert.equal(
          processor.processSync('``Alfred bertrand.').toString(),
          '“Alfred bertrand.'
        )
      }
    )

    await t.test(
      'should replace two single quotes with a closing double quote',
      async function () {
        assert.equal(
          processor.processSync("Alfred'' bertrand.").toString(),
          'Alfred” bertrand.'
        )
      }
    )

    await t.test('should replace a single backtick', async function () {
      assert.equal(
        processor.processSync('`Alfred bertrand.').toString(),
        '‘Alfred bertrand.'
      )
    })

    await t.test('should replace a single quote', async function () {
      assert.equal(
        processor.processSync("Alfred' bertrand.").toString(),
        'Alfred’ bertrand.'
      )
    })
  })
})

test('Ellipses', async function (t) {
  const processor = retext().use(retextSmartypants)

  await t.test('should not throw when not omitted', async function () {
    assert.doesNotThrow(async function () {
      retext().use(retextSmartypants, {ellipses: false}).freeze()
    })
  })

  await t.test('should replace three full stops', async function () {
    assert.equal(
      processor.processSync('Alfred... Bertrand.').toString(),
      'Alfred\u2026 Bertrand.'
    )
  })

  await t.test('should replace three initial full stops', async function () {
    assert.equal(
      processor.processSync('...Alfred Bertrand.').toString(),
      '\u2026Alfred Bertrand.'
    )
  })

  await t.test('should replace three final full stops', async function () {
    assert.equal(
      processor.processSync('Alfred Bertrand...').toString(),
      'Alfred Bertrand\u2026'
    )
  })

  await t.test('should replace three padded full stops', async function () {
    assert.equal(
      processor.processSync('Alfred ... Bertrand.').toString(),
      'Alfred \u2026 Bertrand.'
    )
  })

  await t.test(
    'should replace three padded initial full stops',
    async function () {
      assert.equal(
        processor.processSync('... Alfred Bertrand.').toString(),
        '\u2026 Alfred Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three padded final full stops',
    async function () {
      assert.equal(
        processor.processSync('Alfred Bertrand ...').toString(),
        'Alfred Bertrand \u2026'
      )
    }
  )

  await t.test(
    'should replace three padded full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred . . . Bertrand.').toString(),
        'Alfred \u2026 Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three padded initial full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('. . . Alfred Bertrand.').toString(),
        '\u2026 Alfred Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three padded final full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred Bertrand . . .').toString(),
        'Alfred Bertrand \u2026'
      )
    }
  )

  await t.test(
    'should replace three full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred. . . Bertrand.').toString(),
        'Alfred\u2026 Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three initial full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('. . .Alfred Bertrand.').toString(),
        '\u2026Alfred Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three final full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred Bertrand. . .').toString(),
        'Alfred Bertrand\u2026'
      )
    }
  )

  await t.test('should replace more than three full stops', async function () {
    assert.equal(
      processor.processSync('Alfred..... Bertrand.').toString(),
      'Alfred\u2026 Bertrand.'
    )

    assert.equal(
      processor.processSync('Alfred bertrand....').toString(),
      'Alfred bertrand\u2026'
    )

    assert.equal(
      processor.processSync('......Alfred bertrand.').toString(),
      '\u2026Alfred bertrand.'
    )
  })

  await t.test(
    'should replace more than three full stops with funky spacing',
    async function () {
      assert.equal(
        processor.processSync('Alfred .. .. . Bertrand.').toString(),
        'Alfred \u2026 Bertrand.'
      )
    }
  )

  await t.test(
    'should NOT replace less than three full stops',
    async function () {
      assert.equal(
        processor.processSync('Alfred.. Bertrand.').toString(),
        'Alfred.. Bertrand.'
      )

      assert.equal(
        processor.processSync('Alfred bertrand. .').toString(),
        'Alfred bertrand. .'
      )

      assert.equal(
        processor.processSync('.Alfred bertrand.').toString(),
        '.Alfred bertrand.'
      )
    }
  )
})

test('Ellipses (unspaced)', async function (t) {
  const processor = retext().use(retextSmartypants, {ellipses: 'unspaced'})

  await t.test('should replace three full stops', async function () {
    assert.equal(
      processor.processSync('Alfred... Bertrand.').toString(),
      'Alfred\u2026 Bertrand.'
    )
  })

  await t.test('should replace three initial full stops', async function () {
    assert.equal(
      processor.processSync('...Alfred Bertrand.').toString(),
      '\u2026Alfred Bertrand.'
    )
  })

  await t.test('should replace three final full stops', async function () {
    assert.equal(
      processor.processSync('Alfred Bertrand...').toString(),
      'Alfred Bertrand\u2026'
    )
  })

  await t.test('should replace three padded full stops', async function () {
    assert.equal(
      processor.processSync('Alfred ... Bertrand.').toString(),
      'Alfred \u2026 Bertrand.'
    )
  })

  await t.test(
    'should replace three padded initial full stops',
    async function () {
      assert.equal(
        processor.processSync('... Alfred Bertrand.').toString(),
        '\u2026 Alfred Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three padded final full stops',
    async function () {
      assert.equal(
        processor.processSync('Alfred Bertrand ...').toString(),
        'Alfred Bertrand \u2026'
      )
    }
  )

  await t.test('should replace more than three full stops', async function () {
    assert.equal(
      processor.processSync('Alfred..... Bertrand.').toString(),
      'Alfred\u2026 Bertrand.'
    )

    assert.equal(
      processor.processSync('Alfred bertrand....').toString(),
      'Alfred bertrand\u2026'
    )

    assert.equal(
      processor.processSync('......Alfred bertrand.').toString(),
      '\u2026Alfred bertrand.'
    )
  })

  await t.test(
    'should NOT replace less than three full stops',
    async function () {
      assert.equal(
        processor.processSync('Alfred.. Bertrand.').toString(),
        'Alfred.. Bertrand.'
      )

      assert.equal(
        processor.processSync('Alfred bertrand. .').toString(),
        'Alfred bertrand. .'
      )

      assert.equal(
        processor.processSync('.Alfred bertrand.').toString(),
        '.Alfred bertrand.'
      )
    }
  )
})

test('Ellipses (spaced)', async function (t) {
  const processor = retext().use(retextSmartypants, {ellipses: 'spaced'})

  await t.test(
    'should replace three padded full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred . . . Bertrand.').toString(),
        'Alfred \u2026 Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three padded initial full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('. . . Alfred Bertrand.').toString(),
        '\u2026 Alfred Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three padded final full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred Bertrand . . .').toString(),
        'Alfred Bertrand \u2026'
      )
    }
  )

  await t.test(
    'should replace three full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred. . . Bertrand.').toString(),
        'Alfred\u2026 Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three initial full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('. . .Alfred Bertrand.').toString(),
        '\u2026Alfred Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three final full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred Bertrand. . .').toString(),
        'Alfred Bertrand\u2026'
      )
    }
  )
})
