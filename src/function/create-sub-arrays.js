function createSubArrays(array, numColumn) {
  const subArraySize = Math.ceil(array.length / numColumn);

  const matrix = [];

  for (let i = 0; i < array.length; i += subArraySize) {
    const subArray = array.slice(i, i + subArraySize);

    matrix.push(subArray);
  }

  return matrix;
}

module.exports = { createSubArrays };
