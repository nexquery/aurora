/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		ping.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		07.05.2024, 12:42:21
 */

import { Client, Message, SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";

// Ana komutun index numarası her zaman 0 olması gerek
export const alias = [
	"ping"
];

export const data = [
	new SlashCommandBuilder().setName(alias[0]).setDescription('Botun geçikmesi süresini gösterir.')
];

/**
 * @param {Client} _
 * @param {CommandInteraction | Message} interaction
 * @param {String} cmd
 * @param {String[]} args
 */

export async function execute(_, interaction, cmd, args)
{
	if(interaction instanceof CommandInteraction)
	{
		interaction.deferReply({ ephemeral: true, fetchReply: true }).then(m => 
		{
			const gonderildi = new EmbedBuilder().setColor('Orange').setDescription(`Botun gecikme süresi: **${m.createdTimestamp - interaction.createdTimestamp}ms**`);
			interaction.editReply({ ephemeral: true, embeds: [gonderildi] });
		});
	}
	else if(interaction instanceof Message)
	{
		const gonderiliyor = new EmbedBuilder().setColor('Orange').setDescription('Ping gönderiliyor...');
		interaction.reply({ embeds: [gonderiliyor] }).then(m =>
		{
			const gonderildi = new EmbedBuilder().setColor('Orange').setDescription(`Botun gecikme süresi: **${m.createdTimestamp - interaction.createdTimestamp}ms**`);
			m.edit({ embeds: [gonderildi] });
		});
	}
}