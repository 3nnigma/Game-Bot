export async function tossItems(bot) {
	if (bot.inventory.items().length === 0) {
		console.log('У меня вещей больше нету.');
		return;
	}
	const item = bot.inventory.items()[0];
	try {
		await bot.tossStack(item);
		console.log('Выброшен предмет:', item.name);
		// Добавляем небольшую задержку перед следующей попыткой
		setTimeout(() => tossItems(bot), 500);
	} catch (err) {
		console.error('Ошибка при выбрасывании предмета:', err);
		// Повторяем попытку с небольшой задержкой
		setTimeout(() => tossItems(bot), 1000);
	}
}



function getSword() {
	const sword = bot.inventory.items().find(item => item.name.includes('sword'));
	if (sword) bot.equip(sword, 'hand');
}
