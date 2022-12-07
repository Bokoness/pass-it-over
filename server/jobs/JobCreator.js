import cron from 'cron'
import chalk from 'chalk'

const { CronJob } = cron

/**
 * JobCreator handle cronjobs
 * @author Ness Bokobza
 */
class JobCreator {
  static types = {
    perWeek: 'perWeek',
    perMonth: 'perMonth',
    perDay: 'perDay',
  }

  static weekDays = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  }

  /**
     * creates CronJob instance
     * @param {String} name the name of the job
     * @param {Function} action the cronjob action
     * @param {JobCreator.types} type the pattern type (please use the static 'types' enum)
     * @param {Number} day The day of the week [0-6] or the day of the month [1-31]
     * @param {Number} hour The hour of the job [0-23]
     * @param {Number} minute The hour of the job [0-59]
     * @param {String} tz the cronjob timezone (default Jerusalem time)
     */
  constructor({
    name,
    action,
    type,
    day,
    hour,
    minute,
    tz = 'Asia/Jerusalem',
  }) {
    this.name = name
    this.action = action
    this.tz = tz
    this.type = type
    this.day = day
    this.hour = hour
    this.minute = minute
    this.pattern = '* * * * *'
  }

  /**
     * validate validates the cronjob pattern
     * @returns {Boolean} true if validated, false if not
     */
  validate() {
    if (!this.name || typeof this.name !== 'string') return false
    if (
      !this.action
            || !this.tz
            || !this.type
            || this.hour === undefined
            || this.minute === undefined
    ) return false
    if (typeof this.action !== 'function') return false
    if (typeof this.tz !== 'string') return false
    if (typeof this.type !== 'string') return false
    if (typeof this.hour !== 'number' && typeof this.hour !== 'string') return false
    if (!(this.type in JobCreator.types)) return false
    if (this.type === 'perWeek' || this.type === 'perMonth') {
      if ((!this.day && this.day !== 0) || typeof this.day !== 'number') return false
    }
    if (this.type === 'perWeek') {
      if (this.day < 0 || this.day > 6) return false
    }
    if (this.type === 'perMonth') {
      if (this.day < 1 || this.day > 31) return false
    }
    return true
  }

  /**
     * createPattern takes the instance params (type,day,hour,min) and turns it into cronjob pattern
     */
  createPattern() {
    const pattern = `${this.minute} ${this.hour} `
    switch (this.type) {
    case 'perMonth':
      this.pattern = `${pattern}${this.day} * *`
      break
    case 'perWeek':
      this.pattern = `${pattern}* * ${this.day}`
      break
    case 'perDay':
      this.pattern = `${pattern}* * *`
    }
  }

  /**
     * start starts the cronjob
     */
  start() {
    if (!this.validate()) throw new Error('not valid pattern')
    this.createPattern()
    // this.pattern = "* * * * * *"; //uncomment for every second
    const job = new CronJob(this.pattern, this.action, null, true, this.tz)
    job.addCallback(() => {
      const msg = `job ${this.name} invoked at ${new Date()}`
      const futureTimeMsg = `Next job will be invoked at ${job.nextDate()}`
      console.log(chalk.bgYellow.white.bold(msg))
      console.log(chalk.bgGreen.white.bold(futureTimeMsg))
    })
    job.start()
  }
}

export default JobCreator
