/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');

const transpile = (sourcePath) => ts.transpileModule(
    fs.readFileSync(sourcePath, 'utf8'),
    {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2020,
        },
    },
).outputText;

const quizUtilsPath = path.join(os.tmpdir(), `atlas-quiz-utils-${process.pid}.cjs`);
const anatomyUtilsPath = path.join(os.tmpdir(), `atlas-anatomy-utils-${process.pid}.cjs`);
fs.writeFileSync(quizUtilsPath, transpile(path.join(process.cwd(), 'lib', 'quizUtils.ts')), 'utf8');
fs.writeFileSync(anatomyUtilsPath, transpile(path.join(process.cwd(), 'lib', 'anatomyUtils.ts')), 'utf8');

try {
    const { flexMatch, isQuestionIncorrect } = require(quizUtilsPath);
    const { getHighlightParts, muscleMatchesSearch, normalizeSearchText } = require(anatomyUtilsPath);

    assert.equal(flexMatch('Músculo Prócero', 'Musculo Procero'), true);
    assert.equal(flexMatch('fossa escafoide e hamulo pterigoideo', 'hamulo pterigoideo e fossa escafoide'), true);
    assert.equal(flexMatch('Músculo Temporal', 'Músculo Masseter'), false);
    assert.equal(isQuestionIncorrect({ muscleCorrect: true, accidentCorrect: true }), false);
    assert.equal(isQuestionIncorrect({ muscleCorrect: true, accidentCorrect: false }), true);
    assert.equal(normalizeSearchText('Músculo Zigomático'), 'musculo zigomatico');
    assert.equal(muscleMatchesSearch({
        name: 'Músculo Zigomático Maior',
        displayMode: 'standard',
        anatomicalAccident: { title: 'Osso zigomático' },
    }, 'zigoma'), true);
    assert.equal(getHighlightParts('Músculo Prócero', 'musculo procero').some((part) => part.match), true);

    console.log('Testes de quiz aprovados.');
} finally {
    fs.rmSync(quizUtilsPath, { force: true });
    fs.rmSync(anatomyUtilsPath, { force: true });
}
