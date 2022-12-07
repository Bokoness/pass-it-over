import { checkSchema } from 'express-validator'

const loginValidator = () => checkSchema({
  email: {
    isEmail: {
      errorMessage: 'Invalid Email address',
    },
  },
  password: {
    isLength: {
      errorMessage: 'Password should be at least 6 chars long',
      // Multiple options would be expressed as an array
      options: { min: 6 },
    },
  },
})

export { loginValidator }
