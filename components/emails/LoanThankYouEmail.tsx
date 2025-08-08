import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
  Row,
  Column,
  Tailwind,
} from '@react-email/components'

const LoanThankYouEmail = (props) => {
  const { firstName, applicationNumber } = props

  return (
    <Html lang='en' dir='ltr'>
      <Tailwind>
        <Head />
        <Preview>
          Your loan application has been received - Application #
          {applicationNumber}
        </Preview>
        <Body className='bg-[#F6F8FA] font-sans py-[40px]'>
          <Container className='bg-[#FFFFFF] mx-auto rounded-[12px] max-w-[600px] overflow-hidden shadow-lg'>
            {/* Header with Gradient Background */}
            <Section className='bg-gradient-to-r from-[#00687f] to-[#004d61] px-[40px] py-[32px] text-center'>
              <Img
                src='https://firstcreditunion-loans-test.vercel.app/_next/static/media/logo.svg'
                alt='First Credit Union'
                className='w-full h-auto max-w-[180px] mx-auto mb-[16px] brightness-0 invert'
              />
              <Heading className='text-white text-[28px] font-bold m-0 mb-[8px]'>
                Application Received!
              </Heading>
              <Text className='text-white/90 text-[16px] m-0 opacity-90'>
                Thank you for choosing First Credit Union
              </Text>
            </Section>

            {/* Main Content */}
            <Section className='px-[40px] py-[40px]'>
              {/* Success Message */}
              <Section className='text-center mb-[32px]'>
                <div className='inline-block w-[64px] h-[64px] bg-[#bbbb14] rounded-full mb-[16px] flex items-center justify-center'>
                  <Text className='text-[#00687f] text-[32px] font-bold m-0'>
                    ✓
                  </Text>
                </div>
                <Heading className='text-[#00687f] text-[24px] font-bold m-0 mb-[8px]'>
                  We've received your loan application!
                </Heading>
              </Section>

              {/* Personal Greeting */}
              <Section className='mb-[32px]'>
                <Text className='text-[#00687f] text-[18px] m-0 mb-[16px] font-semibold'>
                  Hi {firstName},
                </Text>
                <Text className='text-[#00687f] text-[16px] m-0 mb-[16px] leading-[26px]'>
                  Thank you for applying for a loan with First Credit Union. We
                  appreciate your trust in our financial services and are
                  committed to helping you achieve your financial goals.
                </Text>
              </Section>

              {/* Application Details Card */}
              <Section className='mb-[32px]'>
                <div className='bg-gradient-to-br from-[#F6F8FA] to-[#E8F4F8] p-[24px] rounded-[12px] border-[2px] border-solid border-[#bbbb14]/20'>
                  <Row>
                    <Column className='w-[80px]'>
                      <div className='w-[48px] h-[48px] bg-[#bbbb14] rounded-[8px] flex items-center justify-center'>
                        <Text className='text-[#00687f] text-[20px] font-bold m-0'>
                          #
                        </Text>
                      </div>
                    </Column>
                    <Column>
                      <Text className='text-[#00687f] text-[14px] m-0 mb-[4px] font-semibold uppercase tracking-wide opacity-70'>
                        Application Number
                      </Text>
                      <Text className='text-[#00687f] text-[24px] m-0 mb-[8px] font-bold'>
                        {applicationNumber}
                      </Text>
                      <Text className='text-[#00687f] text-[14px] m-0 leading-[20px]'>
                        Please keep this number handy. Quote this when
                        contacting us about your application.
                      </Text>
                    </Column>
                  </Row>
                </div>
              </Section>

              {/* Next Steps */}
              <Section className='mb-[32px]'>
                <Heading className='text-[#00687f] text-[20px] font-bold m-0 mb-[16px]'>
                  What happens next?
                </Heading>

                <div className='space-y-[16px]'>
                  <Row className='mb-[16px]'>
                    <Column className='w-[32px]'>
                      <div className='w-[24px] h-[24px] bg-[#bbbb14] rounded-full flex items-center justify-center'>
                        <Text className='text-[#00687f] text-[12px] font-bold m-0'>
                          1
                        </Text>
                      </div>
                    </Column>
                    <Column>
                      <Text className='text-[#00687f] text-[16px] m-0 leading-[24px]'>
                        <strong>Review Process:</strong> One of our experienced
                        lending officers has received your application and will
                        begin the review process.
                      </Text>
                    </Column>
                  </Row>

                  <Row className='mb-[16px]'>
                    <Column className='w-[32px]'>
                      <div className='w-[24px] h-[24px] bg-[#bbbb14] rounded-full flex items-center justify-center'>
                        <Text className='text-[#00687f] text-[12px] font-bold m-0'>
                          2
                        </Text>
                      </div>
                    </Column>
                    <Column>
                      <Text className='text-[#00687f] text-[16px] m-0 leading-[24px]'>
                        <strong>Personal Contact:</strong> We'll be in touch
                        shortly to discuss your application and answer any
                        questions you may have.
                      </Text>
                    </Column>
                  </Row>

                  <Row>
                    <Column className='w-[32px]'>
                      <div className='w-[24px] h-[24px] bg-[#bbbb14] rounded-full flex items-center justify-center'>
                        <Text className='text-[#00687f] text-[12px] font-bold m-0'>
                          3
                        </Text>
                      </div>
                    </Column>
                    <Column>
                      <Text className='text-[#00687f] text-[16px] m-0 leading-[24px]'>
                        <strong>Documentation:</strong> Please have your
                        supporting documents ready. We may request additional
                        information to complete your application.
                      </Text>
                    </Column>
                  </Row>
                </div>
              </Section>

              {/* Important Information */}
              <Section className='mb-[32px] bg-[#FFF9E6] p-[20px] rounded-[8px] border-l-[4px] border-solid border-[#bbbb14]'>
                <Text className='text-[#00687f] text-[14px] m-0 mb-[8px] font-semibold'>
                  💡 Important Information
                </Text>
                <Text className='text-[#00687f] text-[14px] m-0 leading-[20px]'>
                  Our commitment to clarity and accessibility means we'll
                  explain all loan terms and payment options in detail. If you
                  have any questions at any stage, please don't hesitate to
                  reach out.
                </Text>
              </Section>

              {/* Contact Section */}
              <Section className='text-center mb-[32px]'>
                <Text className='text-[#00687f] text-[16px] m-0 mb-[20px] leading-[24px]'>
                  Have questions about your application? We're here to help.
                </Text>
                <Button
                  href='https://firstcreditunion-loans-test.vercel.app/'
                  className='bg-[#bbbb14] text-[#00687f] px-[32px] py-[14px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block hover:bg-[#a8aa15] transition-colors'
                >
                  Contact Us Today
                </Button>
              </Section>
            </Section>

            <Hr className='border-[#E5E7EB] border-solid m-0' />

            {/* Footer */}
            <Section className='px-[40px] py-[24px] bg-[#F6F8FA]'>
              <Text className='text-[#00687f] text-[14px] m-0 mb-[12px] text-center font-semibold'>
                First Credit Union - Your Trusted Financial Partner
              </Text>
              <Text className='text-[#00687f] text-[12px] m-0 mb-[8px] text-center opacity-70'>
                This is an automated confirmation email. Please do not reply
                directly to this message.
              </Text>
              <Text className='text-[#00687f] text-[12px] m-0 text-center opacity-70'>
                © {new Date().getFullYear()} First Credit Union. All rights
                reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

LoanThankYouEmail.PreviewProps = {
  firstName: 'Peter',
  applicationNumber: '21822267',
}

export default LoanThankYouEmail
