/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		snipe.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		12.05.2024, 13:32:28
 */

import { Message } from "discord.js";
import { CSnipe } from "./veritabani.mjs";

export const MAX_SNIPE = 5;
const SnipeArray = [];

/** @param {Message} message */
export function Snipe_Ekle(message)
{
	if (message.member == null) return;

	if(SnipeArray.length >= MAX_SNIPE)
	{
		// Küçükten büyüğe sıralama
		SnipeArray.sort((a, b) => a.mesaj_tarihi - b.mesaj_tarihi);
		
		SnipeArray[0].mesaj_silen = message.member.id;
		SnipeArray[0].mesaj_icerigi = message.content;
		SnipeArray[0].mesaj_tarihi = Date.now();

		CSnipe.findOneAndUpdate({ _id: SnipeArray[0]._id },
		{
			$set:
			{
				mesaj_silen:		SnipeArray[0].mesaj_silen,
				mesaj_icerigi:		SnipeArray[0].mesaj_icerigi,
				mesaj_tarihi:		SnipeArray[0].mesaj_tarihi
			}
		});
	}
	else
	{
		CSnipe.insertOne({ mesaj_silen: message.member.id, mesaj_icerigi: message.content, mesaj_tarihi: Date.now()}).then(p => 
		{
			SnipeArray.push({ _id: p.insertedId, mesaj_silen: message.member.id, mesaj_icerigi: message.content, mesaj_tarihi: Date.now() });
		});
	}
}

export function Snipe_Getir()
{
	const arr = [];
	// Büyükten küçüğe sıralma
	SnipeArray.sort((a, b) => b.mesaj_tarihi - a.mesaj_tarihi);
	for(let i = 0; i < SnipeArray.length; i++)
	{
		arr.push(SnipeArray[i]);
	}
	return arr;
}

export function Snipe_Yukle(veri)
{
	SnipeArray.push(veri);
}