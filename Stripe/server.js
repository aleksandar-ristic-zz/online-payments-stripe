require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(
	cors({
		origin: 'http://localhost:5500'
	})
)
app.use(express.static('views'))

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const storeItems = new Map([
	[1, { priceInCents: 100, name: 'Sausage' }],
	[2, { priceInCents: 200, name: 'Slurpie' }]
])

app.post('/create-checkout-session', async (req, res) => {
	try {
		const line_items = req.body.items.map(item => {
			const storeItem = storeItems.get(item.id)

			return {
				price_data: {
					currency: 'usd',
					product_data: {
						name: storeItem.name
					},
					unit_amount: storeItem.priceInCents
				},
				quantity: item.quantity
			}
		})

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			line_items,
			success_url: `${process.env.SERVER_URL}/success.html`,
			cancel_url: `${process.env.SERVER_URL}/cancel.html`
		})

		res.json({ url: session.url })
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
})

app.listen(3000)
