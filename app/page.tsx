'use client'

import { Button } from '@/components/ui/button'

export default function Home() {
  const sendEmail = async () => {
    const sesResposne = await fetch('/api/personal-loan/confirmation-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'John',
        email: 'john@example.com',
        applicationNumber: '1234567890',
      }),
    })

    console.log('sesResposne: ', sesResposne)
  }

  return (
    <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <Button onClick={async () => await sendEmail()}>Send Email</Button>
    </div>
  )
}
