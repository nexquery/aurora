const select = new StringSelectMenuBuilder().setCustomId('burclar').setPlaceholder('Burç Rolleri')
.addOptions(
	{ emoji: '♈',		label: 'Koç',				value: 'burc-koc' },
	{ emoji: '♉',		label: 'Boğa',				value: 'burc-boga' },
	{ emoji: '♊',		label: 'İkizler',			value: 'burc-ikizler' },
	{ emoji: '♋',		label: 'Yengeç',			value: 'burc-yengec' },
	{ emoji: '♌',		label: 'Aslan',				value: 'burc-aslan' },
	{ emoji: '♍',		label: 'Başak',				value: 'burc-basak' },
	{ emoji: '♎',		label: 'Terazi',			value: 'burc-terazi' },
	{ emoji: '♏',		label: 'Akrep',				value: 'burc-akrep' },
	{ emoji: '♐',		label: 'Yay',				value: 'burc-yay' },
	{ emoji: '♑',		label: 'Oğlak',				value: 'burc-oglak' },
	{ emoji: '♒',		label: 'Kova',				value: 'burc-kova' },
	{ emoji: '♓',		label: 'Balık',				value: 'burc-balik' },
	{ emoji: '🗑️',		  label: 'Rol İstemiyorum',	  value: 'burc-sil' },
);

const row = new ActionRowBuilder().addComponents(select);
message.channel.send( 
	{ content: 'Merhaba AURORA sunucusunun değerli üyeleri. Almak istediğiniz burç rollerini aşağıdan seçebilirsiniz.', 
	components: [row] 
} )