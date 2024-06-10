/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		message_create.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		07.05.2024, 12:55:17
 */

import { Client, Message, Events } from "discord.js";
import Ayarlar from "../semalar/ayarlar.mjs";
import callcmd from "../fonksiyonlar/callcmd.mjs";
import { Regex_URL, Regex_TekrarKontrol, Regex_BosMesaj, Regex_CapsLock, Regex_AntiKufur } from "../fonksiyonlar/regex.mjs";

export const name = Events.MessageCreate;
export const once = false;

/**
 * 
 * @param {Message} message
 * @param {Client} client
 */

export async function execute(message, client)
{
	// Silinen mesaj bot tarafından ise alt komutları çalıştırma
	if(message.member.user.bot) return;

	// Prefix komutlarını kontol et
	if(message.content.startsWith(Ayarlar.sunucu.prefix))
	{
		const args = message.content.slice(Ayarlar.sunucu.prefix).trim().split(/ +/);
		const cmd  = args.shift().toLowerCase().slice(1);
		return callcmd(client, message, cmd, args);
	}

	// URL Mesajlarını kontrol et
	if(message.guild.ownerId !== message.member.id && Regex_URL(message.content))
	{
		return message.delete();
	}

	// Kendini tekrar eden mesajları sil
	if(Regex_TekrarKontrol(message.content))
	{
		return message.delete();
	}

	// Boş mesaj varsa sil
	if(Regex_BosMesaj(message.content))
	{
		return message.delete();
	}

	// Tüm mesajlar capslock ise sil
	if(Regex_CapsLock(message.content))
	{
		return message.delete();
	}

	// Küfür içeren mesajları engelle
	if(Regex_AntiKufur(message.content))
	{
		return message.delete();
	}

	/*
	if(message.content === 'ver')
	{
		message.member.roles.add("1225814222353596476").then(() => message.reply('Verildi +')).catch(() => message.reply('Verilmedi -'));
	}

	if(message.content === 'sil')
	{
		message.member.roles.remove("1225814222353596476").then(() => message.reply('Silindi +')).catch(() => message.reply('Silinmedi -'));
	}
	*/
}