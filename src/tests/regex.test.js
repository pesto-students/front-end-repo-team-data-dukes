import { EMAIL_REGEX } from '../utils/regex'; // Update the path to your module

describe('EMAIL_REGEX', () => {
  it('should match valid email addresses', () => {
    const validEmails = [
      'user@example.com',
      'test.user@domain.co',
      'john.doe123@gmail.com',
      '1234@example-mail.org',
    ];

    validEmails.forEach(email => {
      expect(EMAIL_REGEX.test(email)).toBe(true);
    });
  });

  it('should not match invalid email addresses', () => {
    const invalidEmails = [
      'invalid.email',
      'user@domain.',
      '@example.com',
    ];

    invalidEmails.forEach(email => {
      expect(EMAIL_REGEX.test(email)).toBe(false);
    });
  });
});
