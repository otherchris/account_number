import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import keys from 'lodash/keys';
import map from 'lodash/map';
import pad from 'lodash/pad';
import reduce from 'lodash/reduce';
import zip from 'lodash/zip';
import fs from 'fs';

const readDigitData = {
  '     |  |': 1,
  ' _  _||_ ': 2,
  ' _  _| _|': 3,
  '   |_|  |': 4,
  ' _ |_  _|': 5,
  ' _ |_ |_|': 6,
  ' _   |  |': 7,
  ' _ |_||_|': 8,
  ' _ |_| _|': 9,
  ' _ | ||_|': 0,
};

const readDigit = (str) => {
  if (keys(readDigitData).indexOf(str) === -1) {
    return '?';
  }
  return readDigitData[str];
};

const lines = (ocrData) => {
  // make an array of lines
  const rawLines = ocrData.split('\n');
  // make sure trailing whitespace has not been trimmed
  return map(rawLines, (x) => pad(x, 27, ' '));
};

// Piece together the nine characters responsible for
// encoding a given digit
const numberCodes = (chunkLists) => {
  const codes = zip(chunkLists[0], chunkLists[1], chunkLists[2]);
  const flatCodes = map(codes, (x) => flatten(x));
  return map(flatCodes, (x) => x.join(''));
};

const output = (acctNum, chkSm) => {
  if (chkSm === 0) {
    return acctNum;
  }
  return `${acctNum} ERR`;
};

export const checkSum = (digitList) => {
  const pairs = zip([9, 8, 7, 6, 5, 4, 3, 2, 1], digitList);
  const values = map(pairs, (x) => x[0] * x[1]);
  return reduce(values, (acc, x) => (acc + x) % 11, 0);
};

export const parseOCRLine = (ocrLines) => {
  const chunkedLines = map(ocrLines, (x) => chunk(x, 3));
  const codes = numberCodes(chunkedLines);
  const digits = map(codes, (x) => readDigit(x));
  if (digits.indexOf('?') !== -1) {
    return `${digits.join('')} ILL`;
  }
  const acctNum = digits.join('');
  return output(acctNum, checkSum(digits));
};

const parseOCRFile = (filepath) => {
  const fileContents = fs.readFileSync(filepath, 'utf-8');
  const allLines = lines(fileContents);
  const ocrResultsRaw = chunk(allLines, 4);
  // trim last line of each chunk
  const ocrResults = map(ocrResultsRaw, (x) => x.slice(0, -1));
  return map(ocrResults, (x) => parseOCRLine(x));
};

export default parseOCRFile;
