export const getYearsFromStartYear = (startYear: number) => {
  const currentYear = new Date().getFullYear()
  const years = []
  startYear = startYear || 1980
  while (startYear <= currentYear) {
    const currentYear = startYear++
    years.push({ yearNumber: currentYear, yearString: currentYear.toString() })
  }
  return years
}

// Brazilian currency config
export const moneyFormatter = Intl.NumberFormat('en-NZ', {
  currency: 'NZD',
  currencyDisplay: 'symbol',
  currencySign: 'standard',
  style: 'currency',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const phoneRegExp =
  /^(((\+?64\s*[-\.\ ]?[3-9]|\(?0[3-9]\)?)\s*[-\.\ ]?\d{3}\s*[-\.\ ]?\d{4})|((\+?64\s*[-\.\(\ ]?2\d{1,2}[-\.\)\ ]?|\(?02\d{1}\)?)\s*[-\.\ ]?\d{3,4}\s*[-\.\ ]?\d{3,5})|((\+?64\s*[-\.\ ]?[-\.\(\ ]?800[-\.\)\ ]?|[-\.\(\ ]?0800[-\.\)\ ]?)\s*[-\.\ ]?\d{3}\s*[-\.\ ]?(\d{2}|\d{5})))|^$$/
export const emailRegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/

export function removeSpaces(str: string | undefined) {
  if (str == undefined) return
  return str.replace(/\s/g, '')
}
