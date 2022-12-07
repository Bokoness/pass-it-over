import axios from 'axios'
import User from '../models/UserModel.js'
import Roles from '../models/types/roles.js'

/**
 * service class for login with clap way
 * how to use:
 * 1. create instance of the class with the params
 * 2. use the class method getClapWayAuthUrl() for getting login url
 * 3. define the redirect uri route
 * 4. in this route call to class method: connectUser(code) with the code from request
 * 5. the method would return the user from db or false
 */
export default class ClapWayService {
  // the client id from clap way
  clientId

  // the client secret from clap way
  secretId

  // random string, will be generated in constructor
  state

  // the clap way url, usual "https://clapway.clap.co.il"
  clapWayUrl

  // the url that clap way will redirect after login
  redirectUri

  constructor(clientId, secretId, clapWayUrl, redirectUri) {
    this.clientId = clientId
    this.secretId = secretId
    this.clapWayUrl = clapWayUrl
    this.redirectUri = redirectUri
    this.initState()
  }

  /**
   * create clapWay login url
   * @returns {string}
   */
  getClapWayAuthUrl() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: '*',
      state: this.state,
    })
    return `${this.clapWayUrl}/identity?${params.toString()}`
  }

  initState() {
    // set random string for security needs
    this.state = (Math.random() + 1).toString(36).substring(7)
  }

  /**
   * verify code with clapWay, then get user from clapWay
   *
   * if user not exist in DB create new user
   * @returns User|false instance of UserClass when authorization success or false when failed
   */
  async connectUser(code) {
    const token = await this.getAccessTokenFromCode(code)
    if (!token) return false
    const responseUser = await this.getUserByToken(token.accessToken)
    if (!(responseUser.email)) {
      return false
    }
    // check if user exist
    const user = await User.findOne({ email: responseUser.email })
    if (user) {
      await this.saveAccessTokenLocally(user, token)
      return user
    }
    // user not exist, create user
    const newUser = await User.create({
      name: { firstName: responseUser.name },
      email: responseUser.email,
      role: Roles.campaignAdmin,
    })
    await this.saveAccessTokenLocally(newUser, token)
    return newUser
  }

  /**
   * save the user access token from clap way in DB
   * @param user
   * @param token
   * @returns {Promise<void>}
   */
  async saveAccessTokenLocally(user, token) {
    user.accessToken = token.accessToken
    user.refreshToken = token.refreshToken
    user.expiresIn = token.expires
    await user.save()
  }

  /**
   * sent code to clapWay to get the access token of authorized user
   * @returns Object|false
   */
  async getAccessTokenFromCode(code) {
    try {
      const response = await axios.post(`${this.clapWayUrl}/oauth/token`, {
        grant_type: 'authorization_code',
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        client_secret: this.secretId,
        code,
      })
      const body = response.data
      return {
        accessToken: body.access_token,
        refreshToken: body.refresh_token,
        expires: body.expires_in,
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }

  /**
   * send access token to clapWay and get the authorized user from clap way
   * @param accessToken
   * @returns {Promise<boolean|any>}
   */
  async getUserByToken(accessToken) {
    try {
      const response = await axios.get(`${this.clapWayUrl}/api/v1/user`, {
        headers: {
          Accept: 'application/json', Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
