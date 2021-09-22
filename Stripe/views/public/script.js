const btn = document.querySelector('button')

btn.addEventListener('click', () => {
	fetch('http://localhost:3000/create-checkout-session', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			items: [
				{ id: 1, quantity: 3 },
				{ id: 2, quantity: 4 }
			]
		})
	})
		.then(res => {
			if (res.ok) return res.json()

			return res.json().then(json => Promise.reject(json))
		})
		.then(({ url }) => {
			window.location = url
		})
		.catch(err => {
			console.log(err.error)
		})
})
