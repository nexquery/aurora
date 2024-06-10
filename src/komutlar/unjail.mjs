/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		unjail.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		15.05.2024, 13:41:09
 */

import { Client, Message, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { InteractionEmbed, MessageEmbed } from "../fonksiyonlar/embed.mjs";
import Ayarlar from "../semalar/ayarlar.mjs";
import Logger from "../fonksiyonlar/logger.mjs";
import { CJail, CKick, Collection_Kullanici } from "../fonksiyonlar/veritabani.mjs";
import Roller from "../semalar/roller.mjs";

export const alias = [
	"unjail"
];

export const data = [
	new SlashCommandBuilder().setName(alias[0]).setDescription('Bir kullanıcıyı jailden çıkarır.')
	.addUserOption(m => m.setName('kullanıcı').setDescription('Jailden çıkartılacak kullanıcı.').setRequired(true))
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
		const user		= interaction.options.getUser('kullanıcı');
		const kullanici	= interaction.guild.members.cache.get(user.id);
	
		if(!user || !kullanici) {
			return InteractionEmbed(interaction, 'Red', 'Hata', `Geçerli bir kullanıcı girmediniz.`, { ephemeral: true, reply: true });
		}

		CJail.findOne({ "jail_atilan_id": kullanici.id }).then(m =>
		{
			if(!m) return InteractionEmbed(interaction, 'Red', 'Hata', 'Bu kullanıcı jaile atılmamış.', { ephemeral: true, reply: true });
			kullanici.fetch(true).then(x =>
			{
				x.roles.add(m.rol).then(r =>
				{
					r.roles.remove(Roller.jail).then(() =>
					{
						InteractionEmbed(interaction, 'Green', 'Bilgi', `${kullanici} adlı kullanıcı ${interaction.member} tarafından jailden çıkartıldı.`, { ephemeral: false, reply: false });
					
						CJail.deleteOne({ _id: m._id });
					});
				});
			});
		});
	}
	else if(interaction instanceof Message)
	{
		const kullanici = interaction.mentions.members.first() || interaction.guild.members.cache.get(args[0]);

		if(!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
			return MessageEmbed(interaction, 'Red', 'Hata', 'Bu komutu kullanmak için yeterli yetkiniz bulunmuyor.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(args.length !== 1) {
			return MessageEmbed(interaction, 'Blurple', 'Kullanım', `${Ayarlar.sunucu.prefix}unjail [@Kullanıcı veya ID]`);
		}

		if(!kullanici) {
			return MessageEmbed(interaction, 'Red', 'Hata', 'Geçerli bir kullanıcı girmediniz.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		CJail.findOne({ "jail_atilan_id": kullanici.id }).then(m =>
		{
			if(!m) return MessageEmbed(interaction, 'Red', 'Hata', 'Bu kullanıcı jaile atılmamış.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			kullanici.fetch(true).then(x =>
			{
				x.roles.add(m.rol).then(r =>
				{
					r.roles.remove(Roller.jail).then(() =>
					{
						Logger('Yeşil', `${kullanici.displayName} (${kullanici.id}) adlı kullanıcı ${interaction.member.displayName} (${interaction.member.id}) tarafından jailden çıkartıldı.`);

						MessageEmbed(interaction, 'Green', 'Bilgi', `${kullanici} adlı kullanıcı ${interaction.member} tarafından jailden çıkartıldı.`);
					
						CJail.deleteOne({ _id: m._id });
					});
				});
			});
		});
	}
}