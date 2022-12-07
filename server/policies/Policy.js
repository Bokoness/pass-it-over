class Policy {
	static allowAll = false

	static belongToUser(user, record) {
		if (this.allowAll) return true
		return user?._id?.equals(record.user)
	}

	static destroy(user, record) {
		return this.belongToUser(user, record)
	}

	static show(user, record) {
		return this.belongToUser(user, record)
	}

	static update(user, record) {
		return this.belongToUser(user, record)
	}

	static store(user, record) {
		return this.belongToUser(user, record)
	}

	static replicate(user, record) {
		return this.belongToUser(user, record)
	}
}

export default Policy
