import request from "supertest"
import "dotenv/config"
import dummy from "mongoose-dummy"
import Question from "../models/QuestionModel.js"

const baseURL = `http://localhost:${process.env.PORT}`

describe("Testing Question model", () => {
	//Creating an agent to save and use auth cookie
	const agent = request.agent(baseURL)
	let recordId
	it("POST /auth/login/", async () => {
		const response = await agent.post("/auth/login/").send({
			email: "admin@gmail.com",
			password: "321123",
		})
		expect(response.statusCode).toBe(200)
	})

	//Creating dummy question using mongoose schema
	let record = dummy(Question, {
		returnDate: true,
	})

	it("POST /question - store a new question", async () => {
		const response = await agent.post("/question/").send(record)
		expect(response.statusCode).toBe(200)
		expect(response.body._id).not.toBeNull()
		recordId = response.body._id
	})

	it(`GET /question/:id - show question`, async () => {
		const response = await agent.get(`/question/${recordId}`)
		expect(response.statusCode).toBe(200)
		expect(response.body._id).not.toBeNull()
	})

	it(`GET /question/ - index questions`, async () => {
		const response = await agent.get(`/question`)
		expect(response.statusCode).toBe(200)
		expect(response.body._id).not.toBeNull()
		expect(response.body).toBeInstanceOf(Array)
	})

	it(`UPDATE /question/:id - update one question`, async () => {
		const response = await agent.put(`/question/${recordId}`)
		expect(response.statusCode).toBe(200)
		expect(response.body._id).not.toBeNull()
	})

	it(`DELETE /question/:id - destroy one question`, async () => {
		const response = await agent.delete(`/question/${recordId}`)
		expect(response.statusCode).toBe(200)
	})
})
