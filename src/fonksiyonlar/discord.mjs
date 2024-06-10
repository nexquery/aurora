/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		discord.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		15.05.2024, 16:42:11
 */

import { CommandInteraction, Message } from "discord.js";

/** @param {CommandInteraction | Message} interaction */
export function Discord_RandomUser(interaction)
{
	const filtre	= interaction.guild.members.cache.filter(x => !x.user.bot && x.user.id !== interaction.member.id);
	const index		= Math.floor(Math.random() * filtre.size);
	const rnd_user	= filtre.at(index);
    return rnd_user;
}