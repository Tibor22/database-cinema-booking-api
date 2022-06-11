const prisma = require("../utils/prisma");

const createCustomer = async (req, res) => {
	const { name, phone, email } = req.body;

	/**
	 * This `create` will create a Customer AND create a new Contact, then automatically relate them with each other
	 * @tutorial https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-a-related-record
	 */
	const createdCustomer = await prisma.customer.create({
		data: {
			name,
			contact: {
				create: {
					phone,
					email,
				},
			},
		},
		// We add an `include` outside of the `data` object to make sure the new contact is returned in the result
		// This is like doing RETURNING in SQL
		include: {
			contact: true,
		},
	});

	res.json({ data: createdCustomer });
};

const updateCustomer = async function (req, res) {
	const id = +req.params.id;
	const update = req.body;

	console.log(update);

	let updatedUser = await prisma.customer.update({
		where: {
			id: id,
		},
		data: {
			name:update.name
		},
	});

	if (update.email && update.phone) {
		 updatedUser = await prisma.contact.update({
				where: { id: id },
				data: {
					email: update.email,
					phone: update.phone,
				},
		});
	}

	return res.json({ data: updatedUser });
};

module.exports = {
	createCustomer,
	updateCustomer,
};
