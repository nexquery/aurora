/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		menu_iliskiler.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		15.05.2024, 18:36:07
 */

import { CommandInteraction } from "discord.js";
import Roller from "../semalar/roller.mjs";

/* Menü ID */
export const customId = 'iliski';

/* Menü Verileri */
const Menu_Veri = 
[
	{ value: 'iliski-yok',	rol: Roller.sevgilim_yok },
	{ value: 'iliski-lgbt',	rol: Roller.lgbt },
	{ value: 'iliski-var',	rol: Roller.sevgilim_var },
];

/**
 * 
 * @param {CommandInteraction} interaction
 * 
 */
export async function execute(interaction)
{
	if(interaction.values[0] === 'iliski-sil')
	{
		const kullanici	= interaction.guild.members.cache.get(interaction.member.id);
		
		await kullanici.fetch(true);

		await kullanici.roles.remove([Roller.sevgilim_yok, Roller.lgbt, Roller.sevgilim_var])
		.then(() => interaction.reply({ content: `İlişki rollerin kaldırıldı.`, ephemeral: true }))
		.catch(() => interaction.reply({ content: `İlişki rollerin kaldırılırken bir hata oluştu.`, ephemeral: true }));
	}
	else
	{
		const kullanici	= interaction.guild.members.cache.get(interaction.member.id);
		const roller	= Menu_Veri.find(m => m.value === interaction.values[0]);

		if(!roller) {
			return interaction.reply({ content: `İlişki rollerinde bir hata var, lütfen yetkililere bildirin.`, ephemeral: true })
		}

		await kullanici.fetch(true);
		
		await kullanici.roles.remove([Roller.sevgilim_yok, Roller.lgbt, Roller.sevgilim_var]);
		
		await kullanici.roles.add(roller.rol)
		.then(() => interaction.reply({ content: `İlişki rollerin güncellendi.`, ephemeral: true }))
		.catch(() => interaction.reply({ content: `İlişki rollerin güncellenirken bir hata oluştu.`, ephemeral: true }));
	}
}