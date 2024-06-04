
export async function handleConsoleInput(input) {
	const cmd = input.trim();
	const args = cmd.split(' ');

	switch (args[0]) {
		case 'Drop':
			inventory.tossItems(bot);
			break;
		case 'go':
			moving.moveCoord(goals, bot, args);
			break;
		case '~':
			auth.selectMenu(bot, 10);
			bot.clickWindow(12, 0, 0);
			break;
		case 'logs':
			logs = !logs;
			break;
		case 'tp':
			bot.chat('/tpa FearLeSness');
			break;
		case 'D':
			dig();
			break;
		case 'W':
			digWood();
			break;
		case '>':
			bot.setControlState("forward", true);
			setTimeout(() => bot.setControlState("forward", false), 1000);
			break;
		case 'up':
			buildUp();
			break;
		case 'look':
			isLook = !isLook;
			break;
		case 'guard':
			const player2 = bot.players['FearLeSness'];
			if (!player2) {
				bot.chat("I can't see you.");
				return;
			}

			bot.chat('I will guard that location.');
			guardArea(player2.entity.position);
			// var interval2 = setInterval(() => {
			// 	if (!bot.heldItem || !bot.heldItem.name.includes('sword')) getSword();;
			// }, 5000);
			break;
		case 'pvp':
			let username = 'FearLeSness';
			const player = bot.players[username];

			if (!player) {
				console.log('I can\'t find ' + username);
				return;
			}
			bot.pvp.attack(player.entity);
			var interval = setInterval(() => {
				if (!bot.heldItem || !bot.heldItem.name.includes('sword')) getSword();;
			}, 5000);
			break;

		case 'mine':
			let cuboid = getCuboid(v(-55, -62, 40), v(-48, -60, 48)).sort((p1, p2) => { return p2.y - p1.y; });
			for (var a = 0; a < cuboid.length; a++) {
				let pos = cuboid[a];
				let block = bot.blockAt(pos);
				if (block.name !== 'air') {
					await bot.tool.equipForBlock(block, {});
					await bot.pathfinder.goto(new GoalNear(pos.x, pos.y, pos.z, 3));
					await bot.dig(block); // Note: If not a solid area, remember to check if "block" exists
				}
			}
			await collectDroppedItems();
			bot.chat('Done');
			break;
		case 'stop':
			bot.pvp.stop();
			bot.deactivateItem();
			clearInterval(interval);
			break;
		case 'stopg':
			bot.chat('I will no longer guard this area.');
			stopGuarding();
			break;
		case 'off':
			bot.collectBlock.cancelTask();
			break;
		default:
			bot.chat(cmd);
			break;

	}
}


rl.on('line', handleConsoleInput);
