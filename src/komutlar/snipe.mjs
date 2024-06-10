/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		snipe.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		12.05.2024, 13:26:09
 */

import { Client, Message, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder} from "discord.js";
import { MAX_SNIPE, Snipe_Getir } from "../fonksiyonlar/snipe.mjs";
import { convertTime } from "../fonksiyonlar/timestamp.mjs";
import { MessageEmbed } from "../fonksiyonlar/embed.mjs";
import { Regex_Sayi } from "../fonksiyonlar/regex.mjs";

export const alias = [
	"snipe"
];

export const data = [
	new SlashCommandBuilder().setName(alias[0]).setDescription('Sunucudaki silinmiş mesajları gösterir.')
	.addNumberOption(m => m.setName('değer').setDescription('Kaç mesaj gösterilsin?')
		.addChoices({ name: '1', value: 1 })
		.addChoices({ name: '2', value: 2 })
		.addChoices({ name: '3', value: 3 })
		.addChoices({ name: '4', value: 4 })
		.addChoices({ name: '5', value: 5 })
		.setMinValue(1)
		.setMaxValue(MAX_SNIPE)
		.setRequired(true)
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
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
		const deger = interaction.options.getNumber('değer');

		let icerik = '';
		const data = Snipe_Getir();
		const max_deger = (deger >= data.length) ? data.length : deger;

		if(max_deger === 1)
		{
			icerik += `**Mesajı Silen veya Silinen:**\n<@${data[0].mesaj_silen}>\n\n`;
			icerik += `**Mesaj İçeriği:**\n${data[0].mesaj_icerigi}\n\n`;
			icerik += `**Mesajın Silinme Tarihi:**\n${convertTime(data[0].mesaj_tarihi)}`;
		}
		else
		{
			for(let i = 0; i < max_deger; i++)
			{
				icerik += `**#${i + 1}${i === 0 ? ' (En Son Silinen)' : ''}**\n`;
				icerik += `**Mesajı Silen veya Silinen:** <@${data[i].mesaj_silen}>\n`;
				icerik += `**Mesaj İçeriği:** ${data[i].mesaj_icerigi}\n`;
				icerik += `**Mesajın Silinme Tarihi:** ${convertTime(data[i].mesaj_tarihi)}${(i === max_deger - 1) ? `` : `\n\n`}`;
			}
		}

		interaction.reply({ embeds: [new EmbedBuilder().setColor('EE5A24').setTitle('Snipe').setDescription(icerik)]});
	}
	else if(interaction instanceof Message)
	{
		let icerik = '';
		const data = Snipe_Getir();
		const max_deger = (args.length === 0) ? 1 : data.length;
		
		if(!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
			return MessageEmbed(interaction, 'Red', 'Hata', 'Bu komutu kullanmak için yeterli yetkiniz bulunmuyor.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(data.length === 0) {
			return MessageEmbed(interaction, 'Red', 'Hata', 'Silinmiş bir mesaj bulunmuyor.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(args.length >= 1 && !Regex_Sayi(args[0])) {
			return MessageEmbed(interaction, 'Red', 'Hata', 'Geçerli bir sayı girmediniz.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(args.length >= 1 && Regex_Sayi(args[0]) && parseInt(args[0]) < 1 || parseInt(args[0]) > MAX_SNIPE) {
			return MessageEmbed(interaction, 'Red', 'Hata', `Snipe değeri 1 ile ${MAX_SNIPE} arasında olabilir.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(max_deger === 1)
		{
			icerik += `**Mesajı Silen veya Silinen:**\n<@${data[0].mesaj_silen}>\n\n`;
			icerik += `**Mesaj İçeriği:**\n${data[0].mesaj_icerigi}\n\n`;
			icerik += `**Mesajın Silinme Tarihi:**\n${convertTime(data[0].mesaj_tarihi)}`;
		}
		else
		{
			for(let i = 0; i < max_deger; i++)
			{
				icerik += `**#${i + 1}${i === 0 ? ' (En Son Silinen)' : ''}**\n`;
				icerik += `**Mesajı Silen veya Silinen:** <@${data[i].mesaj_silen}>\n`;
				icerik += `**Mesaj İçeriği:** ${data[i].mesaj_icerigi}\n`;
				icerik += `**Mesajın Silinme Tarihi:** ${convertTime(data[i].mesaj_tarihi)}${(i === max_deger - 1) ? `` : `\n\n`}`;
			}
		}

		interaction.channel.send({ embeds: [new EmbedBuilder().setColor('EE5A24').setTitle('Snipe').setDescription(icerik)]});
	}
}