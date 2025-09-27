import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import { format } from 'date-fns'

interface ConfirmationEmailProps {
  recipientEmail: string
  primeTitle?: string
  primeFirstName?: string
  primeLastName?: string

  isJointApplication?: boolean

  jointTitle?: string
  jointFirstName?: string
  jointLastName?: string

  savingProducts?: string[]
  transactionalProducts?: string[]
  termDeposit?: boolean

  requireRemoteBanking?: boolean
  requireDebitCard?: boolean

  submittedDateTime: string
  membershipApplicationNumber?: number
}

const linkToIdentification = process.env.IDENTIFICATION_LINK_WEBSITE!
const toCurrentYear = new Date().getFullYear()

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse' as const,
}

export default function MembershipConfirmationEmail({
  recipientEmail,
  primeTitle,
  primeFirstName,
  primeLastName,
  isJointApplication,
  jointTitle,
  jointFirstName,
  jointLastName,
  savingProducts,
  transactionalProducts,
  termDeposit,
  requireRemoteBanking,
  requireDebitCard,
  submittedDateTime,
  membershipApplicationNumber,
}: ConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        First Credit Union - Membership Application Confirmation
      </Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerSectionStyle}>
            <Text style={subHeaderStyle}>
              Membership Application Confirmation
            </Text>
            <Heading style={mainHeadingStyle}>
              Your Membership Application has been received.
            </Heading>
            <Text style={greetingStyle}>Hi {primeFirstName},</Text>

            <Text style={introTextStyle}>
              Thank you for applying for a membership with First Credit Union.
              Please find below the details of your membership application.
            </Text>
          </Section>

          <table style={applicationBoxTableStyle}>
            <tr>
              <td style={applicationBoxCellStyle}>
                <table style={innerTableStyle}>
                  <tr>
                    <td style={innerCellStyle}>
                      <Heading style={applicationNumberHeadingStyle}>
                        Application Number
                      </Heading>
                      <Text style={applicationNumberStyle}>
                        {membershipApplicationNumber}
                      </Text>

                      <Heading style={detailsHeadingStyle}>
                        Application Details
                      </Heading>

                      {isJointApplication === true && (
                        <div style={detailRowStyle}>
                          <Text style={detailLabelStyle}>Joint Applicant</Text>
                          <Text style={detailValueStyle}>
                            {jointTitle} {jointFirstName} {jointLastName}
                          </Text>
                        </div>
                      )}

                      {savingProducts && savingProducts.length > 0 && (
                        <div style={detailRowStyle}>
                          <Text style={detailLabelStyle}>
                            Savings Products Chosen
                          </Text>
                          {savingProducts.map((product) => (
                            <Text key={product} style={detailValueStyle}>
                              {product}
                            </Text>
                          ))}
                        </div>
                      )}

                      {transactionalProducts &&
                        transactionalProducts.length > 0 && (
                          <div style={detailRowStyle}>
                            <Text style={detailLabelStyle}>
                              Transactional Products Chosen
                            </Text>
                            {transactionalProducts.map((product) => (
                              <Text key={product} style={detailValueStyle}>
                                {product}
                              </Text>
                            ))}
                          </div>
                        )}

                      {termDeposit === true && (
                        <div style={detailRowStyle}>
                          <Text style={detailLabelStyle}>Term Deposit</Text>
                          <Text style={detailValueStyle}>Yes</Text>
                        </div>
                      )}

                      {requireRemoteBanking === true && (
                        <div style={detailRowStyle}>
                          <Text style={detailLabelStyle}>Remote Banking</Text>
                          <Text style={detailValueStyle}>Yes</Text>
                        </div>
                      )}

                      {requireDebitCard === true && (
                        <div style={detailRowStyle}>
                          <Text style={detailLabelStyle}>
                            First Credit Union Debit Mastercard®
                          </Text>
                          <Text style={detailValueStyle}>Yes</Text>
                        </div>
                      )}

                      {submittedDateTime && (
                        <div style={detailRowStyle}>
                          <Text style={submittedDateStyle}>
                            Submitted Date & Time:{' '}
                            {format(
                              new Date(submittedDateTime),
                              'dd/MM/yyyy hh:mm:ss aaaa'
                            )}
                          </Text>
                        </div>
                      )}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <Section>
            <Text style={bodyTextStyle}>
              Before we can open your account, we require the following
              documents:
            </Text>
          </Section>

          <Section>
            <table style={tableStyle}>
              <tr>
                <td style={documentSectionStyle}>
                  <Text style={documentHeadingStyle}>
                    <strong>Identification and Proof of Address</strong>
                  </Text>
                  <Text style={bodyTextStyle}>
                    If you have a NZ Passport we only require one form of
                    identification. Otherwise we require two forms of
                    identification, and a Proof of Address. At least one form of
                    identification <strong>must contain a photo</strong>.{' '}
                    <Link style={linkStyle} href={linkToIdentification}>
                      Click here
                    </Link>{' '}
                    to view the forms of identification and proof of address we
                    can accept.
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          <Hr style={hrStyle} />

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

          <Hr style={hrStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              ©{toCurrentYear} First Credit Union, All Rights Reserved <br />
              111 Collingwood Street, Hamilton Central, Hamilton 3204
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const bodyStyle = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  margin: '0',
  padding: '0',
}

const containerStyle = {
  margin: '0 auto',
  width: '100%',
  maxWidth: '600px',
  padding: '0',
}

const headerSectionStyle = {
  padding: '32px',
  textAlign: 'left' as const,
}

const subHeaderStyle = {
  fontWeight: 'normal',
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  textAlign: 'center' as const,
  letterSpacing: '0.1em',
  color: '#6b7280',
  margin: '0',
}

const mainHeadingStyle = {
  margin: '16px 0',
  fontWeight: '600',
  fontSize: '20px',
  lineHeight: '1.3',
  textAlign: 'center' as const,
  color: '#111827',
}

const greetingStyle = {
  fontSize: '18px',
  fontWeight: '500',
  lineHeight: '1.4',
  color: '#111827',
  margin: '32px 0 0 0',
}

const introTextStyle = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#374151',
  margin: '16px 0 32px 0',
}

const applicationBoxTableStyle = {
  width: '100%',
  backgroundColor: '#00687f',
  borderRadius: '16px',
  marginBottom: '32px',
  borderCollapse: 'collapse' as const,
}

const applicationBoxCellStyle = {
  padding: '32px 24px',
  textAlign: 'center' as const,
}

const innerTableStyle = {
  width: '100%',
  borderCollapse: 'collapse' as const,
}

const innerCellStyle = {
  padding: '0',
  textAlign: 'center' as const,
}

const applicationNumberHeadingStyle = {
  margin: '0',
  fontWeight: '400',
  fontSize: '18px',
  color: '#e0e7ff',
  letterSpacing: '0.025em',
}

const applicationNumberStyle = {
  marginTop: '12px',
  marginBottom: '32px',
  fontWeight: '700',
  fontSize: '42px',
  color: '#ffffff',
  lineHeight: '1',
  letterSpacing: '-0.025em',
}

const detailsHeadingStyle = {
  paddingTop: '24px',
  fontWeight: '600',
  color: '#fbbf24',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  margin: '0',
}

const detailRowStyle = {
  marginTop: '16px',
}

const detailLabelStyle = {
  fontWeight: '400',
  color: '#e0e7ff',
  fontSize: '13px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px 0',
}

const detailValueStyle = {
  margin: '0 0 8px 0',
  fontWeight: '600',
  fontSize: '18px',
  color: '#ffffff',
  letterSpacing: '-0.015em',
  lineHeight: '1.3',
}

const submittedDateStyle = {
  margin: '8px 0 0 0',
  fontWeight: '400',
  fontSize: '11px',
  color: '#cbd5e1',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}

const bodyTextStyle = {
  margin: '0 0 16px 0',
  padding: '0 16px',
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
}

const documentSectionStyle = {
  width: '100%',
  padding: '0 0px',
}

const documentHeadingStyle = {
  margin: '0 0 12px 0',
  padding: '0 16px',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '1.4',
  color: '#111827',
}

const linkStyle = {
  color: '#00687f',
  textDecoration: 'underline',
}

const hrStyle = {
  borderColor: '#6b7280',
  margin: '32px 0',
  padding: '0 16px',
  border: '1px solid #6b7280',
  width: '100%',
}

const footerStyle = {
  padding: '0 32px',
}

const footerTextStyle = {
  textAlign: 'center' as const,
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0',
}
