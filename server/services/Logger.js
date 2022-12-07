import morgan from 'morgan'

export default () => {
  morgan.token('udetails', (req) => {
    let userDetails = ''
    if (req.user?._id) userDetails += ` uid:${req.user?._id}`
    if (req.user?.email) userDetails += ` uEamil:${req.user?.email}`
    if (req.user?.username) userDetails += ` username:${req.user?.username}`
    return req.user?._id ? req.user?._id : 'no auth'
  })

  const mfmt = ':date[clf] :method :url :status - :response-time :udetails'
  return morgan(mfmt)
}
