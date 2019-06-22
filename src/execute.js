const axios = require('axios'),
	{ stringify } = require('querystring')

module.exports = (TOKEN, v = '5.80') => {
	let access_token = TOKEN,
		execute_counter = 0

	const execute_promise = {},
		execute_methods = []

	const api = async (method, settings = {}) => {
		try {
			const { data } = await axios.post(
				`https://api.vk.com/method/${method}`,
				stringify({
					v,
					...settings,
					access_token,
				})
			)

			if (data.error) {
				throw JSON.stringify(data)
			}

			return data
		} catch (err) {
			throw typeof err === 'object' ? JSON.stringify(err) : err
		}
	}

	const executor = async () => {
		try {
			const executingMethods = []
			for (let i = 0; i < 25; i++) {
				if (execute_methods.length > 0) executingMethods.push(execute_methods.shift())
			}
			if (executingMethods.length === 0) return

			let codeStrings = executingMethods.map(
				method => `\"${method.id}\": API.${method.name}(${JSON.stringify(method.params)})`
			)

			let { response, execute_errors, error } = await api('execute', {
				access_token,
				v,
				code: `return { ${codeStrings.join(',\n')} };`,
			})

			Object.entries(response).forEach(element => {
				if (element[1] !== false) {
					execute_promise[element[0]].r(element[1])
					delete execute_promise[element[0]]
				}
			})

			Object.entries(response)
				.filter(e => e[1] === false)
				.map((e, i) => {
					execute_promise[e[0]].r(execute_errors[i])
					delete execute_promise[e[0]]
				})
		} catch (e) {
			console.error(e)
		}
	}

	const execute = (method_name, params) => {
		const id = `method${execute_counter++}`
		return new Promise(r => {
			execute_methods.push({
				id,
				name: method_name,
				params,
			})
			execute_promise[id] = {
				r,
			}
		})
	}

	setInterval(executor, 50)

	return {
		api,
		execute,
	}
}
