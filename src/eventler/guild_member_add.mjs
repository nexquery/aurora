/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		guild_member_add.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		06.05.2024, 22:09:46
 */

import Logger from "../fonksiyonlar/logger.mjs";
import { Client, EmbedBuilder, Events, GuildMember } from "discord.js";
import { Collection_Kullanici } from "../fonksiyonlar/veritabani.mjs";
import Kullanici from "../semalar/kullanici.mjs";
import Roller from "../semalar/roller.mjs";
import Kanallar from "../semalar/kanallar.mjs";
import { GuvenlikKontrol, convertTime } from "../fonksiyonlar/timestamp.mjs";
import Ayarlar from "../semalar/ayarlar.mjs";

export const name = Events.GuildMemberAdd;
export const once = false;

/**
 * 
 * @param {GuildMember} member
 * @param {Client} _ 
 */
export async function execute(member, _)
{
	// Sunucuya katılan kişi botsa alt işlemleri engelle
	if(member.user.bot) return;
	
	// Kullanıcının verilerini güncelle
	await member.fetch(true);

	// Kullanıcıya kayıtsız rolünü ver
	if(Roller.kayitsiz.length > 0)
	{
		const r = member.guild.roles.cache.get(Roller.kayitsiz);
		if(r)
		{
			await member.roles.add(r.id).then(() => Logger('Yeşil', `${member.user.tag} adlı kullanıcıya kayıtsız rolü verildi.`))
			.catch(hata => Logger('Kırmızı', `${member.user.tag} adlı kullanıcıya kayıtsız rolü verilemedi: ${hata}`));
		}
	}

	// Kullanıcının adını değiştir
	const dName = member.displayName;
	member.setNickname(`${Ayarlar.sunucu.tag} İsim | Yaş`).then(() => Logger('Yeşil', `${member.user.tag} adlı kullanıcının adı isimsiz olarak değiştirildi.`))
	.catch(hata => Logger('Kırmızı', `${member.user.tag} adlı kullanıcının adı değiştirilemedi: ${hata}`));

	// Veritabanında kullanıcı verileri var mı ?
	Collection_Kullanici.findOne({ "sunucu.id": member.id }).then(veri => 
	{
		if(veri)
		{
			// Eğer daha önceden sunucuya giriş yaptıysa, yeni bir veri daha ekle	
			Collection_Kullanici.updateOne({ "sunucu.id": member.id },
			{
				$push:
				{
					"sunucu.giris":
					{
						discord_adi: member.user.tag,
						sunucu_adi: dName, 
						tarih: Date.now()
					}
				}
			})
			.then(() => Logger('Yeşil', 'Kullanıcının veritabanındaki giriş verileri güncellendi.'))
			.catch(hata => Logger('Yeşil', 'Kullanıcının veritabanındaki giriş verileri güncellenirken bir hata oluştu:', hata));
		}
		else
		{
			// Kullanici verilerini boş bir şekilde klonla
			const data = structuredClone(Kullanici);

			// Verileri yapılandır
			data.sunucu.id = member.id;
			data.sunucu.hesap_olusturma = member.user.createdTimestamp;
			data.sunucu.giris.push(
			{
				discord_adi: member.user.tag,
				sunucu_adi: dName, 
				tarih: Date.now()
			});

			// Veriyi kaydet
			Collection_Kullanici.insertOne(data).then(() => Logger('Yeşil', 'Veritabanına yeni bir kullanıcı eklendi:', member.user.tag))
			.catch(hata => Logger('Kırmızı', 'Veritabanına yeni bir kullanıcı eklenirken bir hata oluştu:', hata));
		}
	});

	// Giriş kanalına mesaj gönder
	if(Kanallar.giris.length > 0)
	{
		const kanal = member.guild.channels.cache.get(Kanallar.giris);
		if(kanal)
		{
			kanal.send(`${member} adlı kullanıcı sunucuya giriş yaptı. Sunucuda toplam ${member.guild.memberCount} üye oldu.`);
		}
	}

	// Kayıt kanalına mesaj gönder
	if(Kanallar.kayit.length > 0)
	{
		const kanal = member.guild.channels.cache.get(Kanallar.kayit);
		if(kanal)
		{
			kanal.send({ content: `Yeni bir kullanıcı aramıza katıldı <@&${Roller.kayit_sorumlusu}> ${member}`,
			embeds: [
				new EmbedBuilder()
				.setColor('#cd84f1')
				.setTitle('AURORA Sunucusuna Hoş Geldiniz')
				.setDescription(`Sunucumuza hoş geldin ${member} kayıt olmak için ses teyit kanallarından birine girebilirsin.\n\u200b`)
				.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 256 }))
				.setTimestamp()
				.addFields(
					{ name: 'Seninle Birlikte', value: `${member.guild.memberCount} Kişi Olduk`, inline: true },
					{ name: 'Hesabını Oluşturdun', value: convertTime(member.user.createdTimestamp), inline: true },
					{ name: 'Güvenlik Durumu', value: `${GuvenlikKontrol(member.user.createdTimestamp, 30)}\n\u200b`, inline: true }
				)
			]});
		}
	}
}