/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		menu_oyunlar.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		15.05.2024, 18:16:04
 */

import { CommandInteraction } from "discord.js";
import Roller from "../semalar/roller.mjs";

/* Menü ID */
export const customId = 'oyunlar';

/* Menü Verileri */
const Menu_Veri = 
[
	{ value: 'oyun-valorant',	rol: Roller.valorant },
	{ value: 'oyun-cs',			rol: Roller.counter_strike },
	{ value: 'oyun-lol',		rol: Roller.league_of_legends },
	{ value: 'oyun-pubg',		rol: Roller.pubg },
	{ value: 'oyun-zula',		rol: Roller.zula },
	{ value: 'oyun-wildrift',	rol: Roller.wild_rift },
	{ value: 'oyun-mlbb',		rol: Roller.mobile_legends },
];

/**
 * 
 * @param {CommandInteraction} interaction
 * 
 */
export async function execute(interaction)
{
	if(interaction.values[0] === 'oyun-sil')
	{
		const kullanici	= interaction.guild.members.cache.get(interaction.member.id);
		await kullanici.fetch(true);
		await kullanici.roles.remove([Roller.valorant, Roller.counter_strike, Roller.league_of_legends, Roller.pubg, Roller.zula, Roller.wild_rift, Roller.mobile_legends])
		.then(() => interaction.reply({ content: `Oyun rollerin kaldırıldı.`, ephemeral: true }))
		.catch(() => interaction.reply({ content: `Oyun rollerin kaldırılırken bir hata oluştu.`, ephemeral: true }));
	}
	else
	{
		const yeni_rol	= Menu_Veri.find(m => m.value === interaction.values[0]);
		const kullanici	= interaction.guild.members.cache.get(interaction.member.id);

		if(!yeni_rol) {
			return interaction.reply({ content: `Oyun rollerinde bir hata var, lütfen yetkililere bildirin.`, ephemeral: true });
		}

		await kullanici.fetch(true);

		if(kullanici.roles.cache.has(yeni_rol.rol)) {
			return interaction.reply({ content: `Bu role zaten sahipsin.`, ephemeral: true });
		}

		await kullanici.roles.add(yeni_rol.rol)
		.then(() => interaction.reply({ content: `Oyun rollerin güncellendi.`, ephemeral: true }))
		.catch(() => interaction.reply({ content: `Oyun rollerin güncellenirken bir hata oluştu.`, ephemeral: true }));
	}
}