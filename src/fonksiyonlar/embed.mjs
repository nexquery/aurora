/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		embed.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		07.05.2024, 19:56:31
 */

import { EmbedBuilder, Message, CommandInteraction } from "discord.js"

/** @typedef {('Default'|'White'|'Aqua'|'Green'|'Blue'|'Yellow'|'Purple'|'LuminousVividPink'|'Fuchsia'|'Gold'|'Orange'|'Red'|'Grey'|'Navy'|'DarkAqua'|'DarkGreen'|'DarkBlue'|'DarkPurple'|'DarkVividPink'|'DarkGold'|'DarkOrange'|'DarkRed'|'DarkGrey'|'DarkerGrey'|'LightGrey'|'DarkNavy'|'Blurple'|'Greyple'|'DarkButNotBlack'|'NotQuiteBlack'|'Random')} Renk */
/**
 * 
 * @param {Message} message
 * @param {Renk} renk
 * @param {String} baslik
 * @param {String} icerik
 */

export async function MessageEmbed(message, renk, baslik, icerik, ayarlar = { reply: false, uyeSil: false, botSil: false, sure: 2700 })
{
	const data = new EmbedBuilder().setColor(renk).setTitle(baslik).setDescription(icerik);

	if (ayarlar.reply) {
        if (ayarlar.uyeSil && ayarlar.botSil) {
            message.reply({ embeds: [data] }).then(x => { setTimeout(() => { message.delete(), x.delete(); }, ayarlar.sure); });
        } else if (ayarlar.uyeSil) {
            message.reply({ embeds: [data] }).then(() => { setTimeout(() => { message.delete() }, ayarlar.sure); });
        } else if (ayarlar.botSil) {
            message.reply({ embeds: [data] }).then(x => { setTimeout(() => { x.delete() }, ayarlar.sure); });
        } else {
            message.reply({ embeds: [data] });
        }
    } else {
        if (ayarlar.uyeSil && ayarlar.botSil) {
            message.channel.send({ embeds: [data] }).then(x => { setTimeout(() => { message.delete(), x.delete(); }, ayarlar.sure); });
        } else if (ayarlar.uyeSil) {
            message.channel.send({ embeds: [data] }).then(() => { setTimeout(() => { message.delete() }, ayarlar.sure); });
        } else if (ayarlar.botSil) {
            message.channel.send({ embeds: [data] }).then(x => { setTimeout(() => { x.delete() }, ayarlar.sure); });
        } else {
            message.channel.send({ embeds: [data] });
        }
    }
}

/** @typedef {('Default'|'White'|'Aqua'|'Green'|'Blue'|'Yellow'|'Purple'|'LuminousVividPink'|'Fuchsia'|'Gold'|'Orange'|'Red'|'Grey'|'Navy'|'DarkAqua'|'DarkGreen'|'DarkBlue'|'DarkPurple'|'DarkVividPink'|'DarkGold'|'DarkOrange'|'DarkRed'|'DarkGrey'|'DarkerGrey'|'LightGrey'|'DarkNavy'|'Blurple'|'Greyple'|'DarkButNotBlack'|'NotQuiteBlack'|'Random')} Renk */
/**
 * 
 * @param {CommandInteraction} interaction
 * @param {Renk} renk
 * @param {String} baslik
 * @param {String} icerik
 */

export async function InteractionEmbed(interaction, renk, baslik, icerik, ayarlar = { reply: false, fetch: false, ephemeral: false })
{
	const data = new EmbedBuilder().setColor(renk).setTitle(baslik).setDescription(icerik);
	if(ayarlar.reply) {
		interaction.reply({ fetchReply: ayarlar.fetch, ephemeral: ayarlar.ephemeral, embeds: [data] });
	} else {
		interaction.deferReply({ ephemeral: ayarlar.ephemeral, fetchReply: ayarlar.fetch }).then(() => interaction.editReply({ embeds: [data] }));
	}
}