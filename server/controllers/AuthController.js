import _ from 'lodash'
import User from '../models/UserModel.js'
import services from '../services/ErrorService.js'
import AuthServices from '../services/AuthServices.js'
import ClapWayService from '../services/ClapWayService.js'

class AuthController {
  static COOKIE_EXPIRE_DAYS = process.env.COOKIE_DAYS || 7

  static MS_DAY = 86400000

  /**
     * Register action
     * @param req.body.email user's email
     * @param req.body.password user's password
     * @param req.body.fullname user's fullname
     * @returns 200 status if all went well
     */
  static async register(req, res) {
    try {
      let { email } = req.body
      const { password } = req.body
      if (!email || !password) {
        return services.createError(
          'Register Controller',
          services.errors.auth.badCreds,
          res,
        )
      }
      email = email.toLowerCase()
      email = email.trim()
      if (!AuthServices.emailValidation(email)) {
        return services.createError(
          'Register Controller',
          services.errors.auth.badCreds,
          res,
        )
      }
      if (await User.countDocuments({ email })) {
        return services.createError(
          'Register Controller',
          services.errors.auth.emailExists,
          res,
        )
      }
      await User.create({
        email,
        password,
      })
      res.sendStatus(200)
    } catch (e) {
      return services.createError(
        'Register Controller',
        services.errors.generalError,
        res,
      )
    }
  }

  static login(method = process.env.DEFAULT_AUTH_METHOD) {
    /**
         * Login action
         * @param req.body.email user's email
         * @param req.body.password user's password
         * @returns 200 status if all went well
         */
    return async (req, res) => {
      try {
        const data = _.pick(req.body, ['email', 'password'])
        data.email = data.email.toLowerCase()
        data.email = data.email.trim()
        // find user by email && password
        const user = await User.findByCredentials(data.email, data.password)
        if (!user) {
          return services.createError(
            'Login Controller',
            services.errors.auth.badCreds,
            res,
          )
        }
        // use web login method
        if (method === 'web') {
          AuthServices.registerCookie(user, res)
          res.send({ user: user.toJson() })
        } else {
          // use API method
          const token = await AuthServices.registerToken(user)
          res.send({ user: AuthServices.getUser(user), token })
        }
      } catch (e) {
        return services.createError(
          'Login Controller',
          services.errors.generalError,
          res,
        )
      }
    }
  }

  /**
     * Logs user out
     * @returns 200 status if all went well
     */
  static async logout(req, res) {
    try {
      res.clearCookie('user')
      services.logSuccess('Logout', 'user has logged out')
      res.sendStatus(200)
    } catch (error) {
      return services.createError(
        'AuthController | logout',
        services.errors.generalError,
        res,
      )
    }
  }

  /**
     * Checks if current user is logged in
     * @returns 200 status if all went well
     */
  static async checkLogin(req, res) {
    try {
      console.log('checkLogin found user')
      res.json(AuthServices.getUser(req.user))
    } catch (e) {
      return services.createError(
        'AuthController | login',
        services.errors.auth.notFound,
        res,
      )
    }
  }

  /**
     * redirect to clapWay login page
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
  static async clapLogin(req, res) {
    try {
      const redirectUri = AuthServices.getFullUri('auth/token')
      const clapWayService = new ClapWayService(
        process.env.CLAPWAY_CLIENT_ID,
        process.env.CLAPWAY_CLIENT_SECRET,
        process.env.CLAPWAY_URL,
        redirectUri,
      )
      const url = clapWayService.getClapWayAuthUrl()
      res.send({ url })
    } catch (error) {
      return services.createError(
        'AuthController | getLoginUrl',
        services.errors.generalError,
        res,
      )
    }
  }

  /**
     * login user by token from clapWay
     * @returns 200 status if all went well
     */
  static tokenFromClapway(method = process.env.DEFAULT_AUTH_METHOD) {
    return async (req, res) => {
      try {
        const { code } = req.query
        const clapWayService = new ClapWayService(
          process.env.CLAPWAY_CLIENT_ID,
          process.env.CLAPWAY_CLIENT_SECRET,
          process.env.CLAPWAY_URL,
          `${process.env.CLIENT_URL}/api/auth/token`,
        )
        const user = await clapWayService.connectUser(code)
        if (!user) {
          return services.createError(
            'Register Controller',
            services.errors.auth.badCreds,
            res,
          )
        }
        if (method === 'web') {
          AuthServices.registerCookie(user, res)
          res.redirect(process.env.CLIENT_URL)
        } else {
          const token = await AuthServices.registerToken(user)
          res.send({ user: AuthServices.getUser(user), token })
        }
      } catch (error) {
        return services.createError(
          'AuthController | getLoginUrl',
          services.errors.generalError,
          res,
        )
      }
    }
  }
}

export default AuthController
