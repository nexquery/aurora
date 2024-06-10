const select = new StringSelectMenuBuilder().setCustomId('renkler').setPlaceholder('Renk Rolleri')
.addOptions(
	{ emoji: '🟪',		label: 'Mor',					value: 'renk-mor' },
	{ emoji: '🟨',		label: 'Sarı',					value: 'renk-sari' },
	{ emoji: '🟩',		label: 'Yeşil',					value: 'renk-yesil' },
	{ emoji: '🟪',		label: 'Pembe',					value: 'renk-pembe' },
	{ emoji: '🟥',		label: 'Kırmızı',				value: 'renk-kirmizi' },
	{ emoji: '🗑️',		 label: 'Rol İstemiyorum',		 value: 'renk-sil' },
);

const row = new ActionRowBuilder().addComponents(select);
message.channel.send( 
	{ content: 'Merhaba AURORA sunucusunun değerli üyeleri. Sunucu içerisindeki renklerini değiştirmek için <@&1225304684223397899> rölüne sahip olmanız gerekmektedir. Eğer bu role sahipseniz aşağıdan istediğiniz renkleri seçebilirsiniz.', 
	components: [row] 
} )