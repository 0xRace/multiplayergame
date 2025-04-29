import { describe, expect, it } from '@jest/globals';
import { add } from './math';

describe('math utils', () => {
  describe('add', () => {
    it('should add two positive numbers correctly', () => {
      expect(add(1, 2)).toBe(3);
    });

    it('should handle negative numbers', () => {
      expect(add(-1, 1)).toBe(0);
      expect(add(-1, -1)).toBe(-2);
    });

    it('should handle zero', () => {
      expect(add(0, 1)).toBe(1);
      expect(add(1, 0)).toBe(1);
      expect(add(0, 0)).toBe(0);
    });
  });
}); 