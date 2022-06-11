const prisma = require("../utils/prisma");

const createScreen = async function (req, res) {
	const screen = req.body;

	let movieScreenings;

	if (screen.screenings) {
		movieScreenings = screen.screenings.map((screening) => {
			return {
				movieId: +screening.movieId,
				startsAt: new Date(screening.startsAt),
			};
		});
	}
	let newScreen = await prisma.screen.create({
		data: {
			number: +screen.number,
			screenings: {
				create: movieScreenings,
			},
		},
        include: {
            screenings:true,
        }
	});

	res.json({ data: newScreen });
};

module.exports = {
	createScreen,
};


// Sample post request
// {
// 	"number": "7",
// 	"screenings": [{
// 		"startsAt": "2022-09-30 12:20:49",
// 		"movieId": "1"
// 	}, {
// 		"startsAt": "2023-10-23 11:10:44",
// 		"movieId": "2"
// 	}]

// }