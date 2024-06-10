/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		menu_burclar.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		15.05.2024, 17:58:36
 */

import { CommandInteraction } from "discord.js";
import Roller from "../semalar/roller.mjs";

/* Menü ID */
export const customId = 'burclar';

/* Menü Verileri */
const Menu_Veri = 
[
	{ value: 'burc-koc',		rol: Roller.burc_koc },
	{ value: 'burc-boga',		rol: Roller.burc_boga },
	{ value: 'burc-ikizler',	rol: Roller.burc_ikizler },
	{ value: 'burc-yengec',		rol: Roller.burc_yengec },
	{ value: 'burc-aslan',		rol: Roller.burc_aslan },
	{ value: 'burc-basak',		rol: Roller.burc_basak },
	{ value: 'burc-terazi',		rol: Roller.burc_terazi },
	{ value: 'burc-akrep',		rol: Roller.burc_akrep },
	{ value: 'burc-yay',		rol: Roller.burc_yay },
	{ value: 'burc-oglak',		rol: Roller.burc_oglak },
	{ value: 'burc-kova',		rol: Roller.burc_kova },
	{ value: 'burc-balik',		rol: Roller.burc_balik },
];

/**
 * 
 * @param {CommandInteraction} interaction
 * 
 */
export async function execute(interaction)
{
	if(interaction.values[0] === 'burc-sil')
	{
		const kullanici	= interaction.guild.members.cache.get(interaction.member.id);
		await kullanici.fetch(true);
		for(const p of Menu_Veri)
		{
			if(kullanici.roles.cache.has(p.rol))
			{
				await kullanici.roles.remove(p.rol)
				.then(() => interaction.reply({ content: `Burç rolün kaldırıldı.`, ephemeral: true }))
				.catch(() => interaction.reply({ content: `Burç rolün kaldırılırken bir hata oluştu.`, ephemeral: true }));
				return;
			}			
		}
		interaction.reply({ content: `Burç rollerine sahip değilsin.`, ephemeral: true });
	}
	else
	{
		const yeni_rol	= Menu_Veri.find(m => m.value === interaction.values[0]);
		const kullanici	= interaction.guild.members.cache.get(interaction.member.id);

		if(!yeni_rol) {
			return interaction.reply({ content: `Burç rollerinde bir hata var, lütfen yetkililere bildirin.`, ephemeral: true });
		}

		await kullanici.fetch(true);

		for(const p of Menu_Veri)
		{
			if(kullanici.roles.cache.has(p.rol))
			{
				await kullanici.roles.remove(p.rol);
				break;
			}			
		}

		await kullanici.roles.add(yeni_rol.rol)
		.then(() => interaction.reply({ content: `Burç rollerin güncellendi.`, ephemeral: true }))
		.catch(() => interaction.reply({ content: `Burç rollerin güncellenirken bir hata oluştu.`, ephemeral: true }));
	}
}