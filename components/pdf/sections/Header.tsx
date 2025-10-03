import React from 'react'
import { View, Text } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'

interface HeaderProps {
  title: string
  applicationNumber: number
  date: string
}

export const PDFHeader: React.FC<HeaderProps> = ({
  title,
  applicationNumber,
  date,
}) => {
  return (
    <View style={pdfStyles.header}>
      <Text style={pdfStyles.title}>{title}</Text>
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.label}>Application Number:</Text>
        <Text style={pdfStyles.value}>{applicationNumber}</Text>
      </View>
      <View style={pdfStyles.row}>
        <Text style={pdfStyles.label}>Application Date:</Text>
        <Text style={pdfStyles.value}>{date}</Text>
      </View>
    </View>
  )
}
