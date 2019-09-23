import assert from 'assert';
import map from 'lodash/map';
import pad from 'lodash/pad';
import parseOCRFile, { checkSum, parseOCRLine } from './parser';

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
  assert.equal(parseOCRLine(ocrData), '185456789 ERR');
};

// Read and parse a file
export const parseFileTest = () => {
  assert.deepEqual(parseOCRFile('input.txt'), ['185456789 ERR', '123756789 ERR', '123456789']);
};

// Checksum unit test
export const checkSumTest = () => {
  assert.equal(checkSum([1, 1, 1, 1, 1, 1, 1, 1, 1]), 1);
  assert.equal(checkSum([0, 0, 0, 0, 0, 0, 0, 0, 0]), 0);
  assert.equal(checkSum([1, 0, 0, 0, 0, 0, 0, 3, 0]), 4);
};
