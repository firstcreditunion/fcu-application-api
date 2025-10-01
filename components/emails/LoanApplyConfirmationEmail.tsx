import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import {
  generateLoanStatusLink,
  generateSecureToken,
} from '../../lib/loan-status-link-generator'

interface EmailProps {
  recipientEmail: string
  title?: string
  firstName?: string
  loanAmount?: string
  instalmentAmount?: string
  instalmentFrequencyHeader?: string
  loanTerm?: string
  interestRate?: string
  totalInterest?: string
  totalAmountPayable?: string
  insuranceAmount?: string
  needProvidentInsurance?: string
  insuranceType?: string
  coverType?: string
  coversIncluded?: string
  tempLoanApplicationNumber?: string
  submittedDateTime: string
  loanApplicationNumber: string
  applicantName?: string
}

const linkToIdentification = process.env.IDENTIFICATION_LINK_WEBSITE!

const toCurrentYear = new Date().getFullYear()

export default function LoanApplyConfirmationEmail({
  recipientEmail,
  firstName,
  loanAmount,
  totalInterest,
  totalAmountPayable,
  instalmentAmount,
  instalmentFrequencyHeader,
  insuranceAmount,
  needProvidentInsurance,
  insuranceType,
  coverType,
  coversIncluded,
  submittedDateTime,
  loanApplicationNumber,
  applicantName,
}: EmailProps) {
  const securityToken = generateSecureToken(
    recipientEmail,
    loanApplicationNumber
  )
  const loanStatusLink = generateLoanStatusLink({
    email: recipientEmail,
    loanApplicationNumber: loanApplicationNumber,
    applicantName: applicantName || firstName || 'Valued Customer',
    token: securityToken,
  })

  return (
    <Html>
      <Head />
      <Preview>First Credit Union - Loan Application Confirmation</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerSectionStyle}>
            <Text style={confirmationLabelStyle}>
              Loan Application Confirmation
            </Text>
            <Heading style={mainHeadingStyle}>
              Your Loan Application has been received.
            </Heading>
            <Text style={greetingStyle}>Hi {firstName},</Text>
            <Text style={introTextStyle}>
              Thank you for applying for a loan with First Credit Union. Please
              find below the details of your loan application.
            </Text>
          </Section>

          <Section style={buttonSectionStyle}>
            <Link href={loanStatusLink} style={buttonStyle}>
              Track my application
            </Link>
          </Section>

          <Section style={loanDetailsBoxStyle}>
            <Heading style={loanAmountHeadingStyle}>Loan Amount</Heading>
            <Text style={loanAmountValueStyle}>${loanAmount}</Text>

            <Heading style={repaymentDetailsHeadingStyle}>
              Repayment Details
            </Heading>

            <Row style={detailRowStyle}>
              <Column style={detailColumnStyle}>
                <Text style={detailLabelStyle}>
                  {instalmentFrequencyHeader}
                </Text>
                <Text style={detailValueStyle}>${instalmentAmount}</Text>
              </Column>
            </Row>

            <Row style={detailRowStyle}>
              <Column style={detailColumnStyle}>
                <Text style={detailLabelStyle}>Total Interest</Text>
                <Text style={detailValueStyle}>${totalInterest}</Text>
              </Column>
            </Row>

            <Row style={detailRowStyle}>
              <Column style={detailColumnStyle}>
                <Text style={detailLabelStyle}>Amount Payable</Text>
                <Text style={detailValueStyle}>${totalAmountPayable}</Text>
              </Column>
            </Row>

            {needProvidentInsurance === 'Yes' && (
              <Row style={detailRowStyle}>
                <Column style={detailColumnStyle}>
                  <Text style={detailLabelStyle}>
                    Provident CreditCare Insurance Premium
                  </Text>
                  <Text style={detailValueStyle}>${insuranceAmount}</Text>
                </Column>
              </Row>
            )}

            {needProvidentInsurance === 'Yes' && (
              <Row style={detailRowStyle}>
                <Column style={detailColumnStyle}>
                  <Text style={detailLabelStyle}>Insurance Type</Text>
                  <Text style={detailValueStyle}>{insuranceType}</Text>
                </Column>
              </Row>
            )}

            {needProvidentInsurance === 'Yes' && (
              <Row style={detailRowStyle}>
                <Column style={detailColumnStyle}>
                  <Text style={detailLabelStyle}>Cover Type</Text>
                  <Text style={detailValueStyle}>{coverType}</Text>
                </Column>
              </Row>
            )}

            {needProvidentInsurance === 'Yes' && (
              <Row style={detailRowStyle}>
                <Column style={detailColumnStyle}>
                  <Text style={detailLabelStyle}>Covers Included</Text>
                  <Text style={detailValueLargeStyle}>{coversIncluded}</Text>
                </Column>
              </Row>
            )}

            <Row style={detailRowStyle}>
              <Column style={detailColumnStyle}>
                <Text style={submittedDateStyle}>
                  Submitted Date & Time: {submittedDateTime}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section>
            <Row>
              <Text style={documentRequirementStyle}>
                Before we can open your account, we require the following
                documents:
              </Text>
            </Row>
          </Section>

          <Section>
            <Row>
              <Column style={documentColumnStyle}>
                <Text style={documentHeadingStyle}>
                  <strong>Identification and Proof of Address</strong>
                </Text>
                <Text style={documentTextStyle}>
                  Two colour copies of identifications and Proof of Address. At
                  least one form of identification{' '}
                  <strong>must contain a photo</strong>.{' '}
                  <Link style={anchor} href={linkToIdentification}>
                    Click here
                  </Link>{' '}
                  to view the forms of identification and proof of address we
                  can accept.
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Text style={bodyTextStyle}>
            Please note that all identification and proof of address need to be
            certified by a trusted referee which is outlined in forms of
            identification link.
          </Text>
          <Text style={bodyTextStyle}>
            Please email the above documents through to this email. Upon
            receiving your documents, you will receive a link by email to
            validate that your identity documents are authentic through a
            third-party company called Cloudcheck. Once that process is done, we
            will then get in touch with you.
          </Text>
          <Text style={bodyTextStyle}>
            <strong>
              Please note: If we do not receive the above documents, we will be
              unable to open your First Credit Union account.
            </strong>
          </Text>
          <Text style={bodyTextStyle}>
            If you have any questions, please give us a call. Our call centre is
            open Monday 10am-5pm and Tuesday – Friday 8am-5pm (excluding public
            holidays).
          </Text>
          <Text style={bodyTextStyle}>
            We look forward to hearing from you.
          </Text>
          <Text style={bodyTextStyle}>— First Credit Union team</Text>

          <Hr style={hr} />
          <Section style={footer}>
            <Row>
              <Text style={footerTextStyle}>
                ©{toCurrentYear} First Credit Union, All Rights Reserved <br />
                111 Collingwood Street, Hamilton Central, Hamilton 3204
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Inline styles for Outlook compatibility
const bodyStyle = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
}

const containerStyle = {
  margin: '0 auto',
  width: '100%',
  maxWidth: '600px',
  padding: 0,
}

const headerSectionStyle = {
  padding: '32px',
  textAlign: 'left' as const,
}

const confirmationLabelStyle = {
  fontSize: '14px',
  fontWeight: 'normal' as const,
  textTransform: 'uppercase' as const,
  textAlign: 'center' as const,
  letterSpacing: '0.05em',
  color: '#828282',
  margin: 0,
}

const mainHeadingStyle = {
  margin: '16px 0',
  fontSize: '18px',
  fontWeight: '500' as const,
  lineHeight: '1.3',
  textAlign: 'center' as const,
  color: '#000000',
}

const greetingStyle = {
  fontSize: '18px',
  marginTop: '32px',
  fontWeight: '500' as const,
  lineHeight: '1',
  letterSpacing: '-0.025em',
  color: '#000000',
}

const introTextStyle = {
  marginBottom: '32px',
  fontSize: '18px',
  lineHeight: '2',
  letterSpacing: '-0.025em',
  color: '#000000',
}

const buttonSectionStyle = {
  paddingBottom: '64px',
  textAlign: 'center' as const,
}

const buttonStyle = {
  display: 'inline-block',
  backgroundColor: '#bbbb14',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '16px 48px',
  borderRadius: '9999px',
  letterSpacing: '-0.025em',
}

const loanDetailsBoxStyle = {
  margin: '24px 0',
  backgroundColor: '#29819a',
  padding: '32px 40px',
  textAlign: 'center' as const,
}

const loanAmountHeadingStyle = {
  margin: 0,
  fontSize: '24px',
  fontWeight: '300' as const,
  color: '#ffffff',
  letterSpacing: '-0.025em',
}

const loanAmountValueStyle = {
  marginTop: '16px',
  marginBottom: '40px',
  fontSize: '48px',
  fontWeight: 'bold' as const,
  color: '#ffffff',
  lineHeight: '1',
  letterSpacing: '-0.025em',
}

const repaymentDetailsHeadingStyle = {
  paddingTop: '20px',
  fontSize: '12px',
  fontWeight: '500' as const,
  color: '#bbbb14',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  margin: 0,
}

const detailRowStyle = {
  marginTop: '20px',
}

const detailColumnStyle = {
  width: '100%',
  textAlign: 'center' as const,
}

const detailLabelStyle = {
  fontSize: '14px',
  fontWeight: '300' as const,
  color: '#ffffff',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  margin: 0,
}

const detailValueStyle = {
  margin: '4px 0',
  fontSize: '24px',
  fontWeight: '600' as const,
  color: '#ffffff',
  letterSpacing: '-0.025em',
}

const detailValueLargeStyle = {
  margin: '4px 0',
  fontSize: '18px',
  fontWeight: '600' as const,
  color: '#ffffff',
  letterSpacing: '-0.025em',
}

const submittedDateStyle = {
  margin: '4px 0',
  fontSize: '12px',
  fontWeight: '300' as const,
  color: '#e5e5e5',
  textTransform: 'uppercase' as const,
}

const documentRequirementStyle = {
  margin: '8px 0 0 0',
  fontSize: '16px',
  lineHeight: '24px',
  color: '#000000',
}

const documentColumnStyle = {
  width: '90%',
}

const documentHeadingStyle = {
  margin: 0,
  fontSize: '20px',
  fontWeight: '600' as const,
  lineHeight: '28px',
  color: '#000000',
}

const documentTextStyle = {
  margin: '8px 0 0 0',
  fontSize: '16px',
  lineHeight: '24px',
  color: '#000000',
}

const bodyTextStyle = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#000000',
  margin: '16px 0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '24px 0',
  width: '100%',
  border: '1px solid #d1d5db',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
}

const footerTextStyle = {
  textAlign: 'center' as const,
  color: '#474747',
  fontSize: '12px',
  lineHeight: '16px',
}

const anchor = {
  color: '#00687f',
}
