/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		guild_member_remove.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		06.05.2024, 23:54:17
 */

import Logger from "../fonksiyonlar/logger.mjs";
import { Client, Events, GuildMember } from "discord.js";
import Kanallar from "../semalar/kanallar.mjs";
import { Collection_Kullanici } from "../fonksiyonlar/veritabani.mjs";

export const name = Events.GuildMemberRemove;
export const once = false;

/**
 * 
 * @param {GuildMember} member
 * @param {Client} _ 
 */
export async function execute(member, _)
{
	// Sunucuya çıkan kişi botsa alt işlemleri engelle
	if(member.user.bot) return;

	// Sunucudan çıkan kişinin bilgilerini kanala gönder
	if(Kanallar.cikis.length > 0)
	{
		const kanal = member.guild.channels.cache.get(Kanallar.cikis);
		if(kanal)
		{
			kanal.send(`${member} adlı kullanıcı sunucudan ayrıldı. Sunucuda toplam ${member.guild.memberCount} kişi kaldı.`);
		}
	}

	// Kullanıcının çıkış verilerini veritabanında güncelle
	Collection_Kullanici.findOneAndUpdate({ "sunucu.id": member.id }, 
	{
		$push:
		{
			"sunucu.cikis": 
			{
				discord_adi: member.user.tag,
				sunucu_adi: member.displayName, 
				tarih: Date.now()
			}
		}
	})
	.then(() => Logger('Yeşil', `${member.user.tag} adlı kullanıcının veritabanındaki çıkış verileri başarılı bir şekilde güncellendi.`))
	.catch(hata => Logger('Kırmızı', `${member.user.tag} adlı kullanıcının veritabanındaki çıkış verileri güncellenirken bir hata oluştu:`, hata));
}