import otpGenerator from 'otp-generator';

/**
 * Generate a random OTP code
 * @param length - Length of OTP (default: 6)
 * @returns Generated OTP string
 */
export const generateOTP = (length: number = 6): string => {
  return otpGenerator.generate(length, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

/**
 * Check if OTP has expired
 * @param otpExpiry - Date when OTP expires
 * @returns Boolean indicating if OTP is expired
 */
export const isOTPExpired = (otpExpiry: Date | undefined): boolean => {
  if (!otpExpiry) return true; // Consider undefined as expired
  return new Date() > new Date(otpExpiry);
};

/**
 * Generate OTP expiry date (default: 5 minutes from now)
 * @param minutes - Minutes until expiry (default: 5)
 * @returns Expiry Date object
 */
export const generateOTPExpiry = (minutes: number = 5): Date => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
};

/**
 * Verify OTP against stored OTP
 * @param inputOTP - OTP provided by user
 * @param storedOTP - OTP stored in database
 * @param storedExpiry - Expiry date from database
 * @returns Boolean indicating if OTP is valid
 */
export const verifyOTP = (
  inputOTP: string,
  storedOTP: string | undefined,
  storedExpiry: Date | undefined
): boolean => {
  if (!storedOTP || !inputOTP) return false;
  if (isOTPExpired(storedExpiry)) return false;
  return inputOTP === storedOTP;
};

// Optional: OTP rate limiter tracking
const otpAttempts = new Map<string, { attempts: number; lastAttempt: Date }>();

/**
 * Track OTP attempts for rate limiting
 * @param identifier - User email/phone
 * @param maxAttempts - Maximum allowed attempts (default: 3)
 * @returns Boolean indicating if attempt is allowed
 */
export const checkOTPAttempts = (
  identifier: string,
  maxAttempts: number = 3
): boolean => {
  const attemptData = otpAttempts.get(identifier) || { attempts: 0, lastAttempt: new Date(0) };
  
  // Reset if last attempt was >15 minutes ago
  if ((new Date().getTime() - attemptData.lastAttempt.getTime()) > 15 * 60 * 1000) {
    attemptData.attempts = 0;
  }

  if (attemptData.attempts >= maxAttempts) {
    return false;
  }

  attemptData.attempts++;
  attemptData.lastAttempt = new Date();
  otpAttempts.set(identifier, attemptData);
  return true;
};