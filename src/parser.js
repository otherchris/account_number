import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import pad from 'lodash/pad';
import zip from 'lodash/zip';

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
  const rawLinesPlus = ocrData.split('\n');
  // last line is a separator
  const rawLines = rawLinesPlus.slice(0, -1);
  // make sure trailing whitespace has not been trimmed
  return map(rawLines, (x) => pad(x, 27, ' '));
};

// Separate our lines into the chunks relevant
// to a given account number digit.
const chunkLine = (line) => chunk(line.split(''), 3);

// Piece together the nine characters responsible for
// encoding a given digit
const numberCodes = (chunkLists) => {
  const codes = zip(chunkLists[0], chunkLists[1], chunkLists[2]);
  const flatCodes = map(codes, (x) => flatten(x));
  return map(flatCodes, (x) => x.join(''));
};

const parseOCRLine = (str) => {
  const ocrLines = lines(str);
  const chunkedLines = map(ocrLines, (x) => chunkLine(x));
  const codes = numberCodes(chunkedLines);
  const digits = map(codes, (x) => readDigit[x]);
  return digits.join('');
};

export default parseOCRLine;
