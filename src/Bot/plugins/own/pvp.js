let guardPos = null;

function guardArea(pos) {
	guardPos = pos.clone();

	if (!bot.pvp.target) {
		moveToGuardPos();
	}
}

function stopGuarding() {
	guardPos = null;
	bot.pvp.stop();
	bot.pathfinder.setGoal(null);
}

function moveToGuardPos() {
	bot.pathfinder.setMovements(new Movements(bot, mcData));
	bot.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z));
}


bot.on('stoppedAttacking', () => {
	if (guardPos) {
		moveToGuardPos();
	}
});
