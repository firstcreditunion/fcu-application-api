type ProcessedMobileNumber = {
  sov_networkCode: string
  sov_number: string
}

export function processMobileNumber(
  mobileNumber: string
): ProcessedMobileNumber {
  // console.log('Split Check processMobileNumber: ', mobileNumber)

  // Split the input string by spaces
  const parts = mobileNumber.split(' ')

  // Process the network code (first part)
  const sov_networkCode = parts[0].replace(/^0/, '')

  // Process the rest of the number
  const sov_number = parts.slice(1).join('')

  return {
    sov_networkCode,
    sov_number,
  }
}
