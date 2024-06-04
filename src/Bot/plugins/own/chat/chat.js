import { collectBlockByCount, collectBlocks } from "../mine";



export function handleChat(message, username, bot) {
	if (username === bot.username) return;

	let message = text.split('›');
	if (message.length > 1) {
		message = message[1].trim().split(' ');
		switch (message[0]) {
			case 'collect':
				let count = 1;
				let type = args[1];
				if (message.length === 3) {
					count = parseInt(args[1]);
					type = args[2];
					collectBlockByCount(bot, type, count);
				} else {
					collectBlocks(bot, type);
				}
				break;
		}
	}
};