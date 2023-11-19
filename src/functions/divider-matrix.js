function dividerMatrix(array, numColunas) {
  const tamanhoSubarray = Math.ceil(array.length / numColunas);
  const matriz = [];

  for (let i = 0; i < array.length; i += tamanhoSubarray) {
    const subarray = array.slice(i, i + tamanhoSubarray);
    matriz.push(subarray);
  }

  return matriz;
}

module.exports = { dividerMatrix };
