// TypeScript types for Financial Calculator Result
// Based on OCC API FinancialDetailsCalculationResult

export interface FinancialCalculatorResult {
  data: FinancialCalculatorData
  included: []
}

export interface FinancialCalculatorData {
  type: string
  attributes: FinancialCalculatorAttributes
}

export interface FinancialCalculatorAttributes {
  productCode: string
  primaryClientType: string
  settlementDate: string
  maturityDate: string
  interestRate: number
  balloonAmount: number
  residualValue: number
  taxState?: string
  primaryAssetClass?: string
  advance?: 'Y' | 'N'
  valueOfAdvInstalments: number
  netDeposit: number
  amountFinanced: number
  interestAmount: number
  amountPayable: number
  gstOnInterest: number
  disclosedRate: number
  trueRate: number
  gst: number
  itcBenefit?: number
  amountFinancedExclGSTAdvance: number
  gstPayablePostAdvance: number
  gstRecoveryOption?: string
  repaymentOptions: RepaymentOptions
  paymentFrequency: PaymentFrequency
  taxTreatment?: TaxTreatment
  costOfGoods: CostOfGoods
  term: Term
  fees?: Fees
  insurances?: Insurance[]
  instalmentBreakdown: InstalmentBreakdown
  instalmentSummary: InstalmentSummary[]
}

export interface RepaymentOptions {
  weeklyAmount?: number
  numberOfWeeklyPayments?: number
  firstWeeklyPaymentDate?: string
  fortnightlyAmount?: number
  numberOfFortnightlyPayments?: number
  firstFortnightlyPaymentDate?: string
  monthlyAmount?: number
  numberOfMonthlyPayments?: number
  firstMonthlyPaymentDate?: string
}

export interface PaymentFrequency {
  value: number
  unit: 'D' | 'W' | 'F' | 'M' | 'Q' | 'Y'
  day?: string
}

export interface TaxTreatment {
  id?: string
  taxTreatmentCode?: string
  taxTreatmentStatusCode?: string
  productCode?: string
  effectiveDate: string
  gstOnPurchasePrice?: 'Y' | 'N'
  gstOnInstlmt?: 'Y' | 'N'
  gstOnResidual?: 'Y' | 'N'
  lctOnPurchasePrice?: 'Y' | 'N'
  gstOnInterestFinanced?: 'Y' | 'N'
  itcBenefitSpecialCalc?: 'Y' | 'N'
}

export interface CostOfGoods {
  value: number
  overriddenLct: number
  overriddenGst: number
}

export interface Term {
  value: number
  unit: 'D' | 'W' | 'F' | 'M' | 'Q' | 'Y'
}

export interface Fees {
  fee: Fee[]
  capitalised: number
  nonCapitalised: number
  refresh?: 'Y' | 'N' | string
}

export interface Fee {
  code: string
  amount: number
  capitalised?: 'Y' | 'N'
  payer?: string
  description?: string
  gstAmount?: number
  itcAmount?: number
  seq?: string
  groupingCode?: string
}

export interface Insurance {
  insuranceType: string
  insuranceOption?: string
  premium: number
  externalSystemReference: string
  policyNumber?: string
  jointCover: 'Y' | 'N' | string
  policyDescription?: string
  sumInsured?: number
  surrenderValue?: number
  commencementDate?: string
  term: Term
  expiryDate?: string
  reviewDate?: string
  gstOnPremium?: number
  standardExcess?: number
  excessCharged?: number
  earthquakeCoverAmount?: number
  specialVehicle?: 'Y' | 'N'
  reportingCommissionPct?: number
  insured?: Insured
  seq: string
}

export interface Insured {
  itemReference?: ItemReference
  insuredMaint?: InsuredMaint
  insuredClientReference?: string
}

export interface ItemReference {
  value?: string
  type?: string
}

export interface InsuredMaint {
  insuredClient: InsuredClient
  title?: string
  forename?: string
  surname?: string
  dateOfBirth?: string
}

export interface InsuredClient {
  value?: string
  refType: 'SOVEREIGN' | 'EXTERNAL' | 'ASSIGN'
}

export interface InstalmentBreakdown {
  total: InstalmentTotal
  instalments: Instalment[]
}

export interface InstalmentTotal {
  principal: number
  interest: number
  nonCapitalisedFees: number
  gst: number
}

export interface Instalment {
  seq: number
  gstRecoveryOption: 'NONE' | 'TOTAL+INST' | 'TOTAL' | 'POSSIBLE'
  date: string
  principal: number
  interest: number
  feeAmount: number
  structured: 'Y' | 'N'
  held: 'Y' | 'N'
  externalFeeAmount: number
  gstAmount: number
  instalmentAmount: number
}

export interface InstalmentSummary {
  sequenceNumber?: number
  startDate: string
  endDate: string
  numberOfInstalments: number
  amount: number
  instalmentType: 'X' | 'O' | 'D' | 'I' | 'M' | 'P' | 'R' | 'PandI'
}

// Additional types for request/input if needed
export interface FinancialCalculatorRequest {
  productCode: string
  primaryClientType?: 'I' | 'C'
  settlementDate: string
  term: Term
  interestRate: number
  gstOnInterest: number
  paymentFrequency: PaymentFrequency
  balloonAmount: number
  residualValue?: number
  taxTreatmentCode?: string
  taxState?: string
  primaryAssetClass?: string
  primaryAssetCondition?: 'N' | 'D' | 'U'
  advance?: 'Y' | 'N'
  valueOfAdvInstalments?: number
  includeRepaymentOptions?: 'Y' | 'N'
  costOfGoods: number
  costOfGoodsOverriddenLct?: number
  depositAmount?: number
  fees?: Fee[]
  insurances?: InsuranceRequest[]
  structuredInstalments?: StructuredInstalments
}

export interface InsuranceRequest {
  insuranceType: string
  insuranceOption?: string
  gstOnPremium?: number
  premium: number
}

export interface StructuredInstalments {
  recalcOption?: 'All' | 'Future' | 'Past'
  structuredInstalment: StructuredInstalment[]
}

export interface StructuredInstalment {
  value?: number
  seq: number
  to?: number
  held?: 'Y' | 'N'
  instalmentFee?: number
  gstRecoveryOption?: 'TotalGST' | 'TotalGSTPlusInstalment'
}
