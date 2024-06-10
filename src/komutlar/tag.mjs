/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		tag.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		12.05.2024, 13:26:18
 */

import { Client, Message, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import Ayarlar from "../semalar/ayarlar.mjs";

export const alias = [
	"tag"
];

export const data = [
	new SlashCommandBuilder().setName(alias[0]).setDescription('Sunucunun tagını gösterir.')
];

/**
 * @param {Client} client
 * @param {CommandInteraction | Message} interaction
 * @param {String} cmd
 * @param {String[]} args
 */

export async function execute(client, interaction, cmd, args)
{
	if(interaction instanceof CommandInteraction)
	{
		interaction.reply({ content: Ayarlar.sunucu.tag });
	}
	else if(interaction instanceof Message)
	{
		interaction.reply(Ayarlar.sunucu.tag);
	}
}