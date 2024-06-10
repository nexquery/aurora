const select = new StringSelectMenuBuilder().setCustomId('oyun').setPlaceholder('Oyun Rolleri')
.addOptions(
	{ emoji: '👾',		label: 'Valorant',				value: 'oyun-valorant' },
	{ emoji: '👾',		label: 'Counter Strike',		value: 'oyun-cs' },
	{ emoji: '👾',		label: 'League of Legends',		value: 'oyun-lol' },
	{ emoji: '👾',		label: 'PUBG: Battlegrounds',	value: 'oyun-pubg' },
	{ emoji: '👾',		label: 'Zula',					value: 'oyun-zula' },
	{ emoji: '👾',		label: 'Wild Rift',				value: 'oyun-wildrift' },
	{ emoji: '👾',		label: 'Mobile Legends',		value: 'oyun-mlbb' },
	{ emoji: '🗑️',		 label: 'Tüm Rolleri Kaldır',	 value: 'oyun-sil' },
);

const row = new ActionRowBuilder().addComponents(select);
message.channel.send( 
	{ content: 'Merhaba AURORA sunucusunun değerli üyeleri. Almak istediğiniz oyun rollerini aşağıdan seçebilirsiniz.', 
	components: [row] 
} )