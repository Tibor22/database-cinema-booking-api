const prisma = require("../utils/prisma");

const getAllMovies = async function (req, res) {
	const { runtime, type } = req.query;
	console.log("RUNTIME:", runtime, "TYPE", type);

	console.log(req.query);

	const now = Date.now();

	const allMovies = await prisma.movie.findMany({
		include: {
			screenings: true,
		},

		where: {
			...(type
				? {
						runtimeMins: {
							[`${type === "greater" ? "gte" : "lte"}`]: +runtime,
						},
				  }
				: {}),
		},
	});

	const filteredMovies = allMovies.map((movie) => {
		movie.screenings = movie.screenings.filter((screening) => {
			return Date.parse(screening.startsAt) > now;
		});
		return movie;
	});
	return res.json({ data: filteredMovies });
};

const getMovie = async function (req, res) {
	const id = +req.params.id;

	const toTitleCase = (phrase) => {
		return phrase
			.toLowerCase()
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	try {
		if (isNaN(id)) {
			const title = req.params.id;
			const newTitle = toTitleCase(title);
			console.log("TITLE", newTitle);
			const movie = await prisma.movie.findUnique({
				where: {
					title: newTitle,
				},
			});
			if (movie === null) {
				throw new Error();
			}

			return res.json({ data: movie });
		} else {
			const movie = await prisma.movie.findUnique({
				where: { id: id },
			});
			if (movie === null) {
				throw new Error();
			}

			return res.json({ data: movie });
		}
	} catch (err) {
		res.status(400).json({ err: "Movie not found" });
	}
};

const addMovie = async function (req, res) {
	const movie = req.body;
	if (movie.screenings) {
		try {
			const createdMovie = await prisma.movie.create({
				data: {
					title: movie.title,
					runtimeMins: +movie.runtime,
					screenings: {
						create: {
							startsAt: new Date("2022-08-30 10:30:00"),
							screen: {
								connect: { id: 1 },
							},
						},
					},
				},
			});
			return res.json({ data: createdMovie });
		} catch (err) {
			return res.status(400).json({ error: "Movie already exists" });
		}
	} else {
		try {
			const createdMovie = await prisma.movie.update({
				data: {
					title: movie.title,
					runtimeMins: +movie.runtime,
				},
			});
			return res.json({ data: createdMovie });
		} catch (err) {
			return res.status(400).json({ error: "Movie already exists" });
		}
	}
};

const updateMovie = async function (req, res) {
	const update = req.body;
	const id = +req.params.id;

	console.log("REVIEW", update.review);

	if (update.review && !update.startsAt) {
		let review = {};
		review = req.body.review;

		console.log(review);

		let updateMovie = await prisma.movie.update({
			where: { id: id },
			data: {
				reviews: {
                    create: {
                        content: update.review,
                        customer: {
                            connect: { id: +update.customerId}
                        }
                    },
                  
				},
              
			},
		});
		return res.json({ data: updateMovie });
	} else {
		let updateMovie = await prisma.movie.update({
			where: { id: id },
			data: {
				title: update.title,
				runtimeMins: +update.runtimeMins,
			},
		});
		if (update.startsAt || update.screenId) {
			updateMovie = await prisma.screening.update({
				where: { id: +update.screeningId },
				data: {
					startsAt: new Date(update.startsAt),
					screen: {
						connect: { id: +update.screenId },
					},
					movie: {
						connect: { id: id },
					},
				},
			});
		}
		return res.json({ data: updateMovie });
	}
};

module.exports = {
	getAllMovies,
	addMovie,
	getMovie,
	updateMovie,
};
