/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		client_ready.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		06.05.2024, 21:02:29
 */

import { Client, Events } from "discord.js";
import Logger from "../fonksiyonlar/logger.mjs";

export const name = Events.ClientReady;
export const once = true;

/** @param { Client } client */
export async function execute(client)
{
	Logger('Yeşil', `Bot Başlatıldı: ${client.user.tag}`);
}