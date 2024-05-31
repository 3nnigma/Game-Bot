import mineflayer from 'mineflayer';
import armorManager from 'mineflayer-armor-manager';
// import { mapDownloader } from 'mineflayer-item-map-downloader';
import { plugin as autoEat } from 'mineflayer-auto-eat';
import pkg from 'mineflayer-pathfinder';
import { plugin as pvp } from 'mineflayer-pvp';
import readline from 'readline';
import * as auth from './auth/auth.js';
import * as inventory from './plugins/inventory.js';
import * as moving from './plugins/moving.js';
const { pathfinder, goals } = pkg;

var bot = mineflayer.createBot({
	host: "mc.vimemc.ru",
	// port: 34997,
	username: "TarRs12",
	version: '1.19.4',
	"mapDownloader-outputDir": "C:/Users/User/Desktop/Script/src/Bot/auth/captcha"
});

let isLook = false;
let logs = true;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// bot.loadPlugin(mapDownloader);
bot.loadPlugin(pathfinder);
bot.loadPlugin(autoEat);
bot.loadPlugin(armorManager);
bot.loadPlugin(pvp);


bot.once('spawn', function () {
	console.log('Бот успешно подключился к серверу!');
	setTimeout(() => auth.selectMenu(bot, 12), 1500);
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

function handleConsoleInput(input) {
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
			auth.selectMenu(bot, 29);
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
		case 'jump':
			bot.setControlState("jump", true);
			setTimeout(() => bot.setControlState("jump", false), 1000);
			break;
		case 'look':
			isLook = !isLook;
			break;
		case 'pvp':
			let username = 'MrBilol4ikLova';
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
		case 'stop':
			bot.pvp.stop();
			bot.deactivateItem();
			clearInterval(interval);
			break;
		default:
			bot.chat(cmd);
			break;

	}
}
function getSword() {
	const sword = bot.inventory.items().find(item => item.name.includes('sword'));
	if (sword) bot.equip(sword, 'hand');
}
bot.on('playerCollect', (collector, itemDrop) => {
	if (collector !== bot.entity) return;


});

bot.on('chat', async (username, text) => {
	if (username === bot.username) return;
	// ⇛
	let message = text.split('›');
	if (message.length > 1) {
		message = message[1].trim();
		switch (message) {
			case '>':
				bot.setControlState("forward", true);
				setTimeout(() => bot.setControlState("forward", false), 1000);
				break;
			case 'Dig':
				dig();
				break;
			case 'Wood':
				digWood();
				break;
			case 'jump':
				bot.setControlState("jump", true);
				setTimeout(() => bot.setControlState("jump", false), 1000);
				break;
			case 'look':
				isLook = !isLook;
				break;

		}
	}
});

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
