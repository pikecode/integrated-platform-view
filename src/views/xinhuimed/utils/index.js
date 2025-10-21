import CryptoJS from 'crypto-js'


export const cryptoEncrypt = (word) => {
    const AES_IV = ''
    const AES_KEY = '3D22065B41BE6C8B'
  
    const key = CryptoJS.enc.Utf8.parse(AES_KEY)
    const iv = CryptoJS.enc.Utf8.parse(AES_IV)
    const srcs = CryptoJS.enc.Utf8.parse(word)
    let encrypted = ''
  
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
}
