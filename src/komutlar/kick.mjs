/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		kick.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		11.05.2024, 18:48:44
 */

import { Client, Message, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { InteractionEmbed, MessageEmbed } from "../fonksiyonlar/embed.mjs";
import Ayarlar from "../semalar/ayarlar.mjs";
import Logger from "../fonksiyonlar/logger.mjs";
import { CKick } from "../fonksiyonlar/veritabani.mjs";

export const alias = [
	"kick"
];

export const data = [
	new SlashCommandBuilder().setName(alias[0]).setDescription('Bir kullanıcıyı sunucudan yasaklar.')
	.addUserOption(m => m.setName('kullanıcı').setDescription('Sunucudan yasaklanacak kullanıcı.').setRequired(true))
	.addStringOption(m => m.setName('sebep').setDescription('Kullanıcının yasaklanma sebebi.').setRequired(false))
	.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
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
		const user = interaction.options.getUser('kullanıcı');
		const sebep = interaction.options.getString('sebep');
		const kullanici = interaction.guild.members.cache.get(user.id);

		if(!user || !kullanici) {
			return InteractionEmbed(interaction, 'Red', 'Hata', `Geçerli bir kullanıcı etiketlemediniz.`, { reply: true, ephemeral: true });
		}

		if(kullanici.id == interaction.member.id) {
			return InteractionEmbed(interaction, 'Red', 'Hata', `Kendinizi sunucudan atamazsınız.`, { reply: true, ephemeral: true });
		}

		if(!kullanici.kickable) {
			return InteractionEmbed(interaction, 'Red', 'Hata', `Bu kullanıcıyı sunucudan atamazsınız.`, { reply: true, ephemeral: true });
		}

		if(kullanici.user.bot) {
			return InteractionEmbed(interaction, 'Red', 'Hata', `Botları sunucudan atamazsınız.`, { reply: true, ephemeral: true });
		}

		kullanici.kick(sebep).then(() => 
		{
			interaction.reply({ embeds: [new EmbedBuilder().setColor('#ff7f50').setTitle('Kick').setTimestamp().setDescription(
				(!sebep) ? 
				`${interaction.member} tarafından ${kullanici} adlı kullanıcı sunucudan atıldı.`
				:
				`${interaction.member} tarafından ${kullanici} adlı kullanıcı **${sebep}** sebebi ile sunucudan atıldı.`
			)]});

			Logger('Yeşil', (!sebep) ?
				`[${interaction.member.displayName / interaction.member.user.tag}] tarafından ${kullanici.displayName / kullanici.user.tag} adlı kullanıcı sunucudan atıldı.` 
				:
				`[${interaction.member.displayName / interaction.member.user.tag}] tarafından ${kullanici.displayName / kullanici.user.tag} adlı kullanıcı ${sebep} sebebi ile sunucudan atıldı.`
			);

			CKick.insertOne({
				kickleyen_id: interaction.member.id,
				kickleyen_discord_adi: interaction.member.user.tag,
				kickleyen_sunucu_adi: interaction.member.displayName,
				
				kicklenen_id: kullanici.id,
				kicklenen_discord_adi: kullanici.user.tag,
				kicklenen_sunucu_adi: kullanici.displayName,

				tarih: Date.now(),
				sebep: (!sebep) ? 'Belirtilmedi' : sebep
			});
		})
		.catch(hata => 
		{
			Logger('Kırmızı', `Yetkili [${interaction.member.displayName / interaction.member.user.tag}], ${kullanici.displayName / kullanici.user.tag} adlı kullanıcıyı sunucudan kicklerken bir hata oluştu: ${hata}`);
			InteractionEmbed(interaction, 'Red', 'Hata', `${kullanici} adlı kullanıcı sunucudan atılırken bir hata oluştu.`, { reply: true, ephemeral: true });
		});
	}
	else if(interaction instanceof Message)
	{
		const kullanici = interaction.mentions.members.first() || interaction.guild.members.cache.get(args[0]);
		const sebep = args.slice(1).join(' ');
		
		if(!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
			return MessageEmbed(interaction, 'Red', 'Hata', 'Bu komutu kullanmak için yeterli yetkiniz bulunmuyor.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(args.length < 1) {
			return MessageEmbed(interaction, 'Blurple', 'Kullanım', `${Ayarlar.sunucu.prefix}kick [@Kullanıcı veya ID] [İsteğe Bağlı Sebep]`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(!kullanici) {
			return MessageEmbed(interaction, 'Red', 'Hata', 'Geçerli bir kullanıcı etiketlemediniz.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(kullanici.id == interaction.member.id) {
			return MessageEmbed(interaction, 'Red', 'Hata', `Kendinizi sunucudan atamazsınız.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(!kullanici.kickable) {
			return MessageEmbed(interaction, 'Red', 'Hata', `Bu kullanıcıyı sunucudan atamazsınız.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(kullanici.user.bot) {
			return MessageEmbed(interaction, 'Red', 'Hata', `Botları sunucudan atamazsınız.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		kullanici.kick(sebep).then(() => 
		{
			interaction.channel.send({ embeds: [new EmbedBuilder().setColor('#ff7f50').setTitle('Kick').setTimestamp().setDescription(
				(!sebep) ? 
				`${interaction.member} tarafından ${kullanici} adlı kullanıcı sunucudan atıldı.`
				:
				`${interaction.member} tarafından ${kullanici} adlı kullanıcı **${sebep}** sebebi ile sunucudan atıldı.`
			)]});

			Logger('Yeşil', (!sebep) ?
				`[${interaction.member.displayName / interaction.member.user.tag}] tarafından ${kullanici.displayName / kullanici.user.tag} adlı kullanıcı sunucudan atıldı.` 
				:
				`[${interaction.member.displayName / interaction.member.user.tag}] tarafından ${kullanici.displayName / kullanici.user.tag} adlı kullanıcı ${sebep} sebebi ile sunucudan atıldı.`
			);

			CKick.insertOne({
				kickleyen_id: interaction.member.id,
				kickleyen_discord_adi: interaction.member.user.tag,
				kickleyen_sunucu_adi: interaction.member.displayName,
				
				kicklenen_id: kullanici.id,
				kicklenen_discord_adi: kullanici.user.tag,
				kicklenen_sunucu_adi: kullanici.displayName,

				tarih: Date.now(),
				sebep: (!sebep) ? 'Belirtilmedi' : sebep
			});
		})
		.catch(hata => 
		{
			Logger('Kırmızı', `Yetkili [${interaction.member.displayName / interaction.member.user.tag}], ${kullanici.displayName / kullanici.user.tag} adlı kullanıcıyı sunucudan kicklerken bir hata oluştu: ${hata}`);
			MessageEmbed(interaction, 'Red', 'Hata', `${kullanici} adlı kullanıcı sunucudan atılırken bir hata oluştu.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		});
	}
}