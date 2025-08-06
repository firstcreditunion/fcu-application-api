export const pqlcFormatCurrency = (value: string) => {
  const number = value.replace(/[^\d.]/g, '')
  const parts = number.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const parseFloatFromCurrency = (value: string) => {
  const valueToUse = value === undefined || value === null ? '0' : value
  return parseFloat(valueToUse.replace(/,/g, ''))
}

export const parseIntFromValue = (value: string) => {
  const valueToUse = value === undefined || value === null ? '0' : value
  return parseInt(valueToUse.replace(/,/g, ''))
}
