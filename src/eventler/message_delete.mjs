/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		message_delete.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		12.05.2024, 13:31:25
 */

import { Client, Message, Events } from "discord.js";
import { Snipe_Ekle } from "../fonksiyonlar/snipe.mjs";

export const name = Events.MessageDelete;
export const once = false;

/**
 * 
 * @param {Message} message
 * @param {Client} client
 */

export async function execute(message, client)
{
	// message.author && !message.author.bot  ::  Bu mesajı bir kullanıcı sildi
	// message.author && message.author.bot   ::  Bu mesajı bot sildi

	// Silinen mesaj bot tarafından ise alt komutları çalıştırma
	if(message.author && message.author.bot) return;

	// Snipe verilerini kaydet
	Snipe_Ekle(message);
}