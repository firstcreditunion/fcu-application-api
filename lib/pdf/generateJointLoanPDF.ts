'use server'

import { renderToBuffer } from '@react-pdf/renderer'
import { EnrichedJointLoanData } from '@/types/pdf/enrichedJointLoanData'
import { JointLoanApplicationPDF } from '@/components/pdf/JointLoanApplicationPDF'
import React from 'react'

export async function generateJointLoanPDF(
  data: EnrichedJointLoanData
): Promise<Buffer> {
  try {
    // Create React element for the PDF document
    const pdfElement = React.createElement(JointLoanApplicationPDF, { data })

    // Render to buffer
    // @ts-expect-error - React PDF types are incompatible with server components
    const pdfBuffer = await renderToBuffer(pdfElement)

    return pdfBuffer
  } catch (error) {
    console.error('Error generating joint PDF:', error)
    throw new Error('Failed to generate joint PDF')
  }
}
