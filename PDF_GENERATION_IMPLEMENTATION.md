# PDF Generation Implementation Summary

## Overview

A complete PDF generation system has been implemented for Prime Loan Applications. The system retrieves loan application data from the database, enriches it with descriptive information, and generates a comprehensive 7-page PDF document.

## Architecture

### 1. **Route Handler**

- **File**: `app/api/personal-loan/generate-pdf/prime/route.ts`
- **Endpoint**: `POST /api/personal-loan/generate-pdf/prime`
- **Authentication**: API Secret via `X-API-Secret` header
- **Input**: `{ loan_application_number: number }`
- **Output**: PDF file as binary stream

### 2. **Data Flow**

```
Request → API Auth → Fetch Loan Data → Parse JSON → Enrich Data → Generate PDF → Return PDF
```

### 3. **Key Components**

#### Data Types

- **File**: `types/pdf/enrichedLoanData.ts`
- Comprehensive TypeScript interfaces for all loan data sections
- Includes both original and enriched (description) fields

#### Data Enrichment

- **File**: `lib/pdf/enrichLoanData.ts`
- **Function**: `enrichPrimeLoanData()`
- **Purpose**: Adds human-readable descriptions to code values
- **Lookups**:
  - Trading Branch: `Organisation_Unit_id` → `Organisation_Unit_Name`
  - Loan Purpose: `loan_purpose_code` → `loan_purpose_subcode_desc`
  - Product: `Product_Type` → `LP_Product_Name`
  - Fees: `FEE_Code` → `FEE_Description`
  - Employment Type: Uses `employmentTypesFallback` from `utils/fallback.ts`
  - Occupation: Uses `occupationFallback` from `utils/fallback.ts`

#### PDF Generation

- **File**: `lib/pdf/generatePrimeLoanPDF.ts`
- **Library**: `@react-pdf/renderer v4.3.1`
- Uses React components to build PDF structure

#### PDF Styling

- **File**: `components/pdf/styles/pdfStyles.ts`
- Centralized styling with FCU branding
- Professional color scheme (#003366 primary color)

### 4. **PDF Structure (7 Pages)**

#### Page 1: Application Overview

- **File**: `components/pdf/sections/ApplicationOverview.tsx`
- Applicant name, DOB, gender, marital status
- Contact details (email, mobile, work phone)
- Credit Sense references
- Client number

#### Page 2: Preliminary Information

- **File**: `components/pdf/sections/PreliminaryInfo.tsx`
- Citizenship & residency status
- Bankruptcy information
- Loan purpose with description
- Trading branch with description

#### Page 3: Personal Details & Identification

- **File**: `components/pdf/sections/PersonalDetails.tsx`
- Full personal information
- All identification documents:
  - Driver's Licence
  - Passport
  - Firearms Licence
  - Birth Certificate
  - Various ID cards (Kiwi Access, Community Service, Gold Card, Student ID)

#### Page 4: Employment & Income

- **File**: `components/pdf/sections/EmploymentIncome.tsx`
- Employment type with description
- Occupation with description
- Employer details
- Income frequency and amount
- Benefits (if applicable)

#### Page 5: Contact & Address Details

- **File**: `components/pdf/sections/ContactAddress.tsx`
- Residential address with PXID
- Accommodation type
- Mailing address
- All contact information

#### Page 6: Financial Details

- **File**: `components/pdf/sections/FinancialDetails.tsx`
- Product name with description
- Loan amount and terms
- Interest rate
- Payment frequency
- **Fees table** with codes and descriptions
- Calculated amounts (instalment, total interest, total payable)
- Insurance requirements

#### Page 7: Security & Insurance Options

- **File**: `components/pdf/sections/SecurityInsurance.tsx`
- Vehicle security status
- **Complete insurance catalog**:
  - Single Cover Options (3 types)
  - Double Cover Options (3 types)
  - Joint Cover Options (3 types)
- Detailed coverage descriptions for each option

### 5. **Reusable Components**

#### Header Component

- **File**: `components/pdf/sections/Header.tsx`
- Consistent header across all pages
- Shows title, application number, and date

#### Main PDF Document

- **File**: `components/pdf/LoanApplicationPDF.tsx`
- Combines all 7 pages into a single document
- Uses `@react-pdf/renderer` Document component

## Usage

### API Request Example

```bash
curl -X POST https://your-domain.com/api/personal-loan/generate-pdf/prime \
  -H "Content-Type: application/json" \
  -H "X-API-Secret: your-api-secret" \
  -d '{"loan_application_number": 687}'
```

### Response

- **Success (200)**: PDF file binary stream
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="loan-application-687.pdf"`
- **Error (4xx/5xx)**: JSON error message

## Error Handling

The system handles:

- Missing/invalid API secret → 401/403
- Missing loan_application_number → 400
- Loan application not found → 404
- Missing json_request data → 400
- Invalid JSON format → 500
- PDF generation errors → 500

## Data Validation

All data is validated and enriched:

- ✅ Database field lookups with descriptions
- ✅ Fallback values if lookups fail
- ✅ Type-safe data structures
- ✅ Proper error messages

## Database Fields Retrieved

From `tblLoanApplication`:

- `created_at` - Application timestamp
- `credit_sense_app_ref` - Credit Sense reference
- `credit_sense_app_id` - Credit Sense ID
- `app_sales_channel` - Sales channel
- `json_request` - Full application data (parsed)

## Server Actions Used

1. `getLoanApplicationDetailsByApplicationNumber()` - Fetches loan data
2. `getTradingBranches()` - Branch lookup
3. `getLoanPurposes()` - Loan purpose lookup
4. `getFeeCodes()` - Fee code lookup
5. `getLendingProducts()` - Product lookup

## Dependencies

```json
{
  "@react-pdf/renderer": "^4.3.1",
  "@types/react-pdf": "^7.0.0"
}
```

## File Structure

```
├── app/
│   └── api/
│       └── personal-loan/
│           └── generate-pdf/
│               └── prime/
│                   └── route.ts                    # Route handler
├── components/
│   └── pdf/
│       ├── LoanApplicationPDF.tsx                  # Main document
│       ├── sections/
│       │   ├── Header.tsx                          # Shared header
│       │   ├── ApplicationOverview.tsx             # Page 1
│       │   ├── PreliminaryInfo.tsx                 # Page 2
│       │   ├── PersonalDetails.tsx                 # Page 3
│       │   ├── EmploymentIncome.tsx                # Page 4
│       │   ├── ContactAddress.tsx                  # Page 5
│       │   ├── FinancialDetails.tsx                # Page 6
│       │   └── SecurityInsurance.tsx               # Page 7
│       └── styles/
│           └── pdfStyles.ts                        # Centralized styles
├── lib/
│   └── pdf/
│       ├── enrichLoanData.ts                       # Data enrichment
│       └── generatePrimeLoanPDF.ts                 # PDF generation
└── types/
    └── pdf/
        └── enrichedLoanData.ts                     # Type definitions
```

## Testing Checklist

- [ ] Test with valid loan_application_number
- [ ] Test with invalid/missing loan_application_number
- [ ] Test with missing API secret
- [ ] Test with invalid API secret
- [ ] Test with loan application that has no json_request
- [ ] Verify all 7 pages render correctly
- [ ] Verify all descriptions are populated
- [ ] Verify PDF downloads correctly
- [ ] Test with various insurance options
- [ ] Test with optional fields missing (e.g., passport, work phone)
- [ ] Test with different employment types
- [ ] Test with different fee combinations

## Future Enhancements

1. **Add watermark** for draft applications
2. **Include FCU logo** in header
3. **Page numbering** customization
4. **Digital signatures** support
5. **Multiple language support**
6. **PDF compression** for smaller file sizes
7. **Batch PDF generation** for multiple applications

## Notes

- The system uses **server actions** for all database queries
- PDF generation happens **server-side** for security
- All sensitive data remains on the server
- Type-safe implementation throughout
- Follows Next.js 14+ App Router patterns
- Uses React Server Components where possible
