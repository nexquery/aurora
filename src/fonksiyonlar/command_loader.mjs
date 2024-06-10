/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		command_loader.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		07.05.2024, 12:33:08
 */

import "dotenv/config";
import { readdirSync } from "node:fs";
import Logger from "../fonksiyonlar/logger.mjs"
import { Client, REST, Routes, Collection } from "discord.js";

// Gerekli değişkenler
let	fake_index	= 0;
const Komutlar	= [];
const Rest		= new REST({ version: '10' }).setToken(process.env.TOKEN);

/**
 * Komutları yükle
 * 
 * @param {Client} client
 */
export default async function Komut_Yukle(client)
{
	// Log bilgi
	Logger('Yeşil', "Slash komutları yükleniyor...");

	// Client yapısına komutlar adında bir collection oluştur
	client.komutlar = new Collection();

	// Komutlar klasöründeki tüm dosyaları çek
	const komut_dosyalari = readdirSync(`./src/komutlar`).filter(m => m.endsWith(`.mjs`));
	for(const komut_dosyasi of komut_dosyalari)
	{
		// ctx değişkenine komutlar klasöründeki tüm export ifadeli verileri import et
		const ctx = await import(`../komutlar/${komut_dosyasi}`);
		
		// Eğer data verisi bulunuyorsa verileri json yapısına dönüştür
		// if('data' in ctx && 'execute' in ctx)
		if('data' in ctx)
		{
			for(const data of ctx.data)
			{
				const json_data = data.toJSON();

				Komutlar.push(json_data);

				client.komutlar.set(json_data.name, ctx);
			}
		}
		else
		{
			// Eğer data yoksa fake bir komut oluştur
			const fake_komut = `fakecmd_${fake_index}`;
			fake_index++;
			client.komutlar.set(fake_komut, ctx);
		}
	}

	// Yüklenen komutları discord apisine gönder
	if(Komutlar.length > 0)
	{
		try
		{
			await Rest.put(Routes.applicationCommands(process.env.APP_ID), { body: Komutlar });
			Logger('Yeşil', "Slash komutları yüklendi.");
		}
		catch(hata)
		{
			Logger('Kırmızı', "Slash komutları yüklenirken bir hata oluştu:", hata);
		}
	}
	else
	{
		Logger('Sarı', "Yüklenecek slash komutları bulunmuyor.");
	}
}