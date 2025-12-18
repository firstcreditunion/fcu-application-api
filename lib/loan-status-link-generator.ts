// lib/loan-status-link-generator.ts

/**
 * Configuration for loan status portal
 */
const LOAN_STATUS_CONFIG = {
  baseUrl:
    process.env.STATUS_HUB_BASE_URL || 'https://loan-link-dev.vercel.app',
}

/**
 * Interface for loan status link parameters
 */
interface LoanStatusLinkParams {
  email: string
  loanApplicationNumber: string | number
  applicantName: string
  token?: string // Optional security token
}

/**
 * Generate loan status portal link with required parameters
 * @param params - Link parameters
 * @returns Complete URL to loan status portal
 */
export function generateLoanStatusLink({
  email,
  loanApplicationNumber,
  applicantName: _applicantName, // Keep for API compatibility, not used in URL
  token,
}: LoanStatusLinkParams): string {
  const baseUrl = LOAN_STATUS_CONFIG.baseUrl

  // Create URL parameters
  const params = new URLSearchParams({
    email: email.trim(),
    loan: loanApplicationNumber.toString(),
  })

  // Add optional security token
  if (token) {
    params.set('token', token)
  }

  return `${baseUrl}?${params.toString()}`
}

/**
 * Generate a simple security token (recommended)
 * This creates a base64-encoded token with email, loan number, and timestamp
 * @param email - User email
 * @param loanNumber - Loan application number
 * @returns Base64 encoded security token
 */
export function generateSecureToken(email: string, loanNumber: string): string {
  const timestamp = Date.now().toString()
  const payload = `${email}:${loanNumber}:${timestamp}`

  // Create base64url encoded token
  return Buffer.from(payload).toString('base64url')
}

/**
 * Validate token format (optional - for debugging)
 * @param token - Token to validate
 * @param email - Expected email
 * @param loanNumber - Expected loan number
 * @returns Whether token is valid
 */
export function validateToken(
  token: string,
  email: string,
  loanNumber: string
): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const [tokenEmail, tokenLoan, timestamp] = decoded.split(':')

    // Validate email and loan number match
    if (tokenEmail !== email || tokenLoan !== loanNumber) {
      return false
    }

    // Check if token is not too old (e.g., 30 days)
    const tokenAge = Date.now() - parseInt(timestamp)
    const maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days

    return tokenAge <= maxAge
  } catch {
    return false
  }
}

/**
 * Example usage function
 */
export function createExampleLink(): string {
  return generateLoanStatusLink({
    email: 'john.doe@example.com',
    loanApplicationNumber: '12345',
    applicantName: 'John Doe',
    token: generateSecureToken('john.doe@example.com', '12345'),
  })
}

// Git Commit Control
