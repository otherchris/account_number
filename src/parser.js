import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import pad from 'lodash/pad';
import zip from 'lodash/zip';
import fs from 'fs';

const readDigit = {
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

export const parseOCRLine = (ocrLines) => {
  const chunkedLines = map(ocrLines, (x) => chunk(x, 3));
  const codes = numberCodes(chunkedLines);
  const digits = map(codes, (x) => readDigit[x]);
  return digits.join('');
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
