/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		sil.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		07.05.2024, 23:11:01
 */

import { Client, Message, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } from "discord.js";
import { InteractionEmbed, MessageEmbed } from "../fonksiyonlar/embed.mjs";
import Ayarlar from "../semalar/ayarlar.mjs";

export const alias = [
	"sil"
];

export const data = [
	new SlashCommandBuilder().setName('sil').setDescription('Chatteki mesajları siler.').setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
	.addNumberOption(m => m
		.setName('değer')
		.setDescription('Silinecek mesaj sayısı')
		.setRequired(true)
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
		let deger = interaction.options.getNumber('değer');

		if(!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
			return InteractionEmbed(interaction, 'Red', null, 'Bu komutu kullanmak için yeterli yetkiye sahip değilsin.', { reply: true, ephemeral: true, fetch: false });
		}

		if(!deger) {
			return InteractionEmbed(interaction, 'Red', null, 'Geçerli bir değer girmediniz.', { reply: true, ephemeral: true, fetch: false });
		}

		if(deger < 1 || deger > 100) {
			return InteractionEmbed(interaction, 'Red', null, 'Girilen değer 1 ile 100 arasında olabilir.', { reply: true, ephemeral: true, fetch: false });
		}

		interaction.reply({ content: 'Mesajlar silindi.', ephemeral: true });

		deger = (deger >= 100) ? 100 : deger;
		
		interaction.channel.messages.fetch({ limit: deger }).then(m => interaction.channel.bulkDelete(m));
	}
	else if(interaction instanceof Message)
	{
		const prefix = Ayarlar.sunucu.prefix;
		
		if(!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
			return MessageEmbed(interaction, 'Red', null, 'Bu komutu kullanmak için yeterli yetkiye sahip değilsin.', { reply: true, uyeSil: true, botSil: true, sure: 2700 });
		}
	
		if(args.length != 1) {
			return MessageEmbed(interaction, 'Blurple', null, `${prefix}sil [değer]`, { reply: true, uyeSil: false, botSil: false, sure: 2700 });
		}

		if(isNaN(parseInt(args[0]))) {
			return MessageEmbed(interaction, 'Red', null, 'Geçerli bir değer girmediniz.', { reply: true, uyeSil: true, botSil: true, sure: 2700 });
		}

		if(parseInt(args[0]) < 1 || parseInt(args[0]) > 100) {
			return MessageEmbed(interaction, 'Red', null, 'Değer 1 ile 100 arasında olabilir.', { reply: true, uyeSil: true, botSil: true, sure: 2700 });
		}
	
		let deger = parseInt(args[0]);
	
		deger = (deger >= 100) ? 100 : deger + 1;
	
		interaction.channel.messages.fetch({ limit: deger }).then(m => interaction.channel.bulkDelete(m));
	}
}