import { describe, expect, it } from 'vitest';
import { PdfToolError } from '../../src/lib/pdf/errors';
import { chunkPages, formatPageRanges, parsePageRanges, parsePageSelection } from '../../src/lib/pdf/ranges';

describe('parsePageRanges', () => {
  it('parses single pages and ranges into 0-based groups', () => {
    expect(parsePageRanges('1-3, 5, 7-8', 10)).toEqual([[0, 1, 2], [4], [6, 7]]);
  });

  it('supports open ranges and reversed ranges', () => {
    expect(parsePageRanges('8-', 10)).toEqual([[7, 8, 9]]);
    expect(parsePageRanges('-2', 10)).toEqual([[0, 1]]);
    expect(parsePageRanges('3-1', 10)).toEqual([[2, 1, 0]]);
  });

  it('accepts whitespace, semicolons, tildes and newlines', () => {
    expect(parsePageRanges(' 1 ~ 2 ;4\n6', 6)).toEqual([[0, 1], [3], [5]]);
  });

  it.each(['', '0', '11', '1-11', 'abc', '1--2', '-'])('rejects invalid input %j', (input) => {
    expect(() => parsePageRanges(input, 10)).toThrow(PdfToolError);
  });
});

describe('parsePageSelection', () => {
  it('flattens and de-duplicates while keeping input order', () => {
    expect(parsePageSelection('5, 1-3, 2', 5)).toEqual([4, 0, 1, 2]);
  });
});

describe('formatPageRanges', () => {
  it('compresses consecutive pages', () => {
    expect(formatPageRanges([0, 1, 2, 4, 6, 7])).toBe('1-3, 5, 7-8');
    expect(formatPageRanges([3, 1, 2])).toBe('2-4');
    expect(formatPageRanges([])).toBe('');
  });
});

describe('chunkPages', () => {
  it('splits into groups of N pages', () => {
    expect(chunkPages(5, 2)).toEqual([[0, 1], [2, 3], [4]]);
    expect(chunkPages(3, 5)).toEqual([[0, 1, 2]]);
  });
});
