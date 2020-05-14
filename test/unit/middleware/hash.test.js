const hashPassword = require('../../../middleware/hash');
const bcrypt = require('bcrypt');

describe('hashPassword', () => {

  it('should return a hashed password', async () => {
    const password = "123456";
    const hashed = await hashPassword(password);
    const validPassword = await bcrypt.compare(password, hashed);
    expect(validPassword).toBe(true);
  })

})