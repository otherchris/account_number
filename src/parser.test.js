import assert from 'assert';
import parseOCRLine from './parser';

// allow us to write test cases legibly
const normalizeOCRLine = (ocrLine) => ocrLine.substring(ocrLine.indexOf('\n') + 1);

const ocrData = normalizeOCRLine(`
    _  _     _  _  _  _  _
  ||_||_ |_||_ |_   ||_||_|
  ||_| _|  | _||_|  ||_| _|
`);

const parserTest = () => {
  assert.equal(parseOCRLine(ocrData), '185456789');
};

export default parserTest;
