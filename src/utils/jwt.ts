import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken'

export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<string>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as string)
    })
  })
}

// signToken({ payload: 'Toi la Danh', privateKey: '123' }).then((token) => {
//   console.log(token + 'Signed')
//   verifyToken({ token: token, secretOrPublicKey: '123' }).then((decoded) => {
//     console.log(decoded + 'Verified')
//   })
// })
