/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		slowMode.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		12.05.2024, 13:25:59
 */

import { Client, Message, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder} from "discord.js";
import { MAX_SNIPE, Snipe_Getir } from "../fonksiyonlar/snipe.mjs";
import { convertTime } from "../fonksiyonlar/timestamp.mjs";
import { InteractionEmbed, MessageEmbed } from "../fonksiyonlar/embed.mjs";
import { Regex_Sayi } from "../fonksiyonlar/regex.mjs";
import Ayarlar from "../semalar/ayarlar.mjs";

export const alias = [
	"slowmode"
];

export const data = [
	new SlashCommandBuilder().setName(alias[0]).setDescription('Bir kanala mesaj atmayı yavaşlatır.')
		.addNumberOption(m => m.setName('süre').setDescription('Geçerli süreyi seçin')
		.addChoices({ name: '0', value: 0 })
		.addChoices({ name: '1', value: 1 })
		.addChoices({ name: '2', value: 2 })
		.addChoices({ name: '3', value: 3 })
		.addChoices({ name: '4', value: 4 })
		.addChoices({ name: '5', value: 5 })
		.addChoices({ name: '6', value: 6 })
		.addChoices({ name: '7', value: 7 })
		.addChoices({ name: '8', value: 8 })
		.addChoices({ name: '9', value: 9 })
		.addChoices({ name: '10', value: 10 })
		.setMinValue(1)
		.setMaxValue(10)
		.setRequired(true)
	)
	.addChannelOption(m => m.setName('kanal').setDescription('Yavaşlatılacak kanal (Belirtilmezse mevcut kanal yavaşlatılır.)').setRequired(false))
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
];

/**
 * @param {Client} client
 * @param {CommandInteraction | Message} interaction
 * @param {String} cmd
 * @param {String[]} args
 */

export async function execute(client, interaction, cmd, args)
{
	if(interaction instanceof CommandInteraction)
	{
		const sure = interaction.options.getNumber('süre');
		const channel = interaction.options.getChannel('kanal');
		const kanal = interaction.guild.channels.cache.get((!channel) ? interaction.channel.id : channel.id);

		kanal.setRateLimitPerUser(sure);

		InteractionEmbed(interaction, 'Green', 'Bilgi', (sure === 0) ? 
			`${kanal} kanalının slow modu kaldırıldı.` : 
			`${kanal} kanalı ${sure} saniye mesaj atılacak şekilde yavaşlatıldı.`, { ephemeral: false, reply: false }
		);
	}
	else if(interaction instanceof Message)
	{
		const sure = parseInt(args[0]);
		const kanal = (args[1]) ? (interaction.mentions.channels.first() || interaction.guild.channels.cache.get(args[1])) : (interaction.guild.channels.cache.get(interaction.channel.id));

		if(!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
			return MessageEmbed(interaction, 'Red', 'Hata', 'Bu komutu kullanmak için yeterli yetkiniz bulunmuyor.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(args.length === 0) {
			return MessageEmbed(interaction, 'Blurple', 'Kullanım', `${Ayarlar.sunucu.prefix}slowmode [süre] [#kanal] (Belirtilmezse mevcut kanalı yavaşlatılır)`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(!Regex_Sayi(args[0])) {
			return MessageEmbed(interaction, 'Red', 'Hata', 'Geçerli bir süre girmediniz.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(parseInt(args[0]) < 0 || parseInt(args[0]) > 10) {
			return MessageEmbed(interaction, 'Red', 'Hata', 'Süre 0 ile 10 arasında olabilir. (0 girilirse slow mode kaldırılır)', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		kanal.setRateLimitPerUser(sure);

		MessageEmbed(interaction, 'Green', 'Bilgi', (sure === 0) ? 
			`${kanal} kanalının slow modu kaldırıldı.` : 
			`${kanal} kanalı ${sure} saniye mesaj atılacak şekilde yavaşlatıldı.`
		);
	}
}