const select = new StringSelectMenuBuilder().setCustomId('iliski').setPlaceholder('İlişki Rolleri')
.addOptions(
	{ label: 'Sevgilim Yok', value: 'iliski-yok', emoji: '💔', },
	{ label: 'LGBT', value: 'iliski-lgbt', emoji: '🏳️‍🌈', },
	{ label: 'Sevgilim Var', value: 'iliski-var', emoji: '❤️', },
	{ label: 'Rol İstemiyorum', value: 'iliski-sil', emoji: '🗑️', }
);

const row = new ActionRowBuilder().addComponents(select);
message.channel.send( { content: 'Merhaba AURORA sunucusunun değerli üyeleri. Almak istediğiniz ilişki rollerini aşağıdan seçebilirsiniz.', components: [row] } )