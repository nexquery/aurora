/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		menu_renkler.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		15.05.2024, 17:15:21
 */

import { CommandInteraction } from "discord.js";
import Roller from "../semalar/roller.mjs";

/* Menü ID */
export const customId = 'renkler';

/* Menü Verileri */
const Menu_Veri = 
[
	{ value: 'renk-mor',		rol: Roller.renk_mor },
	{ value: 'renk-sari',		rol: Roller.renk_sari },
	{ value: 'renk-yesil',		rol: Roller.renk_yesil },
	{ value: 'renk-pembe',		rol: Roller.renk_pembe },
	{ value: 'renk-kirmizi',	rol: Roller.renk_kirmizi },
];

/**
 * 
 * @param {CommandInteraction} interaction
 * 
 */
export async function execute(interaction)
{
	if(interaction.values[0] === 'renk-sil')
	{
		const kullanici	= interaction.guild.members.cache.get(interaction.member.id);
		await kullanici.fetch(true);
		await kullanici.roles.remove([Roller.renk_mor, Roller.renk_sari, Roller.renk_yesil, Roller.renk_pembe, Roller.renk_kirmizi])
		.then(() => interaction.reply({ content: `Renk rollerin kaldırıldı.`, ephemeral: true }))
		.catch(() => interaction.reply({ content: `Renk rollerin kaldırılırken bir hata oluştu.`, ephemeral: true }));
	}
	else
	{
		const yeni_rol	= Menu_Veri.find(m => m.value === interaction.values[0]);
		const kullanici	= interaction.guild.members.cache.get(interaction.member.id);

		if(!yeni_rol) {
			return interaction.reply({ content: `Renk rollerinde bir hata var, lütfen yetkililere bildirin.`, ephemeral: true });
		}

		await kullanici.fetch(true);

		if(interaction.guild.ownerId !== kullanici.id && !kullanici.roles.cache.has(Roller.booster)) {
			return interaction.reply({ content: `Özel renkleri sadece <@&${Roller.booster}> kullanıcıları alabilir.`, ephemeral: true });
		}

		if(kullanici.roles.cache.has(yeni_rol.rol)) {
			return interaction.reply({ content: `Bu role zaten sahipsin.`, ephemeral: true });
		}

		for(const p of Menu_Veri)
		{
			if(kullanici.roles.cache.has(p.rol))
			{
				await kullanici.roles.remove(p.rol);
				break;
			}
		}

		await kullanici.roles.add(yeni_rol.rol)
		.then(() => interaction.reply({ content: `Renk rollerin güncellendi.`, ephemeral: true }))
		.catch(() => interaction.reply({ content: `Renk rollerin güncellenirken bir hata oluştu.`, ephemeral: true }));
	}
}