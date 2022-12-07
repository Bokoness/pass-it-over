import _ from 'lodash'

export default {
  isIntOptional: (errorMsg) => (value) => {
    if (value && _.isNaN(parseInt(value))) return Promise.reject(errorMsg)
    return true
  },
  isBoolOptional: (errorMsg) => (value) => {
    if (value && !_.isBoolean(value)) return Promise.reject(errorMsg)
    return true
  },
  isObjOptional: (errorMsg) => (value) => {
    if (value && !_.isObjectLike(value)) return Promise.reject(errorMsg)
    return true
  },
}
