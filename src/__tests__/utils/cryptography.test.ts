import { hashPassword } from '~/utils/cryptography'

describe('Cryptography Utils', () => {
  describe('hashPassword', () => {
    it('should hash the password correctly', () => {
      const password = 'testpassword'
      const expectedHash = '32bcecd3897300fd6b27ed002aa7b3b75227537dbef129c0a73bf2825f9fc3eb'
      const actualHash = hashPassword(password)
      expect(actualHash).toEqual(expectedHash)
    })
  })
})
