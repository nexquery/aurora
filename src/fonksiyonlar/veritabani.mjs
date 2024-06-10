/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		veritabani.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		06.05.2024, 21:18:38
 */

import "dotenv/config";
import { MongoClient } from "mongodb";
import Logger from "./logger.mjs";
import Ayarlar from "../semalar/ayarlar.mjs";
import Roller from "../semalar/roller.mjs";
import Kanallar from "../semalar/kanallar.mjs";
import { Snipe_Yukle } from "./snipe.mjs";

// Veritaban bağlantısını yapılandır
const MClient = new MongoClient(process.env.DATABASE_URL);

// Collectionlar
export const Collection_Ayarlar = MClient.db(process.env.DATABASE).collection('ayarlar');
export const Collection_Kullanici = MClient.db(process.env.DATABASE).collection('kullanicilar');
export const Collection_Roller = MClient.db(process.env.DATABASE).collection('roller');
export const Collection_Kanallar = MClient.db(process.env.DATABASE).collection('kanallar');
export const Collection_Ban = MClient.db(process.env.DATABASE).collection('ban');
export const Collection_Unban = MClient.db(process.env.DATABASE).collection('unban');
export const CKick = MClient.db(process.env.DATABASE).collection('kick');
export const CSnipe = MClient.db(process.env.DATABASE).collection('snipe');
export const CJail = MClient.db(process.env.DATABASE).collection('jail');

// Veritaban bağlantısını kurar
export async function Veritabani_Baglan()
{
	await MClient.connect().then(() => Logger('Yeşil', "Veritaban bağlantısı başarılı bir şekilde kuruldu."))
	.catch(hata => Logger('Kırmızı', "Veritaban bağlantısı kurulurken bir hata oluştu:", hata));
}

// Sunucunun ayarlarını yükler
export async function Veritabani_Ayarlar()
{
	Logger('Yeşil', "Sunucu ayarları yükleniyor...");
	await Collection_Ayarlar.findOne({}).then(veri =>
	{
		if(veri)
		{
			Object.assign(Ayarlar, veri);
			Logger('Yeşil', 'Sunucu ayarları yüklendi.');
		}
		else
		{
			Collection_Ayarlar.insertOne(Ayarlar).then(p => Ayarlar._id = p.insertedId);
			Logger('Yeşil', 'Sunucu ayarları varsayılan olarak yüklendi.');
		}
	})
	.catch(hata => Logger('Kırmızı', "Sunucu ayarları yüklenirken bir hata oluştu:", hata));
}

// Sunucunun rollerini yükler
export async function Veritabani_Roller()
{
	Logger('Yeşil', "Sunucu rolleri yükleniyor...");
	await Collection_Roller.findOne({}).then(veri =>
	{
		if(veri)
		{
			Object.assign(Roller, veri);
			Logger('Yeşil', 'Sunucu rolleri yüklendi.');
		}
		else
		{
			Collection_Roller.insertOne(Roller).then(p => Roller._id = p.insertedId);
			Logger('Yeşil', 'Sunucu rolleri varsayılan olarak yüklendi.');
		}
	})
	.catch(hata => Logger('Kırmızı', "Sunucu rolleri yüklenirken bir hata oluştu:", hata));
}

// Sunucunun kanallarını yükler
export async function Veritabani_Kanallar()
{
	Logger('Yeşil', "Sunucu kanalları yükleniyor...");
	await Collection_Kanallar.findOne({}).then(veri =>
	{
		if(veri)
		{
			Object.assign(Kanallar, veri);
			Logger('Yeşil', 'Sunucu kanalları yüklendi.');
		}
		else
		{
			Collection_Kanallar.insertOne(Kanallar).then(p => Kanallar._id = p.insertedId);
			Logger('Yeşil', 'Sunucu kanalları varsayılan yüklendi.');
		}
	})
	.catch(hata => Logger('Kırmızı', "Sunucu kanalları yüklenirken bir hata oluştu:", hata));
}

// Sunucunun silinen mesajlarını yükler
export async function Veritabani_Snipe()
{
	Logger('Yeşil', "Snipe verileri yükleniyor...");
	const veri = await CSnipe.find({}).toArray();
	for(const data of veri)
	{
		Snipe_Yukle(data);
	}
	Logger('Yeşil', "Snipe verileri yüklendi.");
}