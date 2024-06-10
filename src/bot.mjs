/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		bot.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		06.05.2024, 17:44:26
 */

import "dotenv/config";
import { Client, GatewayIntentBits, OAuth2Scopes, Partials, ActivityType } from "discord.js";
import Event_Loader from "./fonksiyonlar/event_loader.mjs";
import Logger from "./fonksiyonlar/logger.mjs";
import { Veritabani_Ayarlar, Veritabani_Baglan, Veritabani_Kanallar, Veritabani_Roller, Veritabani_Snipe } from "./fonksiyonlar/veritabani.mjs";
import Komut_Yukle from "./fonksiyonlar/command_loader.mjs";
import { Menu_Loader } from "./fonksiyonlar/menu_loader.mjs";
import fs from 'node:fs';

// Bot Bilgisi
Logger('Yeşil', `Bot başlatılıyor...`);

// Clienti yapılandır
const client = new Client({
	
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.MessageContent,
	],

	scopes: [
		OAuth2Scopes.Bot,
		OAuth2Scopes.ApplicationsCommands
	],

	partials: [
		Partials.Message,
		Partials.Channel,
		Partials.Reaction,
		Partials.User,
		Partials.GuildMember,
		Partials.ThreadMember,
		Partials.GuildScheduledEvent
	],

	presence: {
		activities: [ { name: '/aurora', type: ActivityType.Custom, } ],
		status: 'online'
	}
});

// Veritabanını yükle
await Veritabani_Baglan();
await Veritabani_Ayarlar();
await Veritabani_Roller();
await Veritabani_Kanallar();
await Veritabani_Snipe();

// Komutları yükle
await Komut_Yukle(client);

// Menü etkileşimlerini yükle
await Menu_Loader(client);

// Eventleri yükle
await Event_Loader(client);

// Botu çalıştır
client.login(process.env.TOKEN);