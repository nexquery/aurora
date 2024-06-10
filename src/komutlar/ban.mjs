/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		ban.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		10.05.2024, 10:50:40
 */

import { Client, Message, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, GuildMember, User } from "discord.js";
import { InteractionEmbed, MessageEmbed } from "../fonksiyonlar/embed.mjs";
import Ayarlar from "../semalar/ayarlar.mjs";
import Logger from "../fonksiyonlar/logger.mjs";
import { Collection_Ban, Collection_Kullanici } from "../fonksiyonlar/veritabani.mjs";

export const alias = [
	"ban"
];

export const data = [
	new SlashCommandBuilder().setName(alias[0]).setDescription('Bir kullanıcıyı sunucudan yasaklar.')
	.addUserOption(m => m.setName('kullanıcı').setDescription('Sunucudan yasaklanacak kullanıcı.').setRequired(true))
	.addStringOption(m => m.setName('sebep').setDescription('Kullanıcının yasaklanma sebebi.').setRequired(false))
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
		const user		= interaction.options.getUser('kullanıcı');
		const sebep		= interaction.options.getString('sebep');
		const kullanici	= interaction.guild.members.cache.get(user.id);

		if(!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
			return InteractionEmbed(interaction, 'Red', 'Hata', 'Bu komutu kullanmak için yeterli yetkiniz bulunmuyor.', { ephemeral: true });
		}

		if(!user) {
			return InteractionEmbed(interaction, 'Red', 'Hata', 'Geçerli bir kullanıcı etiketlemediniz.', { ephemeral: true });
		}

		if(kullanici.id == interaction.member.id) {
			return InteractionEmbed(interaction, 'Red', 'Hata', 'Kendini sunucudan yasaklayamazsın.', { ephemeral: true });
		}

		if(kullanici.user.bot) {
			return InteractionEmbed(interaction, 'Red', 'Hata', 'Botları sunucudan yasaklayamazsın.', { ephemeral: true });
		}

		if(!kullanici.bannable) {
			return InteractionEmbed(interaction, 'Red', 'Hata', 'Bu kullanıcıyı sunucudan yasaklayamazsın.', { ephemeral: true });
		}

		kullanici.ban({ reason: (!sebep) ? undefined : sebep, deleteMessageSeconds: 0 }).then(() => 
		{
			Ban_Log(interaction, kullanici, sebep);

			Logger('Yeşil', (!sebep) ? 
			`[${interaction.member.displayName} / ${interaction.member.user.tag}] tarafından [${kullanici.displayName} / ${kullanici.user.tag}] adlı kullanıcı sunucudan yasaklandı.` : 
			`[${interaction.member.displayName} / ${interaction.member.user.tag}] tarafından [${kullanici.displayName} / ${kullanici.user.tag}] adlı kullanıcı ${sebep} sebebi ile sunucudan yasaklandı.`);
			
			interaction.reply({ embeds: [new EmbedBuilder().setColor('#ff7f50').setTitle('Ban').setTimestamp().setDescription((!sebep) ? 
				`${interaction.member} tarafından ${kullanici} adlı kullanıcı sunucudan yasaklandı.` : 
				`${interaction.member} tarafından ${kullanici} adlı kullanıcı **${sebep}** sebebi ile sunucudan yasaklandı.`)
			]});
		})
		.catch(hata => {
			Logger('Kırmızı', `${kullanici.user.tag} adlı kullanıcı sunucudan yasaklanırken bir hata oluştu: ${hata}`);
			interaction.reply({ content: 'Kullanıcı sunucudan yasaklanırken bir hata oluştu.', ephemeral: true })
		});
	}
	else if(interaction instanceof Message)
	{
		const message = interaction;

		const kullanici = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		const sebep = args.slice(1).join(' ');

		if(!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
			return MessageEmbed(message, 'Red', 'Hata', 'Bu komutu kullanmak için yeterli yetkiniz bulunmuyor.', { reply: true, uyeSil: true, botSil: true, sure: 2700 });
		}

		if(args.length < 1) {
			return MessageEmbed(message, 'Blurple', 'Kullanım', `${Ayarlar.sunucu.prefix}ban [@Kullanıcı veya ID] [İsteğe Bağlı Sebep]`, { reply: true });
		}

		if(kullanici && kullanici.id == message.member.id) {
			return MessageEmbed(message, 'Red', 'Hata', 'Kendini sunucudan yasaklayamazsın.', { reply: true, uyeSil: true, botSil: true, sure: 2700 });
		}

		if(kullanici && kullanici.user.bot) {
			return MessageEmbed(message, 'Red', 'Hata', 'Botları sunucudan yasaklayamazsın.', { reply: true, uyeSil: true, botSil: true, sure: 2700 });
		}

		if(kullanici && !kullanici.bannable) {
			return MessageEmbed(message, 'Red', 'Hata', 'Bu kullanıcıyı sunucudan yasaklayamazsın.', { reply: true, uyeSil: true, botSil: true, sure: 2700 });
		}

		if(kullanici)
		{
			kullanici.ban({ reason: (!sebep) ? undefined : sebep, deleteMessageSeconds: 0 }).then(() => 
			{
				Ban_Log(message, kullanici, sebep);
	
				Logger('Yeşil', (!sebep) ? 
				`[${message.member.displayName} / ${message.member.user.tag}] tarafından [${kullanici.displayName} / ${kullanici.user.tag}] adlı kullanıcı sunucudan yasaklandı.` : 
				`[${message.member.displayName} / ${message.member.user.tag}] tarafından [${kullanici.displayName} / ${kullanici.user.tag}] adlı kullanıcı ${sebep} sebebi ile sunucudan yasaklandı.`);
				
				message.channel.send({ embeds: [new EmbedBuilder().setColor('#ff7f50').setTitle('Ban').setTimestamp().setDescription((!sebep) ? 
					`${message.member} tarafından ${kullanici} adlı kullanıcı sunucudan yasaklandı.` : 
					`${message.member} tarafından ${kullanici} adlı kullanıcı **${sebep}** sebebi ile sunucudan yasaklandı.`)
				]});
			})
			.catch(hata => {
				Logger('Kırmızı', `${kullanici.user.tag} adlı kullanıcı sunucudan yasaklanırken bir hata oluştu: ${hata}`);
				message.reply('Kullanıcı sunucudan yasaklanırken bir hata oluştu.');
			});
		}
		else
		{
			message.guild.bans.fetch().then(p => 
			{
				if(p.has(args[0])) {
					return MessageEmbed(message, 'Red', 'Hata', 'Bu kullanıcı zaten sunucudan yasaklı.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
				}

				client.users.fetch(args[0]).then(p =>
				{
					if(p.id == message.member.id) {
						return MessageEmbed(message, 'Red', 'Hata', 'Kendini sunucudan yasaklayamazsın.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
					}
			
					if(p.bot) {
						return MessageEmbed(message, 'Red', 'Hata', 'Botları sunucudan yasaklayamazsın.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
					}
	
					Offline_Ban(message, p, sebep);
	
					Logger('Yeşil', (!sebep) ? 
					`[${message.member.displayName} / ${message.member.user.tag}] tarafından [${p.displayName} / ${p.tag}] adlı kullanıcı sunucudan yasaklandı.` : 
					`[${message.member.displayName} / ${message.member.user.tag}] tarafından [${p.displayName} / ${p.tag}] adlı kullanıcı ${sebep} sebebi ile sunucudan yasaklandı.`);
				
					message.guild.bans.create(args[0], { deleteMessageSeconds:0, reason: (!sebep) ? undefined : sebep }).then(() =>
					{
						message.channel.send({ embeds: [new EmbedBuilder().setColor('#ff7f50').setTitle('Offline Ban').setTimestamp().setDescription((!sebep) ? 
							`${message.member} tarafından ${p} adlı kullanıcı sunucudan yasaklandı.` : 
							`${message.member} tarafından ${p} adlı kullanıcı **${sebep}** sebebi ile sunucudan yasaklandı.`)
						]});
					})
					.catch(hata => 
					{
						Logger('Kırmızı', `[${message.member.displayName} / ${message.member.user.tag}] adlı kullanıcı offline ban atarken bir hata oluştu: ${hata}`);
						MessageEmbed(message, 'Red', 'Hata', 'Kullanıcı yasaklanırken bir hata oluştu.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
					});
				})
				.catch(hata => 
				{
					Logger('Kırmızı', `[${message.member.displayName} / ${message.member.user.tag}] adlı kullanıcı offline ban girişiminde bulunurken bir hata oluştu: ${hata}`);
					return MessageEmbed(message, 'Red', 'Hata', 'Girdiğiniz id geçerli değil.', { reply: true, uyeSil: true, botSil: true, sure: 3000 });
				});
			})
			.catch(hata => Logger('Kırmızı', `Güncel ban listesi çekilirken bir hata oluştu: ${hata}`));
		}
	}
}

/**
 * 
 * @param {CommandInteraction | Message} tur
 * @param {GuildMember} kullanici
 * @param {String} sebep
 */

function Ban_Log(tur, kullanici, sebep)
{
	// Ban koleksiyonuna kaydet
	Collection_Ban.insertOne(
	{
		banlayan_id:			tur.member.id,
		banlayan_discord_adi:	tur.member.user.tag,
		banlayan_sunucu_adi:	tur.member.displayName,

		banlanan_id:			kullanici.id,
		banlanan_discord_adi:	kullanici.user.tag,
		banlanan_sunucu_adi:	kullanici.displayName,

		tarih:					Date.now(),
		sebep:					(!sebep) ? 'Belirtilmedi' : sebep
	});

	// Kullanıcının ban verisini kaydet
	Collection_Kullanici.findOneAndUpdate({ "sunucu.id": kullanici.id },
	{
		$push:
		{
			"loglar.ban":
			{ 
				banlayan_id:			tur.member.id,
				banlayan_discord_adi:	tur.member.user.tag,
				banlayan_sunucu_adi:	tur.member.displayName,
				tarih:					Date.now(),
				sebep:					(!sebep) ? 'Belirtilmedi' : sebep
			}
		}
	});
}

/**
 * 
 * @param {Message} message
 * @param {User} kullanici
 */

function Offline_Ban(message, kullanici, sebep)
{
	// Ban koleksiyonuna kaydet
	Collection_Ban.insertOne(
	{
		banlayan_id:			message.member.id,
		banlayan_discord_adi:	message.member.user.tag,
		banlayan_sunucu_adi:	message.member.displayName,

		banlanan_id:			kullanici.id,
		banlanan_discord_adi:	kullanici.tag,
		banlanan_sunucu_adi:	kullanici.displayName,

		tarih:					Date.now(),
		sebep:					(!sebep) ? 'Belirtilmedi' : sebep
	});

	// Kullanıcının ban verisini kaydet
	Collection_Kullanici.findOneAndUpdate({ "sunucu.id": kullanici.id },
	{
		$push:
		{
			"loglar.ban":
			{ 
				banlayan_id:			message.member.id,
				banlayan_discord_adi:	message.member.user.tag,
				banlayan_sunucu_adi:	message.member.displayName,
				tarih:					Date.now(),
				sebep:					(!sebep) ? 'Belirtilmedi' : sebep
			}
		}
	});
}