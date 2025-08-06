export type FinancialDetailRequestTypes = {
  product: string
  interestRate: number
  paymentFrequency: string
  costOfGoods: number
  term: number
  defaultFees: boolean
  startDate: string //YYYY-MM-DD
  firstPmtDate?: string
  insurance?: pqlcInsuranceType[] | []
  fees?: string[] | jointFeeType[]
}

export type jointFeeType = {
  fee_code: string
  apply_joint_fee: boolean
}

export type pqlcInsuranceType = {
  insuranceType?: string
  coverType?: string
}
