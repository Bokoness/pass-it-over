class GenericsHelpers {
  static generateRandomNumber(len = 3) {
    let rand = '9'
    let result = '1'
    for (let i = 1; i < len; i++) {
      rand += '9'
      result += '0'
    }
    rand = Number(rand)
    result = Number(result)
    return Math.floor(result + Math.random() * rand)
  }
}

export default GenericsHelpers
