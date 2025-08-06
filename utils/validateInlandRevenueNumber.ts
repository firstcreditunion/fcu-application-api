'use server'

export async function validateIRD(irdNumber: string) {
  // Convert to string and remove any spaces or dashes
  const irdStr = String(irdNumber).replace(/[\s-]/g, '')

  // Step 1: Check valid range (10,000,000 to 150,000,000)
  const irdNum = parseInt(irdStr, 10)
  if (irdNum < 10000000 || irdNum > 150000000) {
    // console.log(
    //   `Invalid: ${irdStr} is outside the valid range (10,000,000 to 150,000,000)`
    // )
    return false
  }

  // Step 2: Form the eight-digit base number
  const checkDigit = parseInt(irdStr.charAt(irdStr.length - 1), 10)
  let baseNumber = irdStr.substring(0, irdStr.length - 1)

  // Pad to 8 digits if needed
  if (baseNumber.length === 7) {
    baseNumber = '0' + baseNumber
  }

  if (baseNumber.length !== 8) {
    // console.log(
    //   `Invalid: Base number ${baseNumber} should be 8 digits after padding`
    // )
    return false
  }

  // Step 3: Calculate the check digit using primary weights
  const primaryWeights = [3, 2, 7, 6, 5, 4, 3, 2]
  let sum = 0

  for (let i = 0; i < 8; i++) {
    sum += parseInt(baseNumber.charAt(i), 10) * primaryWeights[i]
  }

  let remainder = sum % 11
  let calculatedCheckDigit = remainder === 0 ? 0 : 11 - remainder

  // Step 4: If calculated check digit is 10, use secondary weights
  if (calculatedCheckDigit === 10) {
    const secondaryWeights = [7, 4, 3, 2, 5, 2, 7, 6]
    sum = 0

    for (let i = 0; i < 8; i++) {
      sum += parseInt(baseNumber.charAt(i), 10) * secondaryWeights[i]
    }

    remainder = sum % 11
    calculatedCheckDigit = remainder === 0 ? 0 : 11 - remainder

    // If still 10, the IRD number is invalid
    if (calculatedCheckDigit === 10) {
      // console.log(
      //   `Invalid: Secondary calculation still resulted in check digit 10`
      // )
      return false
    }
  }

  // Step 5: Compare the calculated check digit with the original
  const isValid = calculatedCheckDigit === checkDigit

  if (isValid) {
    // console.log(`Valid: ${irdStr} passed validation`)
  } else {
    // console.log(
    //   `Invalid: ${irdStr} has incorrect check digit (expected ${calculatedCheckDigit}, got ${checkDigit})`
    // )
  }

  return isValid
}

// Test with the examples provided
// console.log('Example 1:')
validateIRD('49091850')

// console.log('\nExample 2:')
validateIRD('35901981')

// console.log('\nExample 3:')
validateIRD('49098576')

// console.log('\nExample 4:')
validateIRD('136410132')

// console.log('\nExample 5:')
validateIRD('136410133')

// console.log('\nExample 6:')
validateIRD('9125568')

// Additional test with formatting
// console.log('\nFormatted example:')
validateIRD('49-091-850')
