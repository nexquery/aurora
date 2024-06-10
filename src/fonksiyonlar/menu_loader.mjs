/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		menu_yukleyici.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		26.04.2024, 15:30:54
 */

import { Client, Collection } from "discord.js";
import { readdirSync } from "node:fs";
import Logger from "./logger.mjs";

/** @param {Client} client */
export async function Menu_Loader(client)
{
	Logger('Yeşil', 'Menü etkileşimleri yükleniyor...');
	
	client.menuler = new Collection();

	const menu_dosyalari = readdirSync(`./src/menuler`).filter(m => m.endsWith(`.mjs`));
	for(const menu_dosyasi of menu_dosyalari)
	{
		const ctx = await import(`../menuler/${menu_dosyasi}`);
		if('customId' in ctx)
		{
			client.menuler.set(ctx.customId, ctx);
		}
	}

	Logger('Yeşil', 'Menü etkileşimleri yüklendi.');
}