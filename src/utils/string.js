/**
 * Random string
 *
 * @param {number} length
 * @param {string} chars
 * @returns {string}
 */
const randomString = (
  length = 10,
  chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',
) => {
  chars = chars.split('');

  if (!length) {
    length = Math.floor(Math.random() * chars.length);
  }

  let str = '';
  for (let i = 0; i < length; i += 1) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }

  return str;
};

module.exports = { randomString };
