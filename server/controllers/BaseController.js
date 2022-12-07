import path from 'path'
import { fileURLToPath } from 'url'
import { validationResult } from 'express-validator'
import ErrorService from '../services/ErrorService.js'

class Controller {
  name

  model

  policy

  /**
     * BaseController - create a parent controller
     * @param name - the name of the model
     * @param model - the Mongoose model
     * @param policy - the model's policy
     */
  constructor(name, model, policy) {
    this.name = name
    this.model = model
    this.policy = policy
  }

  /**
     * Find all records
     */
  index() {
    return async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() })
        }
        return res.send(await this.model.index(req.query))
      } catch (e) {
        return ErrorService.createError(
          `${this.name} Controller | index`,
          ErrorService.errors.generalError,
          res,
        )
      }
    }
  }

  indexUser() {
    /**
         * Find all authenticated user record
         */
    return async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() })
        }
        req.query = { ...req.query, user: req.user }
        const result = await this.model.index(req.query)
        res.send(result)
      } catch (e) {
        return ErrorService.createError(
          `${this.name} Controller | indexUser`,
          ErrorService.errors.generalError,
          res,
        )
      }
    }
  }

  show() {
    /**
         * Find a single record
         * @param {req.params.id} id the record id
         * */
    return async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() })
        }
        const record = await this.model.show(req.params.id)
        if (record && this.policy && !await this.policy.show(req.user, record)) {
          return ErrorService.createError(
            `${this.name} Controller | show`,
            ErrorService.errors.auth.unauthorized,
            res,
          )
        }
        res.send(record)
      } catch (e) {
        return ErrorService.createError(
          `${this.name} Controller | show`,
          ErrorService.errors.generalError,
          res,
        )
      }
    }
  }

  store() {
    /**
         * Save's a single record
         * @param {req.body} body the record data
         */
    return async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() })
        }
        const data = { ...req.body, user: req.user?._id }
        if (this.policy && !await this.policy.store(req.user, data)) {
          return ErrorService.createError(
            `${this.name} Controller | store`,
            ErrorService.errors.auth.unauthorized,
            res,
          )
        }
        const record = await this.model.store(data)
        res.send(record)
      } catch (e) {
        return ErrorService.createError(
          `${this.name} Controller | store`,
          ErrorService.errors.generalError,
          res,
        )
      }
    }
  }

  update() {
    /**
         * Updates single record
         * @param {*} req.params.id the wanted record id
         * @param {*} req.body holds the record updates
         */
    return async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() })
        }
        if (req.body._id) delete req.body._id
        const record = await this.model.show(req.params.id)
        if (!record) {
          return ErrorService.createError(
            `${this.name} Controller | update`,
            ErrorService.errors.notFound,
            res,
          )
        }
        if (this.policy && !await this.policy.update(req.user, record)) {
          return ErrorService.createError(
            `${this.name} Controller | update`,
            ErrorService.errors.auth.unauthorized,
            res,
          )
        }
        res.send(await this.model.update(req.params.id, req.body))
      } catch (e) {
        return ErrorService.createError(
          `${this.name} Controller | update`,
          ErrorService.errors.generalError,
          res,
        )
      }
    }
  }

  destroy() {
    /**
         * destroys a single record
         * @param {*} req.params.id the wanted record's id
         */
    return async (req, res) => {
      try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() })
        }
        const record = await this.model.show(req.params.id)
        if (!record) {
          return ErrorService.createError(
            `${this.name} Controller | destroy`,
            ErrorService.errors.notFound,
            res,
          )
        }
        if (this.policy && !await this.policy.destroy(req.user, record)) {
          return ErrorService.createError(
            `${this.name} Controller | destroy`,
            ErrorService.errors.auth.unauthorized,
            res,
          )
        }
        await this.model.destroy(req.params.id)
        res.sendStatus(200)
      } catch (e) {
        return ErrorService.createError(
          `${this.name} Controller | destroy`,
          ErrorService.errors.generalError,
          res,
        )
      }
    }
  }

  replicate() {
    /**
         * Replicates a single record
         * @param {*} req.params.id the wanted record's id
         */
    return async (req, res) => {
      try {
        const record = await this.model.show(req.params.id)
        if (!record) {
          return ErrorService.createError(
            `${this.name} Controller | replicate`,
            ErrorService.errors.notFound,
            res,
          )
        }
        if (this.policy && !await this.policy.replicate(req.user, record)) {
          return ErrorService.createError(
            `${this.name} Controller | replicate`,
            ErrorService.errors.auth.unauthorized,
            res,
          )
        }
        res.send(await this.model.replicate(req.params.id))
      } catch (e) {
        return ErrorService.createError(
          `${this.name} Controller | Replicate`,
          ErrorService.errors.generalError,
          res,
        )
      }
    }
  }

  static serveHtml() {
    return async (req, res) => {
      try {
        const { dirname } = path
        const __dirname = dirname(fileURLToPath(import.meta.url))
        res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
      } catch (e) {
        return ErrorService.createError(
          'serve HTML',
          ErrorService.errors.generalError,
          res,
        )
      }
    }
  }
}

export default Controller
