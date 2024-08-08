const longestSentence = (sentence) => {
  const split = sentence.split(' ')
  const mapToNumber = split.map((item) => item.length);
  const highestNumber = Math.max(...mapToNumber)
  const checkIndex = mapToNumber.indexOf(highestNumber)
  return `${split[checkIndex]}: ${highestNumber}`
}

console.log(longestSentence('Saya sangat senang mengerjakan soal algoritma lalalaalalalalaalalal'))