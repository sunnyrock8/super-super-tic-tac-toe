export const transpose = <T>(matrix: T[][]): T[][] => {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]));
};
