/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		jail.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		12.05.2024, 13:25:28
 */

import { Client, Message, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { InteractionEmbed, MessageEmbed } from "../fonksiyonlar/embed.mjs";
import Ayarlar from "../semalar/ayarlar.mjs";
import Logger from "../fonksiyonlar/logger.mjs";
import { CJail, CKick, Collection_Kullanici } from "../fonksiyonlar/veritabani.mjs";
import Roller from "../semalar/roller.mjs";

export const alias = [
	"jail"
];

export const data = [
	new SlashCommandBuilder().setName(alias[0]).setDescription('Bir kullanıcıyı jaile gönderir.')
	.addUserOption(m => m.setName('kullanıcı').setDescription('Jaile atılacak kullanıcı.').setRequired(true))
	.addStringOption(m => m.setName('sebep').setDescription('Jaile atılma sebebi.').setRequired(true))
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
		const sebep		= interaction.options.getString('sebep');
		const kullanici	= interaction.guild.members.cache.get(user.id);
	
		if(!user || !kullanici) {
			return InteractionEmbed(interaction, 'Red', 'Hata', `Geçerli bir kullanıcı girmediniz`, { ephemeral: true, reply: true });
		}

		CJail.findOne({ "jail_atilan_id": kullanici.id }).then(m =>
		{
			if(m) return InteractionEmbed(interaction, 'Red', 'Hata', 'Bu kullanıcı zaten jaile atılmış.', { ephemeral: true, reply: true });
			kullanici.fetch(true).then(x => 
			{
				x.roles.add(Roller.jail).then(m => 
				{
					const rol = (m.roles.cache.has(Roller.erkek)) ? Roller.erkek : Roller.kiz;
					m.roles.remove(rol).then(u =>
					{
						CJail.insertOne(
						{
							"jail_atan_id:": interaction.member.id,
							"jail_atan_discord_adi": interaction.user.tag,
							"jail_atan_sunucu_adi": interaction.member.displayName,
	
							"jail_atilan_id": kullanici.id,
							"jail_atilan_discord_adi": kullanici.user.tag,
							"jail_atilan_sunucu_adi": kullanici.displayName,
							
							"rol": rol,
							"tarih": Date.now(),
							"sebep": sebep
						});
	
						Logger('Yeşil', `${kullanici.displayName} (${kullanici.id}) adlı kullanıcı ${interaction.member.displayName} (${interaction.member.id}) tarafından **${sebep}** sebebi ile jaile gönderildi.`);
	
						InteractionEmbed(interaction, 'Green', 'Bilgi', `${kullanici} adlı kullanıcı ${interaction.member} tarafından **${sebep}** sebebi ile jaile gönderildi.`, { ephemeral: false, reply: false });
					});
				})
			});
		});
	}
	else if(interaction instanceof Message)
	{
		const kullanici	= interaction.mentions.members.first() || interaction.guild.members.cache.get(args[0]);
		const sebep		= args.slice(1).join(' ');

		if(!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
			return MessageEmbed(interaction, 'Red', 'Hata', 'Bu komutu kullanmak için yeterli yetkiniz bulunmuyor.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(args.length < 2) {
			return MessageEmbed(interaction, 'Blurple', 'Kullanım', `${Ayarlar.sunucu.prefix}jail [@Kullanıcı veya ID] [Sebep]`);
		}

		if(!kullanici || !sebep) {
			return MessageEmbed(interaction, 'Red', 'Hata', 'Geçerli bir kullanıcı veya sebep girmediniz.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		CJail.findOne({ "jail_atilan_id": kullanici.id }).then(m =>
		{
			if(m) return MessageEmbed(interaction, 'Red', 'Hata', 'Bu kullanıcı zaten jaile atılmış.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			kullanici.fetch(true).then(x => 
			{
				x.roles.add(Roller.jail).then(m => 
				{
					const rol = (m.roles.cache.has(Roller.erkek)) ? Roller.erkek : Roller.kiz;
					m.roles.remove(rol).then(u =>
					{
						CJail.insertOne(
						{
							"jail_atan_id:": interaction.member.id,
							"jail_atan_discord_adi": interaction.member.user.tag,
							"jail_atan_sunucu_adi": interaction.member.displayName,
	
							"jail_atilan_id": kullanici.id,
							"jail_atilan_discord_adi": kullanici.user.tag,
							"jail_atilan_sunucu_adi": kullanici.displayName,
							
							"rol": rol,
							"tarih": Date.now(),
							"sebep": sebep
						});
	
						Logger('Yeşil', `${kullanici.displayName} (${kullanici.id}) adlı kullanıcı ${interaction.member.displayName} (${interaction.member.id}) tarafından ${sebep} sebebi ile jaile gönderildi.`);

						MessageEmbed(interaction, 'Green', 'Bilgi', `${kullanici} adlı kullanıcı ${interaction.member} tarafından **${sebep}** sebebi ile jaile gönderildi.`);
					});
				})
			});
		});
	}
}