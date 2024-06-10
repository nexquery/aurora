/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		avatar.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		10.05.2024, 10:21:52
 */

import { Client, Message, SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import { MessageEmbed } from "../fonksiyonlar/embed.mjs";
import Ayarlar from "../semalar/ayarlar.mjs";

export const alias = [
	"avatar"
];

export const data = [
	new SlashCommandBuilder().setName(alias[0]).setDescription('Bir kullanıcının avatar resmini gösterir.')
	.addUserOption(m => m
		.setName('kullanıcı')
		.setDescription('Seçtiğiniz kullanıcının avatarını gösterir, seçmezseniz komutu kullanan kişinin avatarını gösterir.')
		.setRequired(false)
	)
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
		const user = interaction.options.getUser('kullanıcı');		
		if(!user)
		{
			interaction.reply({ content: interaction.member.displayAvatarURL({ dynamic: true, size: 2048 }), ephemeral: false });
		}
		else
		{
			const kullanici = interaction.guild.members.cache.get(user.id);
			interaction.reply({ content: kullanici.displayAvatarURL({ dynamic: true, size: 2048 }), ephemeral: false });
		}
	}
	else if(interaction instanceof Message)
	{
		const message = interaction;

		if(args.length == 0)
		{
			message.channel.send(message.member.displayAvatarURL({ dynamic: true, size: 2048 }));
		}
		else
		{
			const kullanici = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

			if(args.length != 1) {
				return MessageEmbed(message, 'Blurple', 'Kullanım', `${Ayarlar.sunucu.prefix}avatar [@Kullanıcı veya ID]`);
			}

			if(!kullanici) {
				return MessageEmbed(message, 'Red', 'Hata', `Geçerli bir kullanıcı girmediniz.`);
			}

			message.channel.send(kullanici.displayAvatarURL({ dynamic: true, size: 2048 }));
		}
	}
}