'use server'

import { renderToBuffer } from '@react-pdf/renderer'
import { EnrichedPrimeLoanData } from '@/types/pdf/enrichedLoanData'
import { LoanApplicationPDF } from '@/components/pdf/LoanApplicationPDF'
import React from 'react'

export async function generatePrimeLoanPDF(
  data: EnrichedPrimeLoanData
): Promise<Buffer> {
  try {
    // Create React element for the PDF document
    const pdfElement = React.createElement(LoanApplicationPDF, { data })

    // Render to buffer
    // @ts-expect-error - React PDF types are incompatible with server components
    const pdfBuffer = await renderToBuffer(pdfElement)

    return pdfBuffer
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF')
  }
}
