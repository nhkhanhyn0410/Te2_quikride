/**
 * Seat Layout Utilities
 * Helper functions for creating, manipulating, and validating seat layouts
 */

/**
 * Generate a basic seat layout matrix
 * @param {Number} rows - Number of rows
 * @param {Number} columns - Number of columns
 * @param {String} prefix - Seat prefix (default: 'A', 'B', 'C', etc.)
 * @param {Array} emptyPositions - Array of [row, col] positions to leave empty
 * @returns {Array} 2D array of seat labels
 */
const generateSeatLayout = (rows, columns, prefix = null, emptyPositions = []) => {
  const layout = [];
  const emptySet = new Set(emptyPositions.map(pos => `${pos[0]},${pos[1]}`));

  for (let row = 0; row < rows; row++) {
    const rowArray = [];
    const rowPrefix = prefix || String.fromCharCode(65 + row); // A, B, C, etc.

    for (let col = 0; col < columns; col++) {
      const posKey = `${row},${col}`;
      if (emptySet.has(posKey)) {
        rowArray.push(''); // Empty space
      } else {
        rowArray.push(`${rowPrefix}${col + 1}`);
      }
    }
    layout.push(rowArray);
  }

  return layout;
};

/**
 * Generate a bus aisle layout (2-aisle-2 pattern common in buses)
 * @param {Number} rows - Number of rows
 * @param {Boolean} hasBackRow - Whether to include a back row (5 seats)
 * @returns {Array} 2D array with aisle in the middle
 */
const generateAisleLayout = (rows, hasBackRow = false) => {
  const layout = [];

  for (let row = 0; row < rows; row++) {
    const rowArray = [];
    const rowPrefix = String.fromCharCode(65 + row);

    // 2-aisle-2 pattern
    rowArray.push(`${rowPrefix}1`); // Left window
    rowArray.push(`${rowPrefix}2`); // Left aisle
    rowArray.push(''); // Aisle
    rowArray.push(`${rowPrefix}3`); // Right aisle
    rowArray.push(`${rowPrefix}4`); // Right window

    layout.push(rowArray);
  }

  // Add back row if requested (common in buses)
  if (hasBackRow) {
    const backRowPrefix = String.fromCharCode(65 + rows);
    layout.push([
      `${backRowPrefix}1`,
      `${backRowPrefix}2`,
      `${backRowPrefix}3`,
      `${backRowPrefix}4`,
      `${backRowPrefix}5`,
    ]);
  }

  return layout;
};

/**
 * Generate a sleeper bus layout (2 columns with beds)
 * @param {Number} rows - Number of rows
 * @param {Number} floors - Number of floors (1 or 2)
 * @returns {Object} Layout configuration for sleeper
 */
const generateSleeperLayout = (rows, floors = 1) => {
  const layout = [];

  for (let row = 0; row < rows; row++) {
    const rowPrefix = String.fromCharCode(65 + row);
    // Sleeper typically has 2 columns (lower and upper berths on each side)
    layout.push([`${rowPrefix}L`, `${rowPrefix}U`]); // L=Lower, U=Upper
  }

  return {
    floors,
    rows,
    columns: 2,
    layout,
    totalSeats: rows * 2 * floors,
  };
};

/**
 * Generate a limousine layout (2-1 or 1-1 pattern)
 * @param {Number} rows - Number of rows
 * @param {String} pattern - 'vip' (1-1) or 'standard' (2-1)
 * @returns {Array} 2D array
 */
const generateLimousineLayout = (rows, pattern = 'standard') => {
  const layout = [];

  for (let row = 0; row < rows; row++) {
    const rowPrefix = String.fromCharCode(65 + row);

    if (pattern === 'vip') {
      // 1-1 pattern (more space)
      layout.push([`${rowPrefix}1`, '', `${rowPrefix}2`]);
    } else {
      // 2-1 pattern (standard limousine)
      layout.push([`${rowPrefix}1`, `${rowPrefix}2`, '', `${rowPrefix}3`]);
    }
  }

  return layout;
};

/**
 * Generate double-decker layout
 * @param {Number} rowsPerFloor - Rows per floor
 * @param {Number} columns - Columns per row
 * @returns {Object} Layout configuration for double decker
 */
const generateDoubleDecker = (rowsPerFloor, columns = 4) => {
  // Lower floor
  const lowerFloor = generateSeatLayout(rowsPerFloor, columns, 'L');

  // Upper floor
  const upperFloor = generateSeatLayout(rowsPerFloor, columns, 'U');

  return {
    floors: 2,
    rows: rowsPerFloor,
    columns,
    layout: [...lowerFloor, ...upperFloor],
    totalSeats: rowsPerFloor * columns * 2,
  };
};

/**
 * Count total seats in a layout (excluding empty spaces)
 * @param {Array} layout - 2D array of seats
 * @returns {Number} Total number of seats
 */
const countSeats = (layout) => {
  let count = 0;
  for (const row of layout) {
    for (const seat of row) {
      if (seat && seat.trim() !== '') {
        count++;
      }
    }
  }
  return count;
};

/**
 * Validate layout dimensions
 * @param {Array} layout - 2D array
 * @param {Number} expectedRows - Expected number of rows
 * @param {Number} expectedColumns - Expected number of columns
 * @returns {Object} { valid: boolean, errors: [] }
 */
const validateLayoutDimensions = (layout, expectedRows, expectedColumns) => {
  const errors = [];

  if (!Array.isArray(layout)) {
    errors.push('Layout must be an array');
    return { valid: false, errors };
  }

  if (layout.length !== expectedRows) {
    errors.push(`Expected ${expectedRows} rows, got ${layout.length}`);
  }

  for (let i = 0; i < layout.length; i++) {
    if (!Array.isArray(layout[i])) {
      errors.push(`Row ${i} must be an array`);
      continue;
    }

    if (layout[i].length !== expectedColumns) {
      errors.push(`Row ${i}: expected ${expectedColumns} columns, got ${layout[i].length}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Check for duplicate seat numbers
 * @param {Array} layout - 2D array
 * @returns {Object} { valid: boolean, duplicates: [] }
 */
const checkDuplicateSeats = (layout) => {
  const seatMap = new Map();
  const duplicates = [];

  for (let row = 0; row < layout.length; row++) {
    for (let col = 0; col < layout[row].length; col++) {
      const seat = layout[row][col];
      if (seat && seat.trim() !== '') {
        if (seatMap.has(seat)) {
          duplicates.push({
            seat,
            positions: [seatMap.get(seat), [row, col]],
          });
        } else {
          seatMap.set(seat, [row, col]);
        }
      }
    }
  }

  return {
    valid: duplicates.length === 0,
    duplicates,
  };
};

/**
 * Get seat position by seat number
 * @param {Array} layout - 2D array
 * @param {String} seatNumber - Seat number to find
 * @returns {Object} { row, col } or null
 */
const getSeatPosition = (layout, seatNumber) => {
  for (let row = 0; row < layout.length; row++) {
    for (let col = 0; col < layout[row].length; col++) {
      if (layout[row][col] === seatNumber) {
        return { row, col };
      }
    }
  }
  return null;
};

/**
 * Get all seat numbers from layout
 * @param {Array} layout - 2D array
 * @returns {Array} Array of seat numbers
 */
const getAllSeats = (layout) => {
  const seats = [];
  for (const row of layout) {
    for (const seat of row) {
      if (seat && seat.trim() !== '') {
        seats.push(seat);
      }
    }
  }
  return seats;
};

/**
 * Convert layout to visual representation (string)
 * @param {Array} layout - 2D array
 * @returns {String} Visual representation
 */
const layoutToString = (layout) => {
  return layout
    .map((row) =>
      row.map((seat) => (seat && seat.trim() !== '' ? seat.padEnd(4, ' ') : '    ')).join(' ')
    )
    .join('\n');
};

/**
 * Transpose layout (rotate 90 degrees)
 * @param {Array} layout - 2D array
 * @returns {Array} Transposed layout
 */
const transposeLayout = (layout) => {
  const rows = layout.length;
  const cols = layout[0].length;
  const transposed = [];

  for (let col = 0; col < cols; col++) {
    const newRow = [];
    for (let row = 0; row < rows; row++) {
      newRow.push(layout[row][col]);
    }
    transposed.push(newRow);
  }

  return transposed;
};

/**
 * Mirror layout horizontally
 * @param {Array} layout - 2D array
 * @returns {Array} Mirrored layout
 */
const mirrorLayout = (layout) => {
  return layout.map((row) => [...row].reverse());
};

/**
 * Merge two layouts (for double-decker buses)
 * @param {Array} lowerLayout - Lower floor layout
 * @param {Array} upperLayout - Upper floor layout
 * @returns {Array} Combined layout
 */
const mergeLayouts = (lowerLayout, upperLayout) => {
  return [...lowerLayout, ...upperLayout];
};

/**
 * Validate seat layout for business rules
 * @param {Object} seatLayout - Complete seat layout object
 * @param {String} busType - Type of bus
 * @returns {Object} { valid: boolean, errors: [] }
 */
const validateSeatLayoutForBusType = (seatLayout, busType) => {
  const errors = [];
  const { floors, rows, columns, layout } = seatLayout;

  // Check floor requirements
  if (busType === 'double_decker' && floors !== 2) {
    errors.push('Double decker bus must have 2 floors');
  }

  if (busType !== 'double_decker' && floors !== 1) {
    errors.push('Non-double-decker bus must have 1 floor');
  }

  // Check dimensions match layout
  const dimValidation = validateLayoutDimensions(layout, rows, columns);
  if (!dimValidation.valid) {
    errors.push(...dimValidation.errors);
  }

  // Check for duplicates
  const dupValidation = checkDuplicateSeats(layout);
  if (!dupValidation.valid) {
    errors.push(
      `Duplicate seats found: ${dupValidation.duplicates.map((d) => d.seat).join(', ')}`
    );
  }

  // Check reasonable seat count
  const totalSeats = countSeats(layout);
  if (totalSeats < 1) {
    errors.push('Layout must have at least 1 seat');
  }

  if (totalSeats > 200) {
    errors.push('Layout cannot have more than 200 seats');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

module.exports = {
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
};
