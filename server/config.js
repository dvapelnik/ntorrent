module.exports = {
  tmp: 'storage/tmp',
  uploadPath: 'storage/uploaded',
  uniqueFileDelimiter: '_',
  uniqueFilePrefixLength: 6,
  email: {
    service: 'Gmail',
    user: 'email.sender@domain.com',
    pass: 'very-secret-email-password',
    mailOptions: {
      from: 'nTorrent'
    }
  }
};