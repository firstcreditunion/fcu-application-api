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
  Tailwind,
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
  // Generate the loan status link with security token

  // const membershipStatusLink = generateMembershipStatusLink({
  //   email: recipientEmail,
  //   membershipApplicationNumber: membershipApplicationNumber,
  //   applicantName: applicantName || firstName || 'Valued Customer',
  //   token: securityToken,
  // })
  return (
    <Html>
      <Head />
      <Preview>
        First Credit Union - Membership Application Confirmation
      </Preview>
      <Tailwind>
        <Body className='bg-white font-sans'>
          <Container className='mx-auto w-full max-w-[600px] p-0'>
            <Section className='p-8 text-start'>
              {/* <Text className='mx-0 mt-4 mb-8 p-0 text-center font-normal text-2xl'>
                  <span className='font-bold tracking-tighter text-fcu-primary-500'>
                    First Credit Union
                  </span>
                </Text> */}
              <Text className='font-normal text-sm uppercase text-center tracking-wider text-[#828282]'>
                Membership Application Confirmation
              </Text>
              <Heading className='my-4 font-medium text-lg leading-tight text-center'>
                Your Membership Application has been received.
              </Heading>
              <Text className='text-lg mt-8 font-medium leading-none tracking-tight'>
                Hi {primeFirstName},
              </Text>

              <Text className='mb-8 text-lg leading-8 tracking-tight'>
                Thank you for applying for a membership with First Credit Union.
                Please find below the details of your membership application.
              </Text>
            </Section>

            <Section
              style={codeBox}
              className='my-6 bg-[#29819a] bg-[radial-gradient(circle_at_bottom_right,#00687f_0%,transparent_60%)] p-8 text-center'
            >
              <Heading className='m-0 font-light text-2xl text-[#fff] tracking-tight'>
                Application Number
              </Heading>
              <Text className='mt-4 mb-10 font-bold text-5xl text-white leading-none tracking-tight'>
                {membershipApplicationNumber}
              </Text>

              <Heading className='pt-5 font-medium text-[#bbbb14] text-xs uppercase tracking-widest'>
                Application Details
              </Heading>

              {isJointApplication === true && (
                <Row className='mt-5'>
                  <Column className='w-full text-center'>
                    <Text className='font-light text-[#fff] text-sm tracking-widest uppercase'>
                      Joint Applicant
                    </Text>
                    <Text className='my-1 font-semibold text-2xl text-white tracking-tight'>
                      {jointTitle} {jointFirstName} {jointLastName}
                    </Text>
                  </Column>
                </Row>
              )}
              {savingProducts && savingProducts.length > 0 && (
                <Row className='mt-5'>
                  <Column className='w-full text-center'>
                    <Text className='font-light text-[#fff] text-sm tracking-widest uppercase'>
                      Savings Products Chosen
                    </Text>
                    {savingProducts.map((product) => (
                      <Text
                        key={product}
                        className='my-1 font-semibold text-2xl text-white tracking-tight'
                      >
                        {product}
                      </Text>
                    ))}
                  </Column>
                </Row>
              )}
              {transactionalProducts && transactionalProducts.length > 0 && (
                <Row className='mt-5'>
                  <Column className='w-full text-center'>
                    <Text className='font-light text-[#fff] text-sm tracking-widest uppercase'>
                      Transactional Products Chosen
                    </Text>
                    {transactionalProducts.map((product) => (
                      <Text
                        key={product}
                        className='my-1 font-semibold text-2xl text-white tracking-tight'
                      >
                        {product}
                      </Text>
                    ))}
                  </Column>
                </Row>
              )}
              {termDeposit === true && (
                <Row className='mt-5'>
                  <Column className='w-full text-center'>
                    <Text className='font-light text-[#fff] text-sm tracking-widest uppercase'>
                      Term Deposit
                    </Text>
                    <Text className='my-1 font-semibold text-2xl text-white tracking-tight'>
                      Yes
                    </Text>
                  </Column>
                </Row>
              )}
              {requireRemoteBanking === true && (
                <Row className='mt-5'>
                  <Column className='w-full text-center'>
                    <Text className='font-light text-[#fff] text-sm tracking-widest uppercase'>
                      Remote Banking
                    </Text>
                    <Text className='my-1 font-semibold text-2xl text-white '>
                      Yes
                    </Text>
                  </Column>
                </Row>
              )}
              {requireDebitCard === true && (
                <Row className='mt-5'>
                  <Column className='w-full text-center'>
                    <Text className='font-light text-[#fff] text-sm tracking-widest uppercase'>
                      First Credit Union Debit Mastercard®
                    </Text>
                    <Text className='my-1 font-semibold text-2xl text-white '>
                      Yes
                    </Text>
                  </Column>
                </Row>
              )}

              {submittedDateTime && (
                <Row className='mt-5'>
                  <Column className='w-full text-center'>
                    <Text className='my-1 font-light text-xs text-gray-200 uppercase'>
                      Submitted Date & Time:{' '}
                      {format(
                        new Date(submittedDateTime),
                        'dd/MM/yyyy hh:mm:ss aaaa'
                      )}
                    </Text>
                    {/* <Text className='text-2xl text-gray-900'>views</Text> */}
                  </Column>
                </Row>
              )}
            </Section>
            <Section>
              <Row>
                <Text className='m-0 mt-[8px] text-[16px] leading-[24px]'>
                  Before we can open your account, we require the following
                  documents:
                </Text>
              </Row>
            </Section>
            <Section>
              <Row className='items-center'>
                <Column className='w-[90%]'>
                  <Text className='m-0 text-[20px] font-semibold leading-[28px]'>
                    <strong>Identification and Proof of Address</strong>
                  </Text>
                  <Text className='m-0 mt-[8px] text-[16px] leading-[24px]'>
                    Two colour copies of identifications and Proof of Address.
                    At least one form of identification{' '}
                    <strong>must contain a photo</strong>.{' '}
                    <Link style={anchor} href={linkToIdentification}>
                      Click here
                    </Link>{' '}
                    to view the forms of identification and proof of address we
                    can accept.
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className='mx-0 my-[24px] w-full border border-solid !border-gray-300' />
            <Text>
              Please note that all identification and proof of address need to
              be certified by a trusted referee which is outlined in forms of
              identification link.
            </Text>
            <Text>
              Please email the above documents through to this email. Upon
              receiving your documents, you will receive a link by email to
              validate that your identity documents are authentic through a
              third-party company called Cloudcheck. Once that process is done,
              we will then get in touch with you.
            </Text>
            <Text>
              <strong>
                Please note: If we do not receive the above documents, we will
                be unable to open your First Credit Union account.
              </strong>
            </Text>
            <Text>
              If you have any questions, please give us a call. Our call centre
              is open Monday 10am-5pm and Tuesday – Friday 8am-5pm (excluding
              public holidays).
            </Text>
            <Text>We look forward to hearing from you.</Text>
            <Text>— First Credit Union team</Text>

            <Hr style={hr} />
            <Section style={footer}>
              <Row>
                <Text style={{ textAlign: 'center', color: '#474747' }}>
                  ©{toCurrentYear} First Credit Union, All Rights Reserved{' '}
                  <br />
                  111 Collingwood Street, Hamilton Central, Hamilton 3204
                </Text>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
}

const codeBox = {
  borderRadius: '16px',
  marginBottom: '30px',
  padding: '30px 10px',
}

const anchor = {
  color: '#00687f',
}
