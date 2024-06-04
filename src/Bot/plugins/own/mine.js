
async function dig() {
	let blockPosition = bot.entity.position.offset(0, -1, 0);
	let block = bot.blockAt(blockPosition);

	await bot.dig(block);
	bot.chat('Dug');
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

export async function collectBlockByCount(bot, type, count) {
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

export async function collectBlocks(bot, type) {
	const blockType = mcData.blocksByName[type];
	if (!blockType) {
		bot.chat(`I don't know any blocks named ${type}.`);
		return;
	}

	const block = bot.findBlock({
		matching: blockType.id,
		maxDistance: 64
	});

	if (!block) {
		bot.chat("I don't see that block nearby.");
		return;
	}

	const targets = bot.collectBlock.findFromVein(block);
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