/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		kayit.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		08.05.2024, 13:16:30
 */

import { Client, Message, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import Roller from "../semalar/roller.mjs";
import { InteractionEmbed, MessageEmbed } from "../fonksiyonlar/embed.mjs";
import Ayarlar from "../semalar/ayarlar.mjs";
import Logger from "../fonksiyonlar/logger.mjs";
import Kanallar from "../semalar/kanallar.mjs";
import { Collection_Kullanici } from "../fonksiyonlar/veritabani.mjs";

export const alias = [
	"e", "erkek",
	"k", "kiz", "kız"
];

export const data = [
	//Erkek
	new SlashCommandBuilder().setName('erkek').setDescription('Bir kullanıcıyı erkek olarak kayıt eder.')
	.addUserOption(m => m.setName('kullanıcı').setDescription('Kayıt edilecek kullanıcıyı seçin.').setRequired(true))
	.addStringOption(m => m.setName('isim').setDescription('Kayıt edilecek kişinin ismini girin.').setRequired(true))
	.addIntegerOption(m => m.setName('yaş').setDescription('Kayıt edilecek kişinin yaşını girin.').setRequired(true)),

	new SlashCommandBuilder().setName('e').setDescription('Bir kullanıcıyı erkek olarak kayıt eder.')
	.addUserOption(m => m.setName('kullanıcı').setDescription('Kayıt edilecek kullanıcıyı seçin.').setRequired(true))
	.addStringOption(m => m.setName('isim').setDescription('Kayıt edilecek kişinin ismini girin.').setRequired(true))
	.addIntegerOption(m => m.setName('yaş').setDescription('Kayıt edilecek kişinin yaşını girin.').setRequired(true)),
	
	// Kız
	new SlashCommandBuilder().setName('kız').setDescription('Bir kullanıcıyı kız olarak kayıt eder.')
	.addUserOption(m => m.setName('kullanıcı').setDescription('Kayıt edilecek kullanıcıyı seçin.').setRequired(true))
	.addStringOption(m => m.setName('isim').setDescription('Kayıt edilecek kişinin ismini girin.').setRequired(true))
	.addIntegerOption(m => m.setName('yaş').setDescription('Kayıt edilecek kişinin yaşını girin.').setRequired(true)),

	new SlashCommandBuilder().setName('k').setDescription('Bir kullanıcıyı kız olarak kayıt eder.')
	.addUserOption(m => m.setName('kullanıcı').setDescription('Kayıt edilecek kullanıcıyı seçin.').setRequired(true))
	.addStringOption(m => m.setName('isim').setDescription('Kayıt edilecek kişinin ismini girin.').setRequired(true))
	.addIntegerOption(m => m.setName('yaş').setDescription('Kayıt edilecek kişinin yaşını girin.').setRequired(true)),
];

const emojiler = ['😊', '🙂', '😇', '🥰', '😍', '🤩', '😻', '💫', '❤️'];

/**
 * @param {Client} _
 * @param {CommandInteraction | Message} interaction
 * @param {String} cmd
 * @param {String[]} args
 */

export async function execute(_, interaction, cmd, args)
{
	if(interaction instanceof CommandInteraction)
	{
		// Değişkenler
		const user			= interaction.options.getUser('kullanıcı');
		const isim			= interaction.options.getString('isim');
		const yas			= interaction.options.getInteger('yaş');
		const kullanici 	= interaction.guild.members.cache.get(user.id);
		const nxr			= (interaction.commandName === 'e' || interaction.commandName === 'erkek') ? false : true;
		const pozisyon		= interaction.guild.roles.cache.get(Roller.kayit_sorumlusu);
		const sohbet_kanali	= interaction.guild.channels.cache.get(Kanallar.sohbet);
		const idx			= Math.floor(Math.random() * emojiler.length);

		// Kontroller
		if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator) || !pozisyon || (pozisyon && interaction.member.roles.highest.rawPosition < pozisyon.rawPosition)) return InteractionEmbed(interaction, 'Red', null, `Bu komutu sadece ${pozisyon} veya daha üstü roller kullanabilir.`);
		if(interaction.channel.id !== Kanallar.kayit) return InteractionEmbed(interaction, 'Red', "Hata", `Bu komutu sadece <#${Kanallar.kayit}> kanalında kullanabilirsin.`);
		if(!interaction.guild.roles.cache.has((!nxr) ? Roller.erkek : Roller.kiz)) return InteractionEmbed(interaction, 'Red', "Hata", `${(!nxr) ? 'Erkek' : 'Kız'} rolü ayarlı değil.`);
		if(!kullanici) return InteractionEmbed(interaction, 'Red', "Hata", `Geçerli bir kullanıcı girmediniz.`);
		if(kullanici.user.bot) return InteractionEmbed(interaction, 'Red', "Hata", `Botları kayıt edemezsin.`);
		if(kullanici.roles.cache.has(Roller.erkek) || kullanici.roles.cache.has(Roller.kiz)) return InteractionEmbed(interaction, 'Red', "Hata", `Bu kişi zaten sunucuda kayıtlı.`);
	
		// Kullanıcıyı ayarla
		await kullanici.fetch(true);
		await kullanici.roles.add((!nxr) ? Roller.erkek : Roller.kiz).then(() => Logger('Yeşil', `${kullanici.user.tag} adlı kullanıcıya ${(!nxr) ? 'erkek' : 'kız'} rolü verildi.`)).catch(hata => Logger('Kırmızı', `${kullanici.user.tag} adlı kullanıcıya ${(!nxr) ? 'erkek' : 'kız'} rolü verilirken bir hata oluştu: ${hata}`));
		await kullanici.roles.remove(Roller.kayitsiz).then(() => Logger('Yeşil', `${kullanici.user.tag} adlı kullanıcının kayıtsız rolü silindi.`)).catch(hata => Logger('Kırmızı', `${kullanici.user.tag} adlı kullanıcının kayıtsız rolü silinirken bir hata oluştu: ${hata}`));
		kullanici.setNickname(`${Ayarlar.sunucu.tag} ${isim} | ${yas}`).then(() => Logger('Yeşil', `${kullanici.user.tag} adlı kullanıcının sunucu adı ${Ayarlar.sunucu.tag} ${isim} | ${yas} olarak değiştirildi.`)).catch(hata => Logger('Kırmızı', `${kullanici.user.tag} adlı kullanıcının adı değiştirilirken bir hata oluştu: ${hata}`));
	
		// Log
		Collection_Kullanici.findOneAndUpdate({ "sunucu.id": kullanici.id }, { $push: { "sunucu.isimler": `${Ayarlar.sunucu.tag} ${isim} | ${yas}` } })
		.then(() => Logger('Yeşil', `${kullanici.user.tag} adlı kullanıcının veritabanındaki isim verileri güncellendi.`))
		.catch(hata => Logger('Kırmızı', `${kullanici.user.tag} adlı kullanıcının veritabanındaki isim verileri güncellenirken bir hata oluştu: ${hata}`));
	
		// Mesaj
		InteractionEmbed(interaction, null, null, `✅ ${kullanici} adlı kullanıcı <@&${(!nxr) ? Roller.erkek : Roller.kiz}> rolü ile kayıt edildi.`, { reply: false, ephemeral: false, fetch: false });
		if(sohbet_kanali) sohbet_kanali.send(`Aramıza yeni bir kullanıcı katıldı. Hoş geldin ${kullanici} ${emojiler[idx]}`);
	}
	else if(interaction instanceof Message)
	{
		// Değişkenler
		const message		= interaction;
		const prefix		= Ayarlar.sunucu.prefix;
		const pozisyon		= message.guild.roles.cache.get(Roller.kayit_sorumlusu);
		const kullanici		= message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		const nxr			= (cmd === 'e' || cmd === 'erkek') ? false : true;
		const regex_isim	= /^[a-zA-Z]+$/;
		const regex_yas		= /^\d+$/;
		const sohbet_kanali	= message.guild.channels.cache.get(Kanallar.sohbet);
		const idx			= Math.floor(Math.random() * emojiler.length);

		// Kontroller
		if(!message.member.permissions.has(PermissionFlagsBits.Administrator) || !pozisyon || (pozisyon && message.member.roles.highest.rawPosition < pozisyon.rawPosition)) return MessageEmbed(message, 'Red', null, `Bu komutu sadece ${pozisyon} veya daha üstü roller kullanabilir.`);
		if(message.channel.id !== Kanallar.kayit) return MessageEmbed(message, 'Red', "Hata", `Bu komutu sadece <#${Kanallar.kayit}> kanalında kullanabilirsin.`);
		if(!message.guild.roles.cache.has((!nxr) ? Roller.erkek : Roller.kiz)) return MessageEmbed(message, 'Red', "Hata", `${(!nxr) ? 'Erkek' : 'Kız'} rolü ayarlı değil.`);
		if(args.length !== 3) return MessageEmbed(message, 'Blurple', "Kullanım", `${prefix}${(!nxr) ? 'erkek' : 'kiz'} [@Kullanıcı veya ID] [İsim] [Yaş]`);
		if(!kullanici) return MessageEmbed(message, 'Red', "Hata", `Geçerli bir kullanıcı girmediniz.`);
		if(kullanici.user.bot) return MessageEmbed(message, 'Red', "Hata", `Botları kayıt edemezsin.`);
		if(!regex_isim.test(args[1])) return MessageEmbed(message, 'Red', "Hata", `İsim formatı geçersiz.`);
		if(!regex_yas.test(args[2])) return MessageEmbed(message, 'Red', "Hata", `Yaş formatı geçersiz.`);
		if(kullanici.roles.cache.has(Roller.erkek) || kullanici.roles.cache.has(Roller.kiz)) return MessageEmbed(message, 'Red', "Hata", `Bu kişi zaten sunucuda kayıtlı.`);

		// Kullanıcıyı ayarla
		await kullanici.fetch(true);
		await kullanici.roles.add((!nxr) ? Roller.erkek : Roller.kiz).then(() => Logger('Yeşil', `${kullanici.user.tag} adlı kullanıcıya ${(!nxr) ? 'erkek' : 'kız'} rolü verildi.`)).catch(hata => Logger('Kırmızı', `${kullanici.user.tag} adlı kullanıcıya ${(!nxr) ? 'erkek' : 'kız'} rolü verilirken bir hata oluştu: ${hata}`));
		await kullanici.roles.remove(Roller.kayitsiz).then(() => Logger('Yeşil', `${kullanici.user.tag} adlı kullanıcının kayıtsız rolü silindi.`)).catch(hata => Logger('Kırmızı', `${kullanici.user.tag} adlı kullanıcının kayıtsız rolü silinirken bir hata oluştu: ${hata}`));
		kullanici.setNickname(`${Ayarlar.sunucu.tag} ${args[1]} | ${args[2]}`).then(() => Logger('Yeşil', `${kullanici.user.tag} adlı kullanıcının sunucu adı ${Ayarlar.sunucu.tag} ${args[1]} | ${args[2]} olarak değiştirildi.`)).catch(hata => Logger('Kırmızı', `${kullanici.user.tag} adlı kullanıcının adı değiştirilirken bir hata oluştu: ${hata}`));
	
		// Log
		Collection_Kullanici.findOneAndUpdate({ "sunucu.id": kullanici.id }, { $push: { "sunucu.isimler": `${Ayarlar.sunucu.tag} ${args[1]} | ${args[2]}` } })
		.then(() => Logger('Yeşil', `${kullanici.user.tag} adlı kullanıcının veritabanındaki isim verileri güncellendi.`))
		.catch(hata => Logger('Kırmızı', `${kullanici.user.tag} adlı kullanıcının veritabanındaki isim verileri güncellenirken bir hata oluştu: ${hata}`));
	
		// Mesaj
		message.channel.send({ embeds: [new EmbedBuilder().setDescription(`✅ ${kullanici} adlı kullanıcı <@&${(!nxr) ? Roller.erkek : Roller.kiz}> rolü ile kayıt edildi.`)] });
		if(sohbet_kanali) sohbet_kanali.send(`Aramıza yeni bir kullanıcı katıldı. Hoş geldin ${kullanici} ${emojiler[idx]}`);
	}
}