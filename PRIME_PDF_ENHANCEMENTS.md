# Prime PDF Enhancements - Additional Data Points

## Overview

Based on analysis of `prime2.json`, the Prime PDF has been enhanced to include additional data points that were missing from the initial implementation.

## New Features Added

### 1. Visa Information (Page 2 - Preliminary Info)

For non-resident applicants, the PDF now displays:

- **Visa Start Date**: When the visa becomes valid
- **Visa Expiry Date**: When the visa expires

**Location**: `components/pdf/sections/PreliminaryInfo.tsx`

### 2. Enhanced Identification Documents (Page 3 - Personal Details)

#### Passport

- Passport Number (existing)
- **Issue Date** (new)
- **Expiry Date** (new)

#### Birth Certificate

- Registration Number (existing)
- **Issue Date** (new)

#### Kiwi Access Card

- Card Number (existing)
- **Issue Date** (new)
- **Expiry Date** (new)

**Location**: `components/pdf/sections/PersonalDetails.tsx`

### 3. Enhanced Vehicle Security (Page 7 - Security & Insurance)

The vehicle security section now includes:

- Vehicle Security Provided (existing)
- **Vehicle Purchased** (new) - Whether the vehicle has been purchased
- **Registration Number** (new) - Vehicle registration
- **Vehicle Insured** (new) - Whether the vehicle is insured
- **Insurer Name** (new) - Name of the insurance company

**Location**: `components/pdf/sections/PrimeVehicleSecurity.tsx` (new component)

### 4. Selected Insurance Coverage (Page 7 - Security & Insurance)

When insurance is selected (`needCreditCareInsurance === 'Yes'`), the PDF now displays:

- **Insurance Type** - Single/Double/Joint
- **Cover Type** - Option 1/2/3
- **Coverage Includes** - Description of what's covered (e.g., "Death, Accident, Illness, Hospitalisation, or Bankruptcy")
- **Premium Amount** - The insurance premium cost

**Location**: `components/pdf/sections/PrimeVehicleSecurity.tsx`

## Files Modified

### 1. Type Definitions

**File**: `types/pdf/enrichedLoanData.ts`

Added optional fields:

```typescript
primePreliminaryQuestions: {
  // ... existing fields
  visaStartDate?: string
  visaExpiryDate?: string
}

primePassport: {
  passportNumber: string
  passportIssueDate?: string
  passportExpiryDate?: string
}

primeBirthCertificate: {
  birthCertificateRegNo: string
  birthCertificateIssueDate?: string
}

primeKiwiAccessCard: {
  kiwiAccessCardNumber: string
  kiwiAccessCardIssueDate?: string
  kiwiAccessCardExpiryDate?: string
}

vehicleSecurity: {
  provideVehicleAsLoanSecurity: string
  haveYouPurchasedVehicle?: string
  vehicleRegistrationNumber?: string
  isVehicleInsured?: string
  nameOfInsurer?: string
}

formFinancialDetails: {
  // ... existing fields
  component?: string           // Insurance type
  coverType?: string          // Cover type
  premiumAmount?: number      // Premium amount
  coversIncluded?: string     // Coverage description
}
```

### 2. Data Enrichment

**File**: `lib/pdf/enrichLoanData.ts`

Updated type assertions to include all new optional fields.

### 3. PDF Components

#### Updated Components:

- **`components/pdf/sections/PreliminaryInfo.tsx`**
  - Added visa information section

- **`components/pdf/sections/PersonalDetails.tsx`**
  - Added issue/expiry dates for passport, birth certificate, and kiwi access card

#### New Component:

- **`components/pdf/sections/PrimeVehicleSecurity.tsx`**
  - Replaces `SecurityInsurance.tsx` for prime applications
  - Shows enhanced vehicle security details
  - Displays selected insurance coverage
  - Shows available insurance options catalog

#### Main Document:

- **`components/pdf/LoanApplicationPDF.tsx`**
  - Updated to use `PrimeVehicleSecurity` instead of `SecurityInsurance`

## Comparison: Prime vs Prime2

| Field                   | Prime (Original) | Prime2 (Enhanced)                     |
| ----------------------- | ---------------- | ------------------------------------- |
| **Visa Information**    | ❌ Not shown     | ✅ Start/Expiry dates                 |
| **Passport**            | Number only      | ✅ Number + Issue/Expiry dates        |
| **Birth Certificate**   | Number only      | ✅ Number + Issue date                |
| **Kiwi Access Card**    | Number only      | ✅ Number + Issue/Expiry dates        |
| **Vehicle Security**    | Y/N only         | ✅ Purchased, Reg #, Insured, Insurer |
| **Insurance Selection** | Not shown        | ✅ Type, Cover, Premium, Description  |

## Benefits

1. **Complete Documentation**: All available data from the loan application is now captured in the PDF
2. **Better Compliance**: Issue and expiry dates help verify identity document validity
3. **Enhanced Security**: Full vehicle registration and insurance details for secured loans
4. **Clear Insurance**: Selected insurance coverage is clearly documented with premium amount
5. **Conditional Display**: Optional fields only show when data is present, keeping PDFs clean

## Testing

All new fields are optional and will only display when present in the data:

- ✅ PDF generates successfully without new fields
- ✅ PDF displays new fields when present
- ✅ Dates are formatted consistently (dd MMM yyyy)
- ✅ Currency values show with $ prefix
- ✅ No linter errors

## Data Source

The enhancements were based on comparing:

- **Original**: `utils/pdf-exmaple/prime.json`
- **Enhanced**: `utils/pdf-exmaple/prime2.json`

All new fields found in `prime2.json` have been incorporated into the Prime PDF generation system.
