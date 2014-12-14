'use strict';

var Retext,
    smartypants;

/**
 * Dependencies.
 */

Retext = require('retext');
smartypants = require('./');

/**
 * Dependencies.
 */

var retext,
    retextWithSmartypants;

retext = new Retext();
retextWithSmartypants = new Retext().use(smartypants);

/**
 * Test data: A (big?) article (w/ 100 paragraphs, 500
 * sentences, 10,000 words);
 *
 * Source:
 *   http://www.gutenberg.org/files/10745/10745-h/10745-h.htm
 */

var sentence,
    paragraph,
    section;

sentence = 'Where she had stood was clear, and she was gone since Sir ' +
    'Kay does not choose to assume my quarrel.';

paragraph = 'Thou art a churlish knight to so affront a lady ' +
    'he could not sit upon his horse any longer. ' +
    'For methinks something hath befallen my lord and that he ' +
    'then, after a while, he cried out in great voice. ' +
    'For that light in the sky lieth in the south ' +
    'then Queen Helen fell down in a swoon, and lay. ' +
    'Touch me not, for I am not mortal, but Fay ' +
    'so the Lady of the Lake vanished away, everything behind. ' +
    sentence;

section = paragraph + Array(10).join('\n\n' + paragraph);

suite('retext w/o retext-smartypants', function () {
    bench('A paragraph (5 sentences, 100 words)', function (done) {
        retext.parse(paragraph, done);
    });

    bench('A section (10 paragraphs, 50 sentences, 1,000 words)',
        function (done) {
            retext.parse(section, done);
        }
    );
});

suite('retext w/ retext-smartypants', function () {
    bench('A paragraph (5 sentences, 100 words)', function (done) {
        retextWithSmartypants.parse(paragraph, done);
    });

    bench('A section (10 paragraphs, 50 sentences, 1,000 words)',
        function (done) {
            retextWithSmartypants.parse(section, done);
        }
    );
});
