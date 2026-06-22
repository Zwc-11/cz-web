export function validateContact(body) {
  const errors = [];
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (name.length < 2 || name.length > 100) {
    errors.push('Name must be between 2 and 100 characters.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email address is required.');
  }
  if (message.length < 10 || message.length > 2000) {
    errors.push('Message must be between 10 and 2000 characters.');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: { name, email, message },
  };
}
