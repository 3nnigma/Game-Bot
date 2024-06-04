import mineflayer from 'mineflayer';
import armorManager from 'mineflayer-armor-manager';
// import { mapDownloader } from 'mineflayer-item-map-downloader';
import minecraftData from 'minecraft-data';
import { plugin as autoEat } from 'mineflayer-auto-eat';
import { plugin as collectBlock } from 'mineflayer-collectblock';
import pkg from 'mineflayer-pathfinder';
import { plugin as pvp } from 'mineflayer-pvp';
import { plugin as tool } from 'mineflayer-tool';
import readline from 'readline';
import Vec3 from 'vec3';
import * as auth from './auth/auth.js';
// import Cuboid from './plugins/cuboid.js';
import * as inventory from './plugins/inventory.js';
import * as moving from './plugins/moving.js';
var v = Vec3;
const { pathfinder, goals: { GoalNear }, Movements } = pkg;

var bot = mineflayer.createBot({
	host: "mc.prostocraft.ru",
	// port: 63393,
	username: "TarRs12",
	version: '1.19.4',
	"mapDownloader-outputDir": "C:/Users/User/Desktop/Script/src/Bot/auth/captcha"
});

let isLook = false;
let logs = true;
const mcData = minecraftData(bot.version);;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// bot.loadPlugin(mapDownloader);
bot.loadPlugin(pathfinder);
bot.loadPlugin(autoEat);
bot.loadPlugin(armorManager);
bot.loadPlugin(pvp);
bot.loadPlugin(collectBlock);
bot.loadPlugin(tool);


bot.once('spawn', function () {
	console.log('Бот успешно подключился к серверу!');

	setTimeout(() => auth.selectMenu(bot, 10), 750);

	setTimeout(() => bot.clickWindow(12, 0, 0), 1500);
});


// bot._client.on('resource_pack_send', (data) => {
// 	const { url, hash } = data;
// 	bot.emit('resourcepack', { url, hash });
// });

// const TEXTURE_PACK_RESULTS = {
// 	SUCCESSFULLY_LOADED: 0,
// 	DECLINED: 1,
// 	FAILED_DOWNLOAD: 2,
// 	ACCEPTED: 3
// };

// const acceptPack = () => {
// 	bot._client.write('resource_pack_receive', {
// 		result: TEXTURE_PACK_RESULTS.ACCEPTED
// 	});
// 	bot._client.write('resource_pack_receive', {
// 		result: TEXTURE_PACK_RESULTS.SUCCESSFULLY_LOADED
// 	});
// };

// const denyPack = () => {
// 	bot._client.write('resource_pack_receive', {
// 		result: TEXTURE_PACK_RESULTS.DECLINED
// 	});
// };
// bot.on('resourcepack', () => acceptPack());
bot.on('message', (message) => {
	if (logs) {
		console.log(message.toAnsi());
		let messagestr = message.toString();
		auth.botAuth(bot, messagestr);
	}
});


function isWood(block) {
	return block.name === 'oak_planks';
}
function digWood() {
	let wood = bot.findBlock({
		matching: isWood,
		maxDistance: 5
	});
	setTimeout(() => {

		if (wood) bot.dig(wood);
		else console.log('...');
	}, 1000);
}
async function dig() {
	let blockPosition = bot.entity.position.offset(0, -1, 0);
	let block = bot.blockAt(blockPosition);

	await bot.dig(block);
	bot.chat('Dug');
}

async function handleConsoleInput(input) {
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

function getCuboid(c1, c2) {
	let positions = [];
	for (let x = c1.x; x <= c2.x; x++) {
		for (let y = c1.y; y <= c2.y; y++) {
			for (let z = c1.z; z <= c2.z; z++) {
				positions.push(v(x, y, z));
			}
		}
	}
	return positions;
}

bot.on('playerCollect', (collector, itemDrop) => {
	if (collector !== bot.entity) return;

	setTimeout(() => {
		const sword = bot.inventory.items().find(item => item.name.includes('sword'));
		if (sword) bot.equip(sword, 'hand');
	}, 150);
});

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

bot.on('physicsTick', () => {
	if (bot.pvp.target) return;
	if (bot.pathfinder.isMoving()) return;

	const entity = bot.nearestEntity();
	if (entity) bot.lookAt(entity.position.offset(0, entity.height, 0));
});

bot.on('physicsTick', () => {
	if (!guardPos) return;
	const filter = e => e.type === 'hostile' && e.position.distanceTo(bot.entity.position) < 16;
	const entity = bot.nearestEntity(filter);
	if (entity) {
		// console.log(entity);
		bot.pvp.attack(entity);
	}
});
async function buildUp() {
	bot.setControlState("jump", true);

	// Wait until the bot is high enough
	while (true) {
		let positionBelow = bot.entity.position.offset(0, -0.5, 0);
		let blockBelow = bot.blockAt(positionBelow);

		if (blockBelow.name === "air") break;
		await bot.waitForTicks(1);
		setTimeout(() => {
			return;
		}, 2000);
	}

	// Place a block
	let sourcePosition = bot.entity.position.offset(0, -1.5, 0);
	let sourceBlock = bot.blockAt(sourcePosition);

	let faceVector = { x: 0, y: 1, z: 0 };

	await bot.placeBlock(sourceBlock, faceVector);

	// Stop jump
	bot.setControlState("jump", false);
}

async function test(message) {
	// const args = message.split(' ');
	// if (args[0] !== 'collect') return;

	// const blockType = mcData.blocksByName[args[1]];
	// if (!blockType) {
	// 	bot.chat(`I don't know any blocks named ${args[1]}.`);
	// 	return;
	// }

	// const block = bot.findBlock({
	// 	matching: blockType.id,
	// 	maxDistance: 64
	// });

	// if (!block) {
	// 	bot.chat("I don't see that block nearby.");
	// 	return;
	// }

	// const targets = bot.collectBlock.findFromVein(block);
	// try {
	// 	await bot.collectBlock.collect(targets);
	// 	// All blocks have been collected.
	// 	bot.chat('Done');
	// } catch (err) {
	// 	// An error occurred, report it.
	// 	bot.chat(err.message);
	// 	console.log(err);
	// }
	const parts = message.split('➟');
	if (parts.length < 2) return;
	const args = parts[1].trim().split(' ');
	console.log(args, parts);
	if (args[0] !== 'collect') return;
	let count = 1;
	if (args.length === 3) count = parseInt(args[1]);

	let type = args[1];
	if (args.length === 3) type = args[2];

	const blockType = mcData.blocksByName[type];
	if (!blockType) {
		return;
	}

	const blocks = bot.findBlocks({
		matching: blockType.id,
		maxDistance: 64,
		count: count
	});
	if (blocks.length === 0) {
		bot.chat("I don't see that block nearby.");
		return;
	}

	const targets = [];
	for (let i = 0; i < Math.min(blocks.length, count); i++) {
		targets.push(bot.blockAt(blocks[i]));
	}

	bot.chat(`Found ${targets.length} ${type}(s)`);

	try {
		await bot.collectBlock.collect(targets);
		// All blocks have been collected.
		bot.chat('Done');
	} catch (err) {
		// An error occurred, report it.
		bot.chat(err.message);
		console.log(err);
	}
}
bot.on('chat', (username, message) => {
	test(message);
});


function getSword() {
	const sword = bot.inventory.items().find(item => item.name.includes('sword'));
	if (sword) bot.equip(sword, 'hand');
}
bot.on('playerCollect', (collector, itemDrop) => {
	if (collector !== bot.entity) return;
});

// bot.on('chat', async (username, text) => {
// 	if (username === bot.username) return;
// 	// ⇛
// 	let message = text.split('›');
// 	if (message.length > 1) {
// 		message = message[1].trim();
// 		switch (message) {
// 			case '>':
// 				bot.setControlState("forward", true);
// 				setTimeout(() => bot.setControlState("forward", false), 1000);
// 				break;
// 			case 'Dig':
// 				dig();
// 				break;
// 			case 'Wood':
// 				digWood();
// 				break;
// 			case 'jump':
// 				bot.setControlState("jump", true);
// 				setTimeout(() => bot.setControlState("jump", false), 1000);
// 				break;
// 			case 'look':
// 				isLook = !isLook;
// 				break;

// 		}
// 	}
// });

rl.on('line', handleConsoleInput);


bot.on('move', () => {
	if (isLook) {

		let mob = bot.nearestEntity();
		if (mob) {
			bot.lookAt(mob.position.offset(0, mob.height, 0));
		}
	}
});

bot.on('kicked', (reason) => {
	console.log(`Бот был кикнут с сервера по причине: ${reason}`);
});
bot.on('error', err => {
	console.log(`Ошибка: ${err}`);
});
