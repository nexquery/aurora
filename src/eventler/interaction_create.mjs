/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		interaction_create.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		07.05.2024, 12:50:29
 */

import { Client, Events, CommandInteraction } from "discord.js"

export const name = Events.InteractionCreate;
export const once = false;

/**  
 * @param { CommandInteraction } interaction
 * @param { Client } client
*/
export async function execute(interaction, client)
{
	if(interaction.isChatInputCommand())
	{
		const komut = client.komutlar.get(interaction.commandName);
		if(komut)
		{
			return komut.execute(client, interaction, null, null);
		}
	}
	else if(interaction.isAnySelectMenu())
	{
		const menu = client.menuler.get(interaction.customId);
		if(menu)
		{
			menu.execute(interaction);
		}
	}
}
