/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		aurora.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		07.05.2024, 19:13:08
 */

import Ayarlar from "../semalar/ayarlar.mjs";
import Roller from "../semalar/roller.mjs";
import Kanallar from "../semalar/kanallar.mjs";
import { Client, Message, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Collection_Ayarlar, Collection_Kanallar } from "../fonksiyonlar/veritabani.mjs";
import { MessageEmbed } from "../fonksiyonlar/embed.mjs";

export const alias = [
	"aurora"
];

const prefix = Ayarlar.sunucu.prefix;

const AURORA_CMD = 
[
	{
		komut:		"prefix",
		args:		[2, 2],
		kullanim:	`${prefix}aurora [prefix] [yeni prefix]`,
		funcs:		async (message, args) => 
		{
			Collection_Ayarlar.findOneAndUpdate({ _id: Ayarlar._id }, { $set: { "sunucu.prefix": args[1] } }).then(() => 
			{
				Ayarlar.sunucu.prefix = args[1];
				MessageEmbed(message, 'Green', null, `✅ Sunucunun komut prefixi ${args[1]} olarak ayarlandı.`, { reply: true, uyeSil: false, botSil: false, sure: 2700 })
			})
			.catch(() => MessageEmbed(message, 'Red', null, `Sunucunun komut prefixi değiştirilirken bir hata oluştu.`, { reply: true, uyeSil: true, botSil: true, sure: 2700 }));
		}
	},
	{
		komut:		"tag",
		args:		[2, 2],
		kullanim:	`${prefix}aurora [tag] [yeni tag]`,
		funcs:		async (message, args) => 
		{
			Collection_Ayarlar.findOneAndUpdate({ _id: Ayarlar._id }, { $set: { "sunucu.tag": args[1] } }).then(() => 
			{
				Ayarlar.sunucu.tag = args[1];
				MessageEmbed(message, 'Green', null, `✅ Sunucunun tagı ${args[1]} olarak ayarlandı.`, { reply: true, uyeSil: false, botSil: false, sure: 2700 })
			})
			.catch(() => MessageEmbed(message, 'Red', null, `Sunucunun tagı değiştirilirken bir hata oluştu.`, { reply: true, uyeSil: true, botSil: true, sure: 2700 }));
		}
	},
	{
		komut:		"kanal-giris",
		args:		[2, 2],
		kullanim:	`${prefix}aurora [kanal-giris] [#giriş kanalı]`,
		funcs:		async (message, args) => 
		{
			const kanal = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
			
			if(!kanal) {
				return MessageEmbed(message, 'Red', null, `Geçerli bir kanal girmediniz.`, { reply: true, uyeSil: true, botSil: true, sure: 2700 })
			}

			Collection_Kanallar.findOneAndUpdate({ _id: Kanallar._id }, { $set: { "giris": kanal.id } }).then(() => 
			{
				Kanallar.giris = kanal.id;
				MessageEmbed(message, 'Green', null, `✅ Sunucunun giriş log kanalı ${kanal} olarak ayarlandı.`, { reply: true, uyeSil: false, botSil: false, sure: 2700 })
			})
			.catch(() => MessageEmbed(message, 'Red', null, `Sunucunun giriş log kanalı değiştirilirken bir hata oluştu.`, { reply: true, uyeSil: true, botSil: true, sure: 2700 }));
		}
	},
	{
		komut:		"kanal-cikis",
		args:		[2, 2],
		kullanim:	`${prefix}aurora [kanal-cikis] [#çıkış kanalı]`,
		funcs:		async (message, args) => 
		{
			const kanal = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
			
			if(!kanal) {
				return MessageEmbed(message, 'Red', null, `Geçerli bir kanal girmediniz.`, { reply: true, uyeSil: true, botSil: true, sure: 2700 })
			}

			Collection_Kanallar.findOneAndUpdate({ _id: Kanallar._id }, { $set: { "cikis": kanal.id } }).then(() => 
			{
				Kanallar.cikis = kanal.id;
				MessageEmbed(message, 'Green', null, `✅ Sunucunun çıkış log kanalı ${kanal} olarak ayarlandı.`, { reply: true, uyeSil: false, botSil: false, sure: 2700 })
			})
			.catch(() => MessageEmbed(message, 'Red', null, `Sunucunun çıkış log kanalı değiştirilirken bir hata oluştu.`, { reply: true, uyeSil: true, botSil: true, sure: 2700 }));
		}
	},
	{
		komut:		"kanal-kayit",
		args:		[2, 2],
		kullanim:	`${prefix}aurora [kanal-kayit] [#kayıt kanalı]`,
		funcs:		async (message, args) => 
		{
			const kanal = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
			
			if(!kanal) {
				return MessageEmbed(message, 'Red', null, `❌ Geçerli bir kanal girmediniz.`, { reply: true, uyeSil: true, botSil: true, sure: 2700 })
			}

			Collection_Kanallar.findOneAndUpdate({ _id: Kanallar._id }, { $set: { "kayit": kanal.id } }).then(() => 
			{
				Kanallar.kayit = kanal.id;
				MessageEmbed(message, 'Green', null, `✅ Sunucunun kayıt kanalı ${kanal} olarak ayarlandı.`, { reply: true, uyeSil: false, botSil: false, sure: 2700 })
			})
			.catch(() => MessageEmbed(message, 'Red', null, `Sunucunun kayıt kanalı değiştirilirken bir hata oluştu.`, { reply: true, uyeSil: true, botSil: true, sure: 2700 }));
		}
	},
	{
		komut:		"kanal-sohbet",
		args:		[2, 2],
		kullanim:	`${prefix}aurora [kanal-sohbet] [#sohbet kanalı]`,
		funcs:		async (message, args) => 
		{
			const kanal = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
			
			if(!kanal) {
				return MessageEmbed(message, 'Red', null, `❌ Geçerli bir kanal girmediniz.`, { reply: true, uyeSil: true, botSil: true, sure: 2700 })
			}

			Collection_Kanallar.findOneAndUpdate({ _id: Kanallar._id }, { $set: { "sohbet": kanal.id } }).then(() => 
			{
				Kanallar.sohbet = kanal.id;
				MessageEmbed(message, 'Green', null, `✅ Sunucunun sohbet kanalı ${kanal} olarak ayarlandı.`, { reply: true, uyeSil: false, botSil: false, sure: 2700 })
			})
			.catch(() => MessageEmbed(message, 'Red', null, `Sunucunun sohbet kanalı değiştirilirken bir hata oluştu.`, { reply: true, uyeSil: true, botSil: true, sure: 2700 }));
		}
	},
]

/**
 * @param {Client} _
 * @param {Message} message
 * @param {String} cmd
 * @param {String[]} args
 */

export async function execute(_, message, cmd, args)
{
	// Yetkiyi kontrol et
	if(!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
		return MessageEmbed(message, 'Red', null, 'Bu komutu sadece sunucu sahipleri kullanabilir.', { reply: true, uyeSil: true, botSil: true, sure: 2700 });
	}

	// Komutları ara
	if(args.length != 0)
	{
		for(const cmd of AURORA_CMD)
		{
			if(cmd.komut === args[0] && cmd.args[0] === cmd.args[1])
			{
				if(cmd.args[0] !== args.length) {
					return MessageEmbed(message, 'Blurple', 'Kullanım', cmd.kullanim, { reply: true, uyeSil: false, botSil: false, sure: 2700 });
				}
				return cmd.funcs(message, args);
			}
		}
	}
}