/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		logger.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		06.05.2024, 21:04:44
 */

import { existsSync, appendFileSync } from "node:fs";
import moment from "moment-timezone";

// Logger Ayarları
let   log_Baslangic		= false;
const log_Konsol		= true;
const log_KonsolRenk	= true;
const log_Dosyasi		= "./src/log.txt";

// Renk Paleti  ::  \x1b[0m
const Renk = 
[
	{ renk: "Kırmızı",	deger: "\x1b[31m" },
	{ renk: "Yeşil",	deger: "\x1b[32m" },
	{ renk: "Sarı",		deger: "\x1b[33m" },
	{ renk: "Mavi",		deger: "\x1b[34m" },
	{ renk: "Magenta",	deger: "\x1b[35m" },
	{ renk: "Cyan",		deger: "\x1b[36m" },
	{ renk: "Beyaz",	deger: "\x1b[37m" },
];

/** @typedef {('Kırmızı'|'Yeşil'|'Sarı'|'Mavi'|'Magenta'|'Cyan'|'Beyaz')} Renk */
/**
 *	Logger kullanımı:
 *		Logger('Kırmızı', 'İçerik', argumanlar...);
 *
 *	@param {Renk} renk
 *	@param {...any} icerik
 */
export default function Logger(renk, ...icerik)
{
	// Botun ilk açılışında log dosyası yoksa başlangıcı true olarak ayarla 
	if(log_Baslangic === false && !existsSync(log_Dosyasi)) {
		log_Baslangic = true;
	}

	// Eğer botun ilk açıldığında log dosyası varsa yeni bir boş satır ekle (önceki verilerle karışmaması için)
	if(log_Baslangic === false && existsSync(log_Dosyasi)) {
		log_Baslangic = true;
		appendFileSync(log_Dosyasi, '\n', { encoding: 'utf-8' });	
	}

	// Dosya ve satır numarasını al
	let dosya = new Error().stack.split('\n')[2].trim();
	dosya = dosya.substring(dosya.lastIndexOf('/') + 1, dosya.length);
	dosya = dosya.substring(0, dosya.lastIndexOf(':'));

	// İçeriği log dosyasına yaz
	const tarih = moment().tz('Europe/Istanbul').format('DD.MM.YYYY, HH:mm:ss');
    appendFileSync(log_Dosyasi, `[${tarih}] [${dosya}]: ${icerik.join(' ') + '\n'}`, { encoding: 'utf-8' });
	
	// Konsola yazdır
	if(log_Konsol === true)
	{
		if(log_KonsolRenk === true)
		{
			const r = Renk.find(m => m.renk === renk);
			if(r)
			{
				console.log(`${r.deger} [${tarih}] [${dosya}]:`, ...icerik, '\x1b[0m');
			}
			else
			{
				console.log(`\x1b[31mGeçersiz Renk: ${renk}\x1b[0m`);
				console.log(`[${tarih}] [${dosya}]:`, ...icerik);
			}
		}
		else
		{
			console.log(`[${tarih}] [${dosya}]:`, ...icerik);
		}
	}
}