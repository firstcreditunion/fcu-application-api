import { StyleSheet } from '@react-pdf/renderer'

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #003366',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
    marginTop: 15,
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
    color: '#333333',
  },
  value: {
    width: '60%',
    color: '#000000',
  },
  table: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #cccccc',
    paddingTop: 5,
    paddingBottom: 5,
  },
  tableHeader: {
    backgroundColor: '#003366',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
  },
  tableCellCode: {
    width: '30%',
  },
  tableCellDescription: {
    width: '70%',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666666',
    fontSize: 8,
    borderTop: '1 solid #cccccc',
    paddingTop: 5,
  },
  pageNumber: {
    fontSize: 8,
    color: '#666666',
  },
  divider: {
    borderBottom: '1 solid #cccccc',
    marginTop: 10,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#e8f4f8',
    padding: 5,
    borderRadius: 3,
    marginBottom: 5,
  },
  highlight: {
    backgroundColor: '#fffacd',
    padding: 2,
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 3,
  },
  errorText: {
    color: '#cc0000',
    fontStyle: 'italic',
  },
})
