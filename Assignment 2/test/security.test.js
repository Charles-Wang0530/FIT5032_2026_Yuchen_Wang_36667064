import assert from 'node:assert/strict'
import test from 'node:test'
import { cleanEmail, cleanText, isSafeInternalPath, isValidRating } from '../src/utils/security.js'

test('normalises stored text and removes simple markup characters', () => {
  assert.equal(cleanText('  <script>alert(1)</script>  ', 40), 'scriptalert(1)/script')
  assert.equal(cleanText('hello\u0000world', 20), 'helloworld')
  assert.equal(cleanEmail('  PERSON@Example.COM  '), 'person@example.com')
})

test('accepts internal redirects and rejects protocol-relative or malformed paths', () => {
  assert.equal(isSafeInternalPath('/dashboard'), true)
  assert.equal(isSafeInternalPath('/resources?search=Sleep'), true)
  assert.equal(isSafeInternalPath('//malicious.example'), false)
  assert.equal(isSafeInternalPath('/\\malicious.example'), false)
  assert.equal(isSafeInternalPath('https://malicious.example'), false)
})

test('accepts only integer rating scores from one to five', () => {
  assert.equal(isValidRating(1), true)
  assert.equal(isValidRating(5), true)
  assert.equal(isValidRating(0), false)
  assert.equal(isValidRating(6), false)
  assert.equal(isValidRating(4.5), false)
  assert.equal(isValidRating('5'), false)
})
