const countEquel = (arr1, arr2) => {
  let finalArr = arr2.map(arr2Element => {
    let count = 0;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] === arr2Element) {
        count++;
      }
    }
    return count
  });
  return finalArr;
}

console.log(countEquel(['xc', 'dz', 'bbb', 'dz'], ['bbb', 'ac', 'dz']))