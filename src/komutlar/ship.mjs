/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		ship.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		12.05.2024, 13:25:50
 */

import { Client, Message, GuildMember, AttachmentBuilder } from "discord.js";
import { Discord_RandomUser } from "../fonksiyonlar/discord.mjs";
import { createCanvas, loadImage } from 'canvas';
import Kanallar from "../semalar/kanallar.mjs";
import { InteractionEmbed, MessageEmbed } from "../fonksiyonlar/embed.mjs";

export const alias = [
	"ship"
];

/**
 * @param {Client} client
 * @param {Message} interaction
 * @param {String} cmd
 * @param {String[]} args
 */

export async function execute(client, interaction, cmd, args)
{
	if(interaction instanceof Message)
	{
		if(args.length === 0)
		{
			if(interaction.channel.id !== Kanallar.ship) {
				return MessageEmbed(interaction, 'Red', 'Hata', `Bu komutu sadece <#${Kanallar.ship}> kanalında kullanabilirsin.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			}

			const kullanici = Discord_RandomUser(interaction);
			Funcs_Ship(interaction, interaction.member, kullanici);
			return;
		}
		else if(args.length === 1)
		{
			if(interaction.channel.id !== Kanallar.ship) {
				return MessageEmbed(interaction, 'Red', 'Hata', `Bu komutu sadece <#${Kanallar.ship}> kanalında kullanabilirsin.`, { reply: true, uyeSil: true, botSil: true, sure: 3000 });
			}

			const kullanici = interaction.mentions.members.first() || interaction.guild.members.cache.get(args[0]);
			Funcs_Ship(interaction, interaction.member, kullanici);
			return;
		}
	}
}

/**
 * @param {Message} interaction
 * @param {GuildMember} nexor
 * @param {GuildMember} kullanici
 */
function Funcs_Ship(interaction, nexor, kullanici)
{
	// Oran
	const oran = Math.floor(Math.random() * 101);

	// Resim Boyutu
	const resim_boyutu = 256;

	// Canvası Oluştur
	const canvas = createCanvas(resim_boyutu * 2, resim_boyutu);
	const ctx = canvas.getContext('2d');

	// Arkaplanı Oluştur
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Mesaj atan kişinin avatarını çek
	loadImage(nexor.displayAvatarURL({ format: 'png', size: resim_boyutu }).replace('webp','png')).then(n =>
	{
		// Benim resmimi çiz
		ctx.drawImage(n, 0, 0, resim_boyutu, resim_boyutu);
	
		// Etiketlenen kişinin
		loadImage(kullanici.displayAvatarURL({ format: 'png', size: resim_boyutu }).replace('webp','png')).then(k => 
		{
			// Resmini çiz
			ctx.drawImage(k, resim_boyutu, 0, resim_boyutu, resim_boyutu);
		
			// Yazı verilerini ayarla
			ctx.fillStyle = 'white';
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 3;
			ctx.font = '30px Arial';
			ctx.textAlign = 'center';

			// Yazıları çiz
			ctx.strokeText(`${oran}%`, canvas.width / 2, canvas.height / 2);
			ctx.fillText(`${oran}%`, canvas.width / 2, canvas.height / 2);

			// Resmi kanala gönder
			const dosya = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'ship.png' });
			interaction.channel.send({ content: `${nexor.displayName} ve ${kullanici.displayName} çiftinin uyumluluğu: **%${oran}**`, files: [dosya] });
		});
	});
}