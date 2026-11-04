/**
 * Security & Anti-Leak Validation Utilities for LetsBorrow
 * Shared between client forms and server verification.
 * Enforces zero direct contact leakage (phones, WA, emails, external links, social handles).
 */

// Phone number regex patterns (standard digits, spaces, dots, dashes, parentheses, +62/08)
const PHONE_DIGITS_REGEX = /(?:\+?62|08|\b0[1-9])(?:[\s.-]?\d){7,13}\b/;

// Written numbers in Indonesian and English (e.g., "nol delapan", "zero eight", "kosong delapan")
const WRITTEN_PHONE_REGEX = /(?:nol|kosong|zero|one|satu|dua|two|tiga|three|empat|four|lima|five|enam|six|tujuh|seven|delapan|eight|sembilan|nine)[\s_-]+(?:delapan|eight|satu|one|dua|two|tiga|three|empat|four|lima|five|enam|six|tujuh|seven|sembilan|nine)[\s_-]+(?:satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan|nol|kosong|zero|one|two|three|four|five|six|seven|eight|nine)/i;

// WhatsApp explicit patterns
const WA_REGEX = /(?:wa|whatsapp|w\.a|w\/a|wea)[\s.:=_-]*\d+/i;

// Email addresses
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;

// URLs, domains, links
const URL_REGEX = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/i;
const DOMAIN_HINT_REGEX = /\b[a-zA-Z0-9-]+\.(?:com|org|net|id|co\.id|io|me|xyz|app|link|site|info)\b/i;

// Social media handles & external invitations
const SOCIAL_REGEX = /(?:instagram|ig|telegram|t\.me|facebook|fb|tiktok|line id|line:)[\s.:=_-]*@?[a-zA-Z0-9._-]+/i;
const EXTERNAL_CONTACT_HINT = /(?:hubungi (?:saya )?(?:di|ke|lewat|via)|dm (?:di|ke|lewat)|kontak (?:di|ke|lewat)|call me|chat me at|contact me outside)/i;

export interface ContactValidationResult {
  isValid: boolean;
  error?: string;
  detectedType?: 'phone' | 'email' | 'url' | 'whatsapp' | 'social' | 'external_invite';
}

export function validateNoContactInfo(text: string): ContactValidationResult {
  if (!text) return { isValid: true };

  const sanitized = text.toLowerCase();

  // 1. Check direct phone numbers
  if (PHONE_DIGITS_REGEX.test(sanitized)) {
    return {
      isValid: false,
      detectedType: 'phone',
      error: 'Deskripsi tidak boleh berisi nomor HP atau kontak lain. Hubungi lewat chat LetsBorrow setelah pembayaran.',
    };
  }

  // 2. Check written out phone digits
  if (WRITTEN_PHONE_REGEX.test(sanitized)) {
    return {
      isValid: false,
      detectedType: 'phone',
      error: 'Deskripsi tidak boleh berisi nomor HP atau kontak lain. Hubungi lewat chat LetsBorrow setelah pembayaran.',
    };
  }

  // 3. Check WhatsApp keywords with numbers
  if (WA_REGEX.test(sanitized)) {
    return {
      isValid: false,
      detectedType: 'whatsapp',
      error: 'Deskripsi tidak boleh berisi nomor HP atau kontak lain. Hubungi lewat chat LetsBorrow setelah pembayaran.',
    };
  }

  // 4. Check email
  if (EMAIL_REGEX.test(sanitized)) {
    return {
      isValid: false,
      detectedType: 'email',
      error: 'Deskripsi tidak boleh berisi nomor HP atau kontak lain. Hubungi lewat chat LetsBorrow setelah pembayaran.',
    };
  }

  // 5. Check URL / Web links
  if (URL_REGEX.test(sanitized) || DOMAIN_HINT_REGEX.test(sanitized)) {
    return {
      isValid: false,
      detectedType: 'url',
      error: 'Deskripsi tidak boleh berisi nomor HP atau kontak lain. Hubungi lewat chat LetsBorrow setelah pembayaran.',
    };
  }

  // 6. Check social media handles
  if (SOCIAL_REGEX.test(sanitized)) {
    return {
      isValid: false,
      detectedType: 'social',
      error: 'Deskripsi tidak boleh berisi nomor HP atau kontak lain. Hubungi lewat chat LetsBorrow setelah pembayaran.',
    };
  }

  // 7. Check external contact solicitations
  if (EXTERNAL_CONTACT_HINT.test(sanitized)) {
    return {
      isValid: false,
      detectedType: 'external_invite',
      error: 'Deskripsi tidak boleh berisi nomor HP atau kontak lain. Hubungi lewat chat LetsBorrow setelah pembayaran.',
    };
  }

  return { isValid: true };
}

/**
 * Chat-specific message sanitizer:
 * Replaces detected numbers, emails, links with a safety mask and flags warning.
 */
export function sanitizeChatMessage(message: string): {
  cleanText: string;
  hasViolation: boolean;
  warningNote?: string;
} {
  let cleaned = message;
  let violated = false;

  const replaceWithMask = (regex: RegExp, maskText: string) => {
    if (regex.test(cleaned)) {
      violated = true;
      cleaned = cleaned.replace(regex, `[${maskText}]`);
    }
  };

  replaceWithMask(PHONE_DIGITS_REGEX, 'Nomor HP disensor untuk keamanan');
  replaceWithMask(WRITTEN_PHONE_REGEX, 'Nomor HP disensor untuk keamanan');
  replaceWithMask(WA_REGEX, 'Kontak WA disensor');
  replaceWithMask(EMAIL_REGEX, 'Email disensor untuk privasi');
  replaceWithMask(URL_REGEX, 'Link luar disensor');
  replaceWithMask(DOMAIN_HINT_REGEX, 'Link luar disensor');
  replaceWithMask(SOCIAL_REGEX, 'Sosial media disensor');

  return {
    cleanText: cleaned,
    hasViolation: violated,
    warningNote: violated
      ? 'Demi keamanan, transaksi dan kontak tetap lewat LetsBorrow'
      : undefined,
  };
}
