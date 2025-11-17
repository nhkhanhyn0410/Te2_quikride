const {
  generateSeatLayout,
  generateAisleLayout,
  generateSleeperLayout,
  generateLimousineLayout,
  generateDoubleDecker,
  countSeats,
  validateLayoutDimensions,
  checkDuplicateSeats,
  getSeatPosition,
  getAllSeats,
  layoutToString,
  transposeLayout,
  mirrorLayout,
  mergeLayouts,
  validateSeatLayoutForBusType,
} = require('../../../src/utils/seatLayout');

describe('Seat Layout Utilities', () => {
  describe('generateSeatLayout', () => {
    it('should generate basic seat layout with correct dimensions', () => {
      const layout = generateSeatLayout(3, 4);

      expect(layout.length).toBe(3); // 3 rows
      expect(layout[0].length).toBe(4); // 4 columns
      expect(layout[0][0]).toBe('A1');
      expect(layout[2][3]).toBe('C4');
    });

    it('should generate layout with empty positions', () => {
      const layout = generateSeatLayout(2, 3, null, [[0, 1], [1, 2]]);

      expect(layout[0][1]).toBe('');
      expect(layout[1][2]).toBe('');
      expect(layout[0][0]).toBe('A1');
      expect(layout[0][2]).toBe('A3');
    });

    it('should use custom prefix', () => {
      const layout = generateSeatLayout(2, 2, 'VIP');

      expect(layout[0][0]).toBe('VIP1');
      expect(layout[0][1]).toBe('VIP2');
    });
  });

  describe('generateAisleLayout', () => {
    it('should generate 2-aisle-2 pattern', () => {
      const layout = generateAisleLayout(2, false);

      expect(layout.length).toBe(2);
      expect(layout[0].length).toBe(5); // 2 + aisle + 2
      expect(layout[0][2]).toBe(''); // Aisle is empty
      expect(layout[0][0]).toBe('A1');
      expect(layout[0][1]).toBe('A2');
      expect(layout[0][3]).toBe('A3');
      expect(layout[0][4]).toBe('A4');
    });

    it('should add back row when requested', () => {
      const layout = generateAisleLayout(2, true);

      expect(layout.length).toBe(3); // 2 rows + back row
      expect(layout[2].length).toBe(5); // Back row has 5 seats
      expect(layout[2][0]).toBe('C1');
      expect(layout[2][4]).toBe('C5');
    });
  });

  describe('generateSleeperLayout', () => {
    it('should generate sleeper layout with 1 floor', () => {
      const config = generateSleeperLayout(5, 1);

      expect(config.floors).toBe(1);
      expect(config.rows).toBe(5);
      expect(config.columns).toBe(2);
      expect(config.totalSeats).toBe(10); // 5 * 2 * 1
      expect(config.layout[0]).toEqual(['AL', 'AU']);
    });

    it('should generate sleeper layout with 2 floors', () => {
      const config = generateSleeperLayout(5, 2);

      expect(config.floors).toBe(2);
      expect(config.totalSeats).toBe(20); // 5 * 2 * 2
    });
  });

  describe('generateLimousineLayout', () => {
    it('should generate VIP pattern (1-1)', () => {
      const layout = generateLimousineLayout(3, 'vip');

      expect(layout.length).toBe(3);
      expect(layout[0].length).toBe(3); // 1 + space + 1
      expect(layout[0][1]).toBe(''); // Middle is empty
      expect(layout[0][0]).toBe('A1');
      expect(layout[0][2]).toBe('A2');
    });

    it('should generate standard pattern (2-1)', () => {
      const layout = generateLimousineLayout(3, 'standard');

      expect(layout.length).toBe(3);
      expect(layout[0].length).toBe(4); // 2 + space + 1
      expect(layout[0][2]).toBe(''); // Space
      expect(layout[0][0]).toBe('A1');
      expect(layout[0][1]).toBe('A2');
      expect(layout[0][3]).toBe('A3');
    });
  });

  describe('generateDoubleDecker', () => {
    it('should generate double-decker layout', () => {
      const config = generateDoubleDecker(3, 4);

      expect(config.floors).toBe(2);
      expect(config.rows).toBe(3);
      expect(config.columns).toBe(4);
      expect(config.totalSeats).toBe(24); // 3 * 4 * 2
      expect(config.layout.length).toBe(6); // 3 + 3 (2 floors)
    });
  });

  describe('countSeats', () => {
    it('should count non-empty seats', () => {
      const layout = [
        ['A1', 'A2', '', 'A3'],
        ['B1', '', 'B2', 'B3'],
      ];

      const count = countSeats(layout);
      expect(count).toBe(6);
    });

    it('should return 0 for empty layout', () => {
      const layout = [
        ['', ''],
        ['', ''],
      ];

      const count = countSeats(layout);
      expect(count).toBe(0);
    });
  });

  describe('validateLayoutDimensions', () => {
    it('should validate correct dimensions', () => {
      const layout = [
        ['A1', 'A2'],
        ['B1', 'B2'],
      ];

      const result = validateLayoutDimensions(layout, 2, 2);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should detect wrong number of rows', () => {
      const layout = [['A1', 'A2']];

      const result = validateLayoutDimensions(layout, 2, 2);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect wrong number of columns', () => {
      const layout = [
        ['A1', 'A2', 'A3'],
        ['B1', 'B2'],
      ];

      const result = validateLayoutDimensions(layout, 2, 2);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Row 0'))).toBe(true);
    });
  });

  describe('checkDuplicateSeats', () => {
    it('should find no duplicates in valid layout', () => {
      const layout = [
        ['A1', 'A2'],
        ['B1', 'B2'],
      ];

      const result = checkDuplicateSeats(layout);
      expect(result.valid).toBe(true);
      expect(result.duplicates).toEqual([]);
    });

    it('should detect duplicate seats', () => {
      const layout = [
        ['A1', 'A2'],
        ['B1', 'A1'], // A1 is duplicate
      ];

      const result = checkDuplicateSeats(layout);
      expect(result.valid).toBe(false);
      expect(result.duplicates.length).toBe(1);
      expect(result.duplicates[0].seat).toBe('A1');
    });

    it('should ignore empty seats in duplicate check', () => {
      const layout = [
        ['A1', ''],
        ['', 'B1'],
      ];

      const result = checkDuplicateSeats(layout);
      expect(result.valid).toBe(true);
    });
  });

  describe('getSeatPosition', () => {
    it('should find seat position', () => {
      const layout = [
        ['A1', 'A2'],
        ['B1', 'B2'],
      ];

      const position = getSeatPosition(layout, 'B2');
      expect(position).toEqual({ row: 1, col: 1 });
    });

    it('should return null for non-existent seat', () => {
      const layout = [['A1', 'A2']];

      const position = getSeatPosition(layout, 'Z9');
      expect(position).toBeNull();
    });
  });

  describe('getAllSeats', () => {
    it('should get all non-empty seats', () => {
      const layout = [
        ['A1', '', 'A2'],
        ['B1', 'B2', ''],
      ];

      const seats = getAllSeats(layout);
      expect(seats).toEqual(['A1', 'A2', 'B1', 'B2']);
    });
  });

  describe('layoutToString', () => {
    it('should convert layout to visual string', () => {
      const layout = [
        ['A1', 'A2'],
        ['B1', 'B2'],
      ];

      const str = layoutToString(layout);
      expect(str).toContain('A1');
      expect(str).toContain('B2');
      expect(str.split('\n').length).toBe(2); // 2 rows
    });
  });

  describe('transposeLayout', () => {
    it('should transpose layout (rotate 90 degrees)', () => {
      const layout = [
        ['A1', 'A2', 'A3'],
        ['B1', 'B2', 'B3'],
      ];

      const transposed = transposeLayout(layout);
      expect(transposed.length).toBe(3); // Was 2x3, now 3x2
      expect(transposed[0].length).toBe(2);
      expect(transposed[0]).toEqual(['A1', 'B1']);
      expect(transposed[2]).toEqual(['A3', 'B3']);
    });
  });

  describe('mirrorLayout', () => {
    it('should mirror layout horizontally', () => {
      const layout = [
        ['A1', 'A2', 'A3'],
        ['B1', 'B2', 'B3'],
      ];

      const mirrored = mirrorLayout(layout);
      expect(mirrored[0]).toEqual(['A3', 'A2', 'A1']);
      expect(mirrored[1]).toEqual(['B3', 'B2', 'B1']);
    });
  });

  describe('mergeLayouts', () => {
    it('should merge two layouts', () => {
      const lower = [['L1', 'L2']];
      const upper = [['U1', 'U2']];

      const merged = mergeLayouts(lower, upper);
      expect(merged.length).toBe(2);
      expect(merged[0]).toEqual(['L1', 'L2']);
      expect(merged[1]).toEqual(['U1', 'U2']);
    });
  });

  describe('validateSeatLayoutForBusType', () => {
    it('should validate correct double_decker layout', () => {
      const seatLayout = {
        floors: 2,
        rows: 2,
        columns: 2,
        layout: [['A1', 'A2'], ['B1', 'B2']],
      };

      const result = validateSeatLayoutForBusType(seatLayout, 'double_decker');
      expect(result.valid).toBe(true);
    });

    it('should reject double_decker with 1 floor', () => {
      const seatLayout = {
        floors: 1,
        rows: 2,
        columns: 2,
        layout: [['A1', 'A2'], ['B1', 'B2']],
      };

      const result = validateSeatLayoutForBusType(seatLayout, 'double_decker');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('2 floors'))).toBe(true);
    });

    it('should reject non-double_decker with 2 floors', () => {
      const seatLayout = {
        floors: 2,
        rows: 2,
        columns: 2,
        layout: [['A1', 'A2'], ['B1', 'B2']],
      };

      const result = validateSeatLayoutForBusType(seatLayout, 'seater');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('1 floor'))).toBe(true);
    });

    it('should detect dimension mismatches', () => {
      const seatLayout = {
        floors: 1,
        rows: 2,
        columns: 2,
        layout: [['A1', 'A2', 'A3']], // Wrong columns
      };

      const result = validateSeatLayoutForBusType(seatLayout, 'seater');
      expect(result.valid).toBe(false);
    });

    it('should reject layout with no seats', () => {
      const seatLayout = {
        floors: 1,
        rows: 2,
        columns: 2,
        layout: [['', ''], ['', '']],
      };

      const result = validateSeatLayoutForBusType(seatLayout, 'seater');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('at least 1 seat'))).toBe(true);
    });

    it('should reject layout with too many seats', () => {
      const seatLayout = {
        floors: 1,
        rows: 100,
        columns: 100,
        layout: Array(100).fill(Array(100).fill('A')),
      };

      const result = validateSeatLayoutForBusType(seatLayout, 'seater');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('200 seats'))).toBe(true);
    });
  });
});
