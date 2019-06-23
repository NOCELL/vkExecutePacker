const PORT = process.env.PORT || 4300,
	express = require('express'),
	bodyParser = require('body-parser'),
	axios = require('axios'),
	vk = require('./src/execute')

const tokens = {}

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.all('/method/:method', async (req, res) => {
	try {
		const { method } = req.params,
			{ access_token: token_in_body, ...params } = req.body
		const access_token = token_in_body || req.query.access_token
		if (tokens[access_token] === undefined) {
			tokens[access_token] = vk(access_token)
		}
		const response = await tokens[access_token].execute(method, params)
		if (response.error_code !== undefined) {
			res.json({
				error_code: response.error_code,
				error_msg: response.error_msg,
				request_params: Object.entries(params).map(([key, value]) => ({
					key,
					value,
				})),
			})
		} else {
			res.json({
				response,
			})
		}
	} catch (e) {
		console.error(e)
		res.json(e)
	}
})

app.listen(PORT, () => console.log(`Server started on ${PORT} port`))
