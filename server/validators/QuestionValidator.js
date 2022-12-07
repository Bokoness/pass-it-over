import { checkSchema } from 'express-validator'
import _ from 'lodash'

class QuestionValidator {
  static storeSchema = {
    title: {
      optional: true,
      isLength: {
        errorMessage: 'Name must be provided',
        options: { min: 1 },
      },
    },
    questionMedia: {
      optional: true,
      isString: {
        errorMessage: 'Game  must be of type string',
      },
    },
    questionType: {
      optional: true,
      isInt: {
        errorMessage: 'Game  must be of type int',
      },
    },
    answers: {
      optional: true,
      custom: {
        errorMessage: 'Answers type is invalid',
        options: (v) => {
          let isValidated = true
          if (!_.isArray(v)) isValidated = false
          v.forEach((answer) => {
            const isContent = answer.content
            const isStringContent = _.isString(answer.content)
            if (!isContent || !isStringContent) isValidated = false
          })
          return isValidated
        },
      },
    },
    score: {
      optional: true,
      isInt: {
        errorMessage: 'must be of type int',
      },
    },
    trueOrFalseAnswer: {
      optional: true,
      isBoolean: {
        errorMessage: 'must be of type Boolean',
      },
    },
  }

  static store() {
    return checkSchema({
      ...this.storeSchema,
      game: {
        optional: true,
        isString: {
          errorMessage: 'Game  must be of type string',
        },
      },
    })
  }

  static update() {
    return checkSchema({
      ...this.storeSchema,
      id: {
        in: 'params',
        isString: {
          errorMessage: 'GameId must be provided',
        },
      },
    })
  }

  static storePool() {
    return checkSchema(this.storeSchema)
  }
}

export default QuestionValidator
