const GUEST_EMAIL = (process.env.GUEST_EMAIL || 'sample@gmail.com').trim().toLowerCase();
const GUEST_PASSWORD = process.env.GUEST_PASSWORD || '1234';

function isGuestLogin(email, password) {
  return String(email || '').trim().toLowerCase() === GUEST_EMAIL && String(password) === GUEST_PASSWORD;
}

module.exports = { isGuestLogin, GUEST_EMAIL, GUEST_PASSWORD };
