# Joint Loan Application PDF Generation Implementation

## Overview

A comprehensive PDF generation system for Joint Loan Applications has been implemented. This system generates a 12-page PDF document that includes information for both the Prime Applicant and Joint Applicant.

## Architecture

### Route Handler

- **Endpoint**: `POST /api/personal-loan/generate-pdf/joint`
- **File**: `app/api/personal-loan/generate-pdf/joint/route.ts`
- **Authentication**: API Secret via `X-API-Secret` header (uses `MEMBERSHIP_ENDPOINT_SECRET`)
- **Input**: `{ loan_application_number: number }`
- **Output**: PDF file as binary stream

### PDF Structure (12 Pages)

#### **Prime Applicant Section** (Pages 1-7)

1. **Application Overview** - Applicant info, contact details, credit sense refs
2. **Preliminary Information** - Citizenship, bankruptcy, loan purpose, branch
3. **Personal Details & Identification** - Full details and ID documents
4. **Employment & Income** - Employment type, occupation, income details
5. **Contact & Address Details** - Residential and mailing addresses
6. **Financial Details** - Loan product, terms, fees, payment summary
7. **Security & Insurance** - Available insurance options catalog

#### **Joint Applicant Section** (Pages 8-12)

8. **Joint - Preliminary Information** - Citizenship, visa details, bankruptcy
9. **Joint - Personal Details & Identification** - Full details and ID documents
10. **Joint - Employment & Income** - Employment type, occupation, income
11. **Joint - Contact & Address Details** - Residential and mailing addresses
12. **Loan Security & Insurance** - Vehicle security details, selected insurance

## Key Features

### Enhanced Data for Joint Applications

- **Visa Information**: Tracks visa start/expiry dates for non-residents
- **Vehicle Security Details**:
  - Vehicle purchased status
  - Registration number
  - Insurance status
  - Insurer name
- **Selected Insurance Coverage**:
  - Insurance type (Single/Double/Joint)
  - Cover type (Option 1/2/3)
  - Coverage description
  - Premium amount

### Data Enrichment

Both prime and joint applicant data includes:

- Trading branch descriptions
- Loan purpose descriptions
- Employment type descriptions
- Occupation descriptions
- Product descriptions
- Fee code descriptions

## File Structure

```
├── types/
│   └── pdf/
│       └── enrichedJointLoanData.ts          # Type definitions
├── lib/
│   └── pdf/
│       ├── enrichJointLoanData.ts            # Data enrichment
│       └── generateJointLoanPDF.ts           # PDF generation
├── components/
│   └── pdf/
│       ├── JointLoanApplicationPDF.tsx       # Main document
│       └── sections/
│           ├── JointPreliminaryInfo.tsx      # Page 8
│           ├── JointPersonalDetails.tsx      # Page 9
│           ├── JointEmploymentIncome.tsx     # Page 10
│           ├── JointContactAddress.tsx       # Page 11
│           └── JointVehicleSecurity.tsx      # Page 12
└── app/
    └── api/
        └── personal-loan/
            └── generate-pdf/
                └── joint/
                    └── route.ts              # Route handler
```

## Data Flow

```
Request (loan_application_number)
    ↓
API Authentication
    ↓
Fetch Loan Data (getLoanApplicationDetailsByApplicationNumber)
    ↓
Parse json_request
    ↓
Enrich Data (enrichJointLoanData)
    ├─ Prime Employment Type → Description
    ├─ Prime Occupation → Description
    ├─ Joint Employment Type → Description
    ├─ Joint Occupation → Description
    ├─ Trading Branch → Description
    ├─ Loan Purpose → Description
    ├─ Product → Description
    └─ Fees → Descriptions
    ↓
Generate PDF (generateJointLoanPDF)
    ├─ Prime Applicant Pages (reusing existing components)
    └─ Joint Applicant Pages (new components)
    ↓
Return PDF
```

## API Usage

### Request Example

```bash
curl -X POST http://localhost:3000/api/personal-loan/generate-pdf/joint \
  -H "Content-Type: application/json" \
  -H "X-API-Secret: your-secret" \
  -d '{"loan_application_number": 691}'
```

### Response

- **Success (200)**: PDF file binary stream
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="joint-loan-application-691.pdf"`
- **Error (4xx/5xx)**: JSON error message

## Differences from Prime PDF

| Feature                      | Prime PDF          | Joint PDF                          |
| ---------------------------- | ------------------ | ---------------------------------- |
| **Pages**                    | 7 pages            | 12 pages                           |
| **Applicants**               | 1 (Prime only)     | 2 (Prime + Joint)                  |
| **Visa Information**         | ❌                 | ✅ (for Joint)                     |
| **Vehicle Security Details** | Basic (Y/N)        | Extended (reg, insurance, insurer) |
| **Insurance Selection**      | Shows catalog only | Shows selected coverage + catalog  |
| **Premium Amount**           | Not shown          | ✅ Shown if selected               |
| **Covers Included**          | Not shown          | ✅ Shown if selected               |

## Component Reuse

The implementation efficiently reuses existing Prime components:

- Prime applicant sections (Pages 1-7) use the **same components** as Prime PDF
- Joint applicant sections (Pages 8-11) use **new components** with similar structure
- This approach:
  - ✅ Maintains consistency
  - ✅ Reduces code duplication
  - ✅ Easier maintenance

## Data Type Structure

### EnrichedJointLoanData Interface

Extends the prime data structure with:

```typescript
{
  // All prime applicant fields
  primePreliminaryQuestions: { ... }
  primePersonalDetails: { ... }
  primeEmployment: { ... }
  primeContactDetails: { ... }
  // ... other prime fields

  // Joint applicant fields
  jointPreliminaryQuestions: {
    visaStartDate?: string
    visaExpiryDate?: string
    ...
  }
  jointPersonalDetails: { ... }
  jointEmployment: { ... }
  jointContactDetails: { ... }
  // ... other joint fields

  // Enhanced vehicle security
  vehicleSecurity: {
    provideVehicleAsLoanSecurity: string
    haveYouPurchasedVehicle?: string
    vehicleRegistrationNumber?: string
    isVehicleInsured?: string
    nameOfInsurer?: string
  }

  // Enhanced financial details
  formFinancialDetails: {
    // ... existing fields
    component?: string           // Insurance type
    coverType?: string          // Cover type
    premiumAmount?: number      // Premium amount
    coversIncluded?: string     // Coverage description
  }
}
```

## Error Handling

Handles all scenarios:

- ✅ Missing/invalid API secret → 401/403
- ✅ Missing loan_application_number → 400
- ✅ Loan application not found → 404
- ✅ Missing json_request data → 400
- ✅ Invalid JSON format → 500
- ✅ PDF generation errors → 500
- ✅ Data enrichment failures → Error logged and thrown

## Testing Checklist

- [ ] Test with valid joint loan application number
- [ ] Test with invalid/missing loan application number
- [ ] Test with missing API secret
- [ ] Test with invalid API secret
- [ ] Test all 12 pages render correctly
- [ ] Verify prime applicant data displays correctly
- [ ] Verify joint applicant data displays correctly
- [ ] Verify vehicle security details show when provided
- [ ] Verify selected insurance displays correctly
- [ ] Test with visa information (non-NZ resident)
- [ ] Test with various employment types (both applicants)
- [ ] Test with different insurance selections
- [ ] Verify PDF downloads correctly
- [ ] Test with optional fields missing

## Environment Variables

```env
MEMBERSHIP_ENDPOINT_SECRET=your-secret-key-here
```

## Dependencies

Same as Prime PDF:

```json
{
  "@react-pdf/renderer": "^4.3.1",
  "@types/react-pdf": "^7.0.0",
  "date-fns": "^2.x.x"
}
```

## Server Actions Used

1. `getLoanApplicationDetailsByApplicationNumber()` - Fetches loan data
2. `getTradingBranches()` - Branch lookup
3. `getLoanPurposes()` - Loan purpose lookup
4. `getFeeCodes()` - Fee code lookup
5. `getLendingProducts()` - Product lookup
6. `employmentTypesFallback` - Employment type lookup (from `utils/fallback.ts`)
7. `occupationFallback` - Occupation lookup (from `utils/fallback.ts`)

## Performance Considerations

- All lookups performed in **parallel** using `Promise.all()`
- Type-safe implementation reduces runtime errors
- Efficient data structure reduces memory usage
- PDF generated server-side for security

## Security

- ✅ API secret authentication required
- ✅ Server-side PDF generation
- ✅ No client-side data exposure
- ✅ Validates all inputs
- ✅ Type-safe implementation

## Future Enhancements

1. Add FCU logo to header
2. Digital signatures support
3. Watermark for draft applications
4. Multiple language support
5. PDF compression
6. Email delivery integration
7. Batch PDF generation
8. PDF archiving system

## Notes

- Joint PDF includes **all information from Prime PDF** plus joint applicant data
- Vehicle security section enhanced to show registration and insurance details
- Insurance section shows both available options and selected coverage
- Visa information only shown when applicable
- Accommodation type includes "OWOM" (Own Outright) for joint applications
- Page numbering continues sequentially from prime to joint sections
- All dates formatted consistently using `date-fns`
- Currency values formatted with $ prefix
