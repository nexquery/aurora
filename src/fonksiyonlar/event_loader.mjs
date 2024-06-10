/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		event_loader.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		06.05.2024, 21:03:18
 */

import { Client } from "discord.js";
import { readdirSync } from "node:fs";
import Logger from "./logger.mjs";

/** @param { Client } client */
export default async function Event_Loader(client)
{
	Logger('Yeşil', "Eventler yükleniyor...");
	const event_dosyalari = readdirSync(`./src/eventler`).filter(m => m.endsWith(`.mjs`) || m.endsWith(`.ts`));
	for(const event_dosyasi of event_dosyalari)
	{
		const event = await import(`../eventler/${event_dosyasi}`);
		if(event.once)
		{
			client.once(event.name, (...args) => event.execute(...args, client));
		}
		else
		{
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	}
	Logger('Yeşil', "Eventler yüklendi.");
}