import FlayerCaptcha from 'flayercaptcha';
import mineflayer from 'mineflayer';
import readline from 'readline';
import * as auth from './auth/auth.js';

var bot = mineflayer.createBot({
	host: "funtime.su",
	username: "TarRs12",
	version: '1.19.4',
});

let isCaptcha = true;
let logs = true;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


bot.once('spawn', function () {
	console.log('Бот успешно подключился к серверу!');

	isCaptcha = false;

	setTimeout(() => bot.chat('/an212'), 1750);
});


const captcha = new FlayerCaptcha(bot);
let captchaCounter = 0;

(async () => {
	captcha.on('success', async (image, viewDirection) => {
		if (!isCaptcha) return;
		await sleep(500);
		const fileName = `captcha_${captchaCounter++}.png`;
		await image.toFile(fileName);
		console.log(`Saved: ${fileName}`);
	});
})();

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

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
	let messagestr = message.toString();
	if (logs) {
		console.log(message.toAnsi());
		auth.botAuth(bot, messagestr);
	}
	if (messagestr.includes("получено от игрока")) {
		let findAmount = messagestr.match(/\$(\d+)/);
		let amount = (findAmount[1] / 1000000) * 2;
		console.log(amount);
	}
});

async function handleConsoleInput(input) {
	const cmd = input.trim();
	const args = cmd.split(' ');

	switch (args[0]) {
		case '~':
			// setTimeout(() => auth.selectMenu(bot, 21), 750);
			setTimeout(() => bot.clickWindow(21, 0, 0), 1500);

			setTimeout(() => bot.clickWindow(31, 0, 0), 1500);
			break;
		case 'logs':
			logs = !logs;
			break;
		default:
			bot.chat(cmd);
			break;

	}
}

rl.on('line', handleConsoleInput);

bot.on('kicked', (reason) => {
	console.log(`Бот был кикнут с сервера по причине: ${reason}`);
});
bot.on('error', err => {
	console.log(`Ошибка: ${err}`);
});
