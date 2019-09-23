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
  | _| _||_||_ |_   ||_||_|
  ||_  _|  | _||_|  ||_| _|
`);

const ocrDataErr = normalizeOCRLine(`
    _  _     _  _  _  _  _
  ||_||_ |_||_ |_   ||_||_|
  ||_| _|  | _||_|  ||_| _|
`);

const ocrDataIll = normalizeOCRLine(`
    _  _     _  _  _  _  _
  | _|  ||_||_ |_   ||_||_|
  ||_  _|  | _||_|  ||_| _|
`);


// Parse a single line
export const parseLineTest = () => {
  assert.equal(parseOCRLine(ocrData), '123456789');
  assert.equal(parseOCRLine(ocrDataErr), '185456789 ERR');
  assert.equal(parseOCRLine(ocrDataIll), '12?456789 ILL');
};

// Read and parse a file
export const parseFileTest = () => {
  assert.deepEqual(parseOCRFile('input.txt'), [
    '185456789 ERR',
    '123756789 ERR',
    '123456789',
    '1?3456789 ILL',
  ]);
};

// Checksum unit test
export const checkSumTest = () => {
  assert.equal(checkSum([1, 1, 1, 1, 1, 1, 1, 1, 1]), 1);
  assert.equal(checkSum([0, 0, 0, 0, 0, 0, 0, 0, 0]), 0);
  assert.equal(checkSum([1, 0, 0, 0, 0, 0, 0, 3, 0]), 4);
};
