import { checkSchema } from 'express-validator'
import CustomValidators from './CustomValidators.js'

class GameValidator {
  static storeSchema = {
    name: {
      isLength: {
        errorMessage: 'Name must be provided',
        options: { min: 1 },
      },
    },
    // gameCode: {
    //   isInt: {
    //     errorMessage: 'Game code must be of type integer',
    //     options: { nullable: true },
    //   },
    // },
    password: {
      isLength: {
        errorMessage: 'Password should be at least 6 chars long',
      },
    },
    usersLimit: {
      custom: {
        options: CustomValidators.isIntOptional(
          'usersLimit should be of type int',
        ),
      },
    },
    gamesLimit: {
      custom: {
        options: CustomValidators.isIntOptional(
          'usersLimit should be of type int',
        ),
      },
    },
    shuffle: {
      custom: {
        options: CustomValidators.isBoolOptional(
          'shuffleAnswers should be of type boolean',
        ),
      },
    },
    shuffleAnswers: {
      custom: {
        options: CustomValidators.isBoolOptional(
          'shuffleAnswers should be of type boolean',
        ),
      },
    },
    active: {
      custom: {
        options: CustomValidators.isBoolOptional(
          'active should be of type boolen',
        ),
      },
    },
    metaData: {
      custom: {
        options: CustomValidators.isObjOptional(
          'active should be of type object',
        ),
      },
    },
  }

  static store() {
    return checkSchema({
      ...this.storeSchema,
    })
  }
}

export default GameValidator
