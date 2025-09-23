// lib/loan-status-link-generator.ts

/**
 * Configuration for loan status portal
 */
const MEMBERSHIP_STATUS_CONFIG = {
  baseUrl: process.env.STATUS_HUB_BASE_URL,
}

/**
 * Interface for loan status link parameters
 */
interface MembershipStatusLinkParams {
  email: string
  membershipApplicationNumber: string | number
  applicantName: string
  token?: string // Optional security token
}

/**
 * Generate loan status portal link with required parameters
 * @param params - Link parameters
 * @returns Complete URL to loan status portal
 */
export function generateMembershipStatusLink({
  email,
  membershipApplicationNumber,
  applicantName: _applicantName, // Keep for API compatibility, not used in URL
  token,
}: MembershipStatusLinkParams): string {
  const baseUrl = MEMBERSHIP_STATUS_CONFIG.baseUrl

  // Create URL parameters
  const params = new URLSearchParams({
    email: email.trim(),
    membership: membershipApplicationNumber.toString(),
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
 * @param membershipNumber - Membership application number
 * @returns Base64 encoded security token
 */
export function generateSecureToken(
  email: string,
  membershipNumber: string
): string {
  const timestamp = Date.now().toString()
  const payload = `${email}:${membershipNumber}:${timestamp}`

  // Create base64url encoded token
  return Buffer.from(payload).toString('base64url')
}

/**
 * Validate token format (optional - for debugging)
 * @param token - Token to validate
 * @param email - Expected email
 * @param membershipNumber - Expected membership number
 * @returns Whether token is valid
 */
export function validateToken(
  token: string,
  email: string,
  membershipNumber: string
): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const [tokenEmail, tokenMembership, timestamp] = decoded.split(':')

    // Validate email and loan number match
    if (tokenEmail !== email || tokenMembership !== membershipNumber) {
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
  return generateMembershipStatusLink({
    email: 'john.doe@example.com',
    membershipApplicationNumber: '12345',
    applicantName: 'John Doe',
    token: generateSecureToken('john.doe@example.com', '12345'),
  })
}
