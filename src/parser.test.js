import assert from 'assert';
import map from 'lodash/map';
import pad from 'lodash/pad';
import parseOCRFile, { parseOCRLine } from './parser';

// allow us to write test cases legibly
const normalizeOCRLine = (ocrLine) => {
  // drop leading line
  const fixedString = ocrLine.substring(ocrLine.indexOf('\n') + 1);
  // split into lines
  const stringLines = fixedString.split('\n');
  // pad to length
  const fullStringLines = map(stringLines, (x) => pad(x, 27, ' '));
  // split to characters
  return map(fullStringLines, (x) => x.split(''));
};

const ocrData = normalizeOCRLine(`
    _  _     _  _  _  _  _
  ||_||_ |_||_ |_   ||_||_|
  ||_| _|  | _||_|  ||_| _|
`);

// Parse a single line
export const parseLineTest = () => {
  assert.equal(parseOCRLine(ocrData), '185456789');
};

// Read and parse a file
export const parseFileTest = () => {
  assert.deepEqual(parseOCRFile('input.txt'), ['185456789', '123756789', '123456789']);
};
