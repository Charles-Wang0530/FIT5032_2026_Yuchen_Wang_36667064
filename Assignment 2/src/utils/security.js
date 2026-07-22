export function cleanText(value, maxLength = 200) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength)
}

export function cleanEmail(value) {
  return cleanText(value, 100).toLocaleLowerCase()
}

export function isSafeInternalPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return false
  }

  try {
    const url = new URL(value, 'https://mindbridge.local')
    return url.origin === 'https://mindbridge.local'
  } catch {
    return false
  }
}

export function isValidRating(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5
}

