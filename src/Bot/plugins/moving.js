

export function moveToCoordinates(goals, bot, x, y, z) {
	const { GoalNear } = goals;
	const goal = new GoalNear(x, y, z, 1); // Бот будет двигаться к указанным координатам с точностью до 1 блока
	bot.pathfinder.setGoal(goal);
	console.log(`Бот движется к координатам: (${x}, ${y}, ${z})`);
}

export function moveCoord(goals, bot, args) {
	if (args.length === 4) {
		const x = parseFloat(args[1]);
		const y = parseFloat(args[2]);
		const z = parseFloat(args[3]);

		if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
			moveToCoordinates(goals, bot, x, y, z);
		} else {
			console.log('Координаты должны быть числами.');
		}
	} else {
		console.log('Неправильное количество аргументов для команды "go".');
	}
}
