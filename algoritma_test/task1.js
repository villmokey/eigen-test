const reverseWord = (word) => {
  const removeString = word.replace(/[^0-9]/g, ''); 
  const removeNumber = word.replace(/[0-9]/g, '').split('').reverse();
  return removeNumber.join('') + removeString;
}

console.log(reverseWord('NE1GIE1'));