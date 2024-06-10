/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		unban.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		11.05.2024, 17:57:35
 */

import { Client, Message, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, GuildMember, User } from "discord.js";
import { InteractionEmbed, MessageEmbed } from "../fonksiyonlar/embed.mjs";
import Ayarlar from "../semalar/ayarlar.mjs";
import Logger from "../fonksiyonlar/logger.mjs";
import { Collection_Unban } from "../fonksiyonlar/veritabani.mjs";

export const alias = [
	"unban"
];

export const data = [
	new SlashCommandBuilder().setName(alias[0]).setDescription('Sunucudan yasaklanan bir kullanıcının yasağını kaldırır.')
	.addStringOption(m => m.setName('kullanıcı-id').setDescription('Yasağı kaldırılacak kullanıcının id\'si.').setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
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
		const id = interaction.options.getString('kullanıcı-id');		
		const regex = /^\d+$/;

		if(!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
			return InteractionEmbed(interaction, 'Red', 'Hata', 'Bu komutu kullanmak için yeterli yetkiniz bulunmuyor.', { reply: true, ephemeral: true });
		}

		if(!regex.test(id)) {
			return InteractionEmbed(interaction, 'Red', 'Hata', 'Geçerli bir kullanıcı id girmediniz.', { reply: true, ephemeral: true });
		}

		interaction.guild.bans.fetch().then(u => 
		{
			if(!u.has(id)) {
				Logger('Kırmızı', `[${interaction.member.displayName} / ${interaction.member.user.tag}] adlı kullanıcı ${id} id'li yasaklı olmayan kullanıcının sunucu yasağını kaldırma girişiminde bulundu.`);
				return InteractionEmbed(interaction, 'Red', 'Hata', 'Bu id de bir kullanıcı yasaklı değil.', { reply: true, ephemeral: true });
			}

			interaction.guild.bans.remove(id).then(() => 
			{
				Logger('Yeşil', `[${interaction.member.displayName} / ${interaction.member.user.tag}] adlı kullanıcı ${id} id'li kullanıcının banını kaldırdı.`);
				
				InteractionEmbed(interaction, 'Green', 'Bilgi', `<@${id}> (${id}) adlı kullanıcının sunucu yasağı kaldırıldı.`, { reply: true, ephemeral: true });
			
				Collection_Unban.insertOne({
					kaldiran_id: interaction.member.id,
					kaldiran_kullanici_adi: interaction.member.user.tag,
					kaldiran_sunucu_adi: interaction.member.displayName,
					tarih: Date.now(),
					kaldirilan_id: id
				});
			})
			.catch(hata => 
			{
				Logger('Kırmızı', `[${interaction.member.displayName} / ${interaction.member.user.tag}] adlı kullanıcı ${id} id'li kullanıcının banını kaldırırken bir hata oluştu: ${hata}`);
				InteractionEmbed(interaction, 'Red', 'Hata', `${id} id'li kullanıcının sunucu yasağı kaldırılırken bir hata oluştu.`, { reply: true, ephemeral: true });
			});
		})
		.catch(hata => {
			Logger('Kırmızı', `[${interaction.member.displayName} / ${interaction.member.user.tag}] adlı kullanıcı unban işlevini kullanırken bir hata gelişti: ${hata}`);
			InteractionEmbed(interaction, 'Red', 'Hata', `Bir hata oluştuğu için işleme devam edilemiyor.`, { reply: true, ephemeral: true });
		});
	}
	else if(interaction instanceof Message)
	{
		if(!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
			return MessageEmbed(interaction, 'Red', 'Hata', 'Bu komutu kullanmak için yeterli yetkiniz bulunmuyor.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		if(args.length != 1) {
			return MessageEmbed(interaction, 'Blurple', 'Kullanım', `${Ayarlar.sunucu.prefix}unban [Kullanıcı ID]`, { reply: true });
		}

		const regex = /^\d+$/;

		if(!regex.test(args[0])) {
			return MessageEmbed(interaction, 'Red', 'Hata', 'Geçerli bir kullanıcı id girmediniz.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		}

		interaction.guild.bans.fetch().then(u => 
		{
			if(!u.has(args[0])) {
				return MessageEmbed(interaction, 'Red', 'Hata', 'Bu id de bir kullanıcı yasaklı değil.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			}

			interaction.guild.bans.remove(args[0]).then(() => 
			{
				Logger('Yeşil', `[${interaction.member.displayName} / ${interaction.member.user.tag}] adlı kullanıcı ${args[0]} id'li kullanıcının banını kaldırdı.`);
				
				MessageEmbed(interaction, 'Green', 'Bilgi', `<@${args[0]}> (${args[0]}) adlı kullanıcının sunucu yasağı kaldırıldı.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			
				Collection_Unban.insertOne({
					kaldiran_id: interaction.member.id,
					kaldiran_kullanici_adi: interaction.member.user.tag,
					kaldiran_sunucu_adi: interaction.member.displayName,
					tarih: Date.now(),
					kaldirilan_id: args[0]
				});
			})
			.catch(hata => 
			{
				Logger('Kırmızı', `[${interaction.member.displayName} / ${interaction.member.user.tag}] adlı kullanıcı ${args[0]} id'li kullanıcının banını kaldırırken bir hata oluştu: ${hata}`);
				MessageEmbed(interaction, 'Red', 'Hata', `${args[0]} id'li kullanıcının sunucu yasağı kaldırılırken bir hata oluştu.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			});
		})
		.catch(hata => {
			Logger('Kırmızı', `[${interaction.member.displayName} / ${interaction.member.user.tag}] adlı kullanıcı unban işlevini kullanırken bir hata gelişti: ${hata}`);
			MessageEmbed(interaction, 'Red', 'Hata', `Bir hata oluştuğu için işleme devam edilemiyor.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
		});
	}
}