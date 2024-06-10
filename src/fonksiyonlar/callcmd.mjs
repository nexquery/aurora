/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		callcmd.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		07.05.2024, 18:38:57
 */

import { Client, Message } from "discord.js";

/**
 * 
 * @param {Client} client
 * @param {Message} message
 * @param {String} cmd
 * @param {String[]} args
 */

export default async function callcmd(client, message, cmd, args)
{
	for (const [_, value] of client.komutlar)
	{
		if(value.alias)
		{
			for (const prefix of value.alias)
			{
				if(prefix === cmd)
				{
					return value.execute(client, message, cmd, args);
				}
			}
		}
	}
}