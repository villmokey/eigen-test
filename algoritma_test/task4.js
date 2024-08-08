const diagonalSubtraction = (arr) => {  
  const arrLength = arr.length;

  let firstSum = 0;
  let secondSum = 0;
  
  for (let i = 0; i < arrLength; i++) {
    firstSum += arr[i][i];
    secondSum += arr[i][arrLength - 1 - i];
  }

  return firstSum - secondSum
}

const value = [[1, 2, 0], [4, 5, 6], [7, 8, 9]]

console.log(diagonalSubtraction(value))