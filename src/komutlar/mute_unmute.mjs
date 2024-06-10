/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		mute_unmute.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		12.05.2024, 13:25:40
 */

import { Client, Message, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { InteractionEmbed, MessageEmbed } from "../fonksiyonlar/embed.mjs";
import Ayarlar from "../semalar/ayarlar.mjs";
import Logger from "../fonksiyonlar/logger.mjs";
import { CJail, CKick, Collection_Kullanici } from "../fonksiyonlar/veritabani.mjs";
import Roller from "../semalar/roller.mjs";
import { Regex_Sayi } from "../fonksiyonlar/regex.mjs";

export const alias = [
	"mute", "unmute"
];

export const data = [
	// Mute
	new SlashCommandBuilder().setName(alias[0]).setDescription('Bir kullanıcının mesaj yazmasını ve sesli sohbetlere girmesini engeller.')
	.addUserOption(m => m.setName('kullanıcı').setDescription('Mute atılacak kullanıcı.').setRequired(true))
	.addStringOption(m => m.setName('süre').setDescription('Ne kadar süre muteli kalsın ?')
		.addChoices(
			{ name: '1 Dakika', value: '60000' },
			{ name: '5 Dakika', value: '300000' },
			{ name: '10 Dakika', value: '600000' },
			{ name: '1 Saat', value: '3600000' },
			{ name: '1 Gün', value: '86400000' },
			{ name: '1 Hafta', value: '604800000' }
		)
		.setRequired(true)
	).setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

	// Unmute
	new SlashCommandBuilder().setName(alias[1]).setDescription('Mute atılmış bir kullanıcının engelini kaldırır.')
	.addUserOption(m => m.setName('kullanıcı').setDescription('Mutesi kaldırılacak kullanıcı.').setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
];

const sureSecenekleri = [
	{ name: '1 Dakika', value: '60000' },
	{ name: '5 Dakika', value: '300000' },
	{ name: '10 Dakika', value: '600000' },
	{ name: '1 Saat', value: '3600000' },
	{ name: '1 Gün', value: '86400000' },
	{ name: '1 Hafta', value: '604800000' }
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
		if(interaction.commandName === 'mute')
		{
			const user		= interaction.options.getUser('kullanıcı');
			const sure		= interaction.options.getString('süre');
			const kullanici	= interaction.guild.members.cache.get(user.id);
			const sureIsim	= sureSecenekleri.find(m => m.value === sure);

			if(!user || !kullanici) {
				return InteractionEmbed(interaction, 'Red', 'Hata', `Geçerli bir kullanıcı girmediniz.`, { ephemeral: true, reply: true });
			}

			if(kullanici.id == interaction.member.id || kullanici.user.bot) {
				return InteractionEmbed(interaction, 'Red', 'Hata', `Kendine veya botlara mute atamazsın.`, { ephemeral: true, reply: true });
			}

			if(kullanici.communicationDisabledUntilTimestamp) {
				return InteractionEmbed(interaction, 'Red', 'Hata', `Bu kullanıcı zaten muteli.`, { ephemeral: true, reply: true });
			}

			kullanici.timeout(parseInt(sure)).then(() => 
			{
				InteractionEmbed(interaction, '#ff7f50', 'Mute', `${kullanici} adlı kullanıcı ${interaction.member} tarafından **${(sureIsim) ? sureIsim.name : `${sure} saniye`}** mutelendi.`);
			})
			.catch(() => InteractionEmbed(interaction, 'Red', 'Hata', `Kullanıcı mutelenirken bir hata oluştu.`, { ephemeral: true, reply: true }));
		}
		else if(interaction.commandName === 'unmute')
		{
			const user		= interaction.options.getUser('kullanıcı');
			const kullanici	= interaction.guild.members.cache.get(user.id);

			if(!user || !kullanici) {
				return InteractionEmbed(interaction, 'Red', 'Hata', `Geçerli bir kullanıcı girmediniz.`, { ephemeral: true, reply: true });
			}

			if(kullanici.id == interaction.member.id || kullanici.user.bot) {
				return InteractionEmbed(interaction, 'Red', 'Hata', `Kendi muteni veya botların mutesini kaldıramazsın.`, { ephemeral: true, reply: true });
			}

			if(!kullanici.communicationDisabledUntilTimestamp) {
				return InteractionEmbed(interaction, 'Red', 'Hata', `Bu kullanıcı muteli değil.`, { ephemeral: true, reply: true });
			}

			kullanici.disableCommunicationUntil(null).then(() => 
			{
				InteractionEmbed(interaction, 'Green', 'Unmute', `${kullanici} adlı kullanıcının mutesi ${interaction.member} tarafından kaldırıldı.`);
			})
			.catch(() => InteractionEmbed(interaction, 'Red', 'Hata', `Kullanıcının mutesi kaldırılırken bir hata oluştu.`, { ephemeral: true, reply: true }));
		}
	}
	else if(interaction instanceof Message)
	{
		if(cmd === 'mute')
		{
			const kullanici = interaction.mentions.members.first() || interaction.guild.members.cache.get(args[0]);
			const dakika	= parseInt(args[1]);

			if(!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
				return MessageEmbed(interaction, 'Red', 'Hata', 'Bu komutu kullanmak için yeterli yetkiniz bulunmuyor.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			}

			if(args.length !== 2) {
				return MessageEmbed(interaction, 'Blurple', 'Kullanım', `${Ayarlar.sunucu.prefix}mute [@Kullanıcı veya ID] [Dakika = 1...10080]`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			}

			if(kullanici.id == interaction.member.id || kullanici.user.bot) {
				return MessageEmbed(interaction, 'Red', 'Hata', `Kendini veya botları muteleyemezsin.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			}

			if(kullanici.communicationDisabledUntilTimestamp) {
				return MessageEmbed(interaction, 'Red', 'Hata', `Bu kullanıcı zaten muteli.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			}

			if(!Regex_Sayi(args[1])) {
				return MessageEmbed(interaction, 'Red', 'Hata', `Dakika formatı geçerli değil.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			}

			if(dakika < 1 || dakika > 10080) {
				return MessageEmbed(interaction, 'Red', 'Hata', `Dakikayı 1 ile 10080 arası girebilirsin.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			}

			kullanici.timeout((dakika * (1000 * 60))).then(() => 
			{
				MessageEmbed(interaction, '#ff7f50', 'Mute', `${kullanici} adlı kullanıcı ${interaction.member} tarafından **${dakika}** dakika mutelendi.`);
			})
			.catch(() => MessageEmbed(interaction, 'Red', 'Hata', `Kullanıcı mutelenirken bir hata oluştu.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 }));
		}
		else if(cmd === 'unmute')
		{
			const kullanici = interaction.mentions.members.first() || interaction.guild.members.cache.get(args[0]);

			if(!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
				return MessageEmbed(interaction, 'Red', 'Hata', 'Bu komutu kullanmak için yeterli yetkiniz bulunmuyor.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			}

			if(args.length !== 1) {
				return MessageEmbed(interaction, 'Blurple', 'Kullanım', `${Ayarlar.sunucu.prefix}unmute [@Kullanıcı veya ID]`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			}

			if(kullanici.id == interaction.member.id || kullanici.user.bot) {
				return MessageEmbed(interaction, 'Red', 'Hata', `Kendi muteni veya botların mutesini kaldıramazsın.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			}

			if(!kullanici.communicationDisabledUntilTimestamp) {
				return MessageEmbed(interaction, 'Red', 'Hata', `Bu kullanıcı muteli değil.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			}

			kullanici.disableCommunicationUntil(null).then(() => 
			{
				MessageEmbed(interaction, 'Green', 'Unmute', `${kullanici} adlı kullanıcının mutesi ${interaction.member} tarafından kaldırıldı.`);
			})
			.catch(() => MessageEmbed(interaction, 'Red', 'Hata', `Kullanıcının mutesi kaldırılırken bir hata oluştu.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 }));
		}
	}
}