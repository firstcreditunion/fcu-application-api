import { format } from 'date-fns-tz'

export function convertToUTCTime(date: Date = new Date()): string {
  const formattedDate = date.toISOString()

  return formattedDate
}

export function formattedNzDateTime(utcTimestamp: Date = new Date()): string {
  // Assuming 'utcTimestamp' is the timestamp retrieved from Supabase
  const nzDateTime = format(
    new Date(utcTimestamp),
    'yyyy-MM-dd hh:mm:ss aaaa',
    {
      timeZone: 'Pacific/Auckland',
    }
  )

  return nzDateTime
}

export function generateRandomString(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

export const loanPurposeCodesFallback = [
  {
    id: 18,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'BSPC',
    loan_purpose_subcode_desc: 'Business - Purchase/Captl',
    include: false,
  },
  {
    id: 19,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'BSPE',
    loan_purpose_subcode_desc: 'Business Plant Equipment',
    include: false,
  },
  {
    id: 20,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'BTAC',
    loan_purpose_subcode_desc: 'Boat, Yacht and Watercraft',
    include: false,
  },
  {
    id: 21,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'BYOC',
    loan_purpose_subcode_desc: 'Bring Your Own Device',
    include: false,
  },
  {
    id: 22,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'CARA',
    loan_purpose_subcode_desc: 'Caravans and Trailers',
    include: false,
  },
  {
    id: 23,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'CHPY',
    loan_purpose_subcode_desc: 'Change in Payments',
    include: false,
  },
  {
    id: 24,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'CHSC',
    loan_purpose_subcode_desc: 'Change in Security',
    include: false,
  },
  {
    id: 26,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'EDTR',
    loan_purpose_subcode_desc: 'Education/Training',
    include: false,
  },
  {
    id: 27,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'EMTR',
    loan_purpose_subcode_desc: 'Employees Loan Transfer',
    include: false,
  },
  {
    id: 28,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'EXHO',
    loan_purpose_subcode_desc: 'Existing Homes',
    include: false,
  },
  {
    id: 30,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'HMRF',
    loan_purpose_subcode_desc: 'Home Refinance',
    include: false,
  },
  {
    id: 31,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'HOIM',
    loan_purpose_subcode_desc: 'Home Improvements',
    include: false,
  },
  {
    id: 34,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'INVP',
    loan_purpose_subcode_desc: 'Investment Property',
    include: false,
  },
  {
    id: 36,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'MBFA',
    loan_purpose_subcode_desc: 'Misc Business/Farming',
    include: false,
  },
  {
    id: 37,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'MC&C',
    loan_purpose_subcode_desc: 'Motorcycles & Bicylces',
    include: false,
  },
  {
    id: 38,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'MDEX',
    loan_purpose_subcode_desc: 'Medical Expenses',
    include: false,
  },
  {
    id: 40,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'MSSF',
    loan_purpose_subcode_desc: 'Mortgagee Sale Shortfall',
    include: false,
  },
  {
    id: 42,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'NWHO',
    loan_purpose_subcode_desc: 'New Home Purchase',
    include: false,
  },
  {
    id: 43,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'POSC',
    loan_purpose_subcode_desc: 'Purchase of Section',
    include: false,
  },
  {
    id: 44,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'REAS',
    loan_purpose_subcode_desc: 'Assist Relatives',
    include: false,
  },
  {
    id: 45,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'REFI',
    loan_purpose_subcode_desc: 'Refinanced',
    include: false,
  },
  {
    id: 46,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'RSTR',
    loan_purpose_subcode_desc: 'Restructure',
    include: false,
  },
  {
    id: 47,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'SPHO',
    loan_purpose_subcode_desc: 'Sporting/Hobbie/Artistic',
    include: false,
  },
  {
    id: 48,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'TAXS',
    loan_purpose_subcode_desc: 'Taxes',
    include: false,
  },
  {
    id: 49,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'TDTL',
    loan_purpose_subcode_desc: 'Tradesman Tools',
    include: false,
  },
  {
    id: 51,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'VAFH',
    loan_purpose_subcode_desc: 'Variation Financial Hardship',
    include: false,
  },
  {
    id: 52,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'VHOT',
    loan_purpose_subcode_desc: 'Vehicles - Other',
    include: false,
  },
  {
    id: 55,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'XMAS',
    loan_purpose_subcode_desc: 'Christmas Loan Promotion',
    include: false,
  },
  {
    id: 39,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'MIPI',
    loan_purpose_subcode_desc:
      'Personal Items or Events e.g. Major Life Event or Expense',
    include: true,
  },
  {
    id: 41,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'MTRV',
    loan_purpose_subcode_desc: 'Vehicle Financing',
    include: true,
  },
  {
    id: 25,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'DBCO',
    loan_purpose_subcode_desc: 'Debt Consolidation',
    include: true,
  },
  {
    id: 50,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'TRVL',
    loan_purpose_subcode_desc: 'Travel and Vacation Costs',
    include: true,
  },
  {
    id: 53,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'VHRP',
    loan_purpose_subcode_desc: 'Repair or Service Vehicle',
    include: true,
  },
  {
    id: 33,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'HOSR',
    loan_purpose_subcode_desc: 'Home Renovations',
    include: true,
  },
  {
    id: 29,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'FUNR',
    loan_purpose_subcode_desc: 'Funeral, Death or Unveiling Costs',
    include: true,
  },
  {
    id: 35,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'M/BE',
    loan_purpose_subcode_desc: 'Moving Costs',
    include: true,
  },
  {
    id: 32,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'HOIT',
    loan_purpose_subcode_desc: 'Appliance Purchase',
    include: true,
  },
  {
    id: 54,
    loan_purpose_code: 'NBUS',
    loan_purpose_sub_code: 'WDGS',
    loan_purpose_subcode_desc: 'Weddings & Special Events',
    include: true,
  },
]

export const maritalStatusOptions = [
  {
    key: 'S',
    value: 'Single',
  },
  {
    key: 'M',
    value: 'Married',
  },
  {
    key: 'D',
    value: 'Divorced',
  },
  {
    key: 'F',
    value: 'De Facto',
  },
  {
    key: 'W',
    value: 'Widowed',
  },
  {
    key: 'P',
    value: 'Separated',
  },
]

export const genderLookup = [
  {
    key: 'M',
    value: 'Male',
  },
  {
    key: 'F',
    value: 'Female',
  },
]

export const occupationCodes = [
  {
    idx: 0,
    sov_activity_code: '001',
    activity_code: '1',
    activity_type: '',
    activity_name: 'Managers',
    activity_desc: null,
  },
  {
    idx: 1,
    sov_activity_code: '002',
    activity_code: '2',
    activity_type: '',
    activity_name: 'Professionals',
    activity_desc: null,
  },
  {
    idx: 2,
    sov_activity_code: '003',
    activity_code: '3',
    activity_type: '',
    activity_name: 'Technician & Trade Workers',
    activity_desc: null,
  },
  {
    idx: 3,
    sov_activity_code: '004',
    activity_code: '4',
    activity_type: '',
    activity_name: 'Community & Personal Services',
    activity_desc: null,
  },
  {
    idx: 4,
    sov_activity_code: '005',
    activity_code: '5',
    activity_type: '',
    activity_name: 'Clerical & Administrative',
    activity_desc: null,
  },
  {
    idx: 5,
    sov_activity_code: '006',
    activity_code: '6',
    activity_type: '',
    activity_name: 'Sales Workers',
    activity_desc: null,
  },
  {
    idx: 6,
    sov_activity_code: '007',
    activity_code: '7',
    activity_type: '',
    activity_name: 'Machinery Ops & Drivers',
    activity_desc: null,
  },
  {
    idx: 7,
    sov_activity_code: '008',
    activity_code: '8',
    activity_type: '',
    activity_name: 'Labourers',
    activity_desc: null,
  },
  {
    idx: 8,
    sov_activity_code: '009',
    activity_code: '9',
    activity_type: '',
    activity_name: 'Teacher',
    activity_desc: 'Pre-school, Primary or Secondary School Teacher',
  },
  {
    idx: 9,
    activity_code: 'BEN',
    activity_type: '',
    activity_name: 'Beneficiary',
    activity_desc: null,
  },
  {
    idx: 10,
    activity_code: 'TST',
    activity_type: '',
    activity_name: 'Student - Tertiary Education',
    activity_desc: null,
  },
]
