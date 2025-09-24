import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const method = request.method
  const url = request.url
  const headers = Object.fromEntries(request.headers.entries())
  let body: unknown = null
  try {
    body = await request.json()
  } catch {
    body = null
  }
  console.log('Incoming request', { method, url, headers, body })
  return NextResponse.json({ message: 'hello world' })
}
