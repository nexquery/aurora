/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		timestamp.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		06.05.2024, 23:31:48
 */

import moment from "moment-timezone";

export function convertTime(timestamp)
{
	// const tarih = moment(timestamp).tz('Europe/Istanbul').format('DD.MM.YYYY, HH:mm:ss');
	// const date = moment.tz(timestamp, 'Europe/Istanbul');
	
	// const Gunler = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
	// const Aylar  = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

	// const zaman = moment(timestamp).tz('Europe/Istanbul');

	// console.log('Gün:', Gunler[zaman.day()], 'Ay:', Aylar[zaman.month()]);
	// console.log(zaman.format('DD.MM.YYYY, HH:mm:ss'));

	return moment(timestamp).tz('Europe/Istanbul').format('DD.MM.YYYY, HH:mm:ss');
}

export function GuvenlikKontrol(kullaniciTimestamp, guvenliGunSayisi)
{
	// Türkiye saatine göre timestmap değerini al
	const kayit_tarihi = moment(kullaniciTimestamp).tz('Europe/Istanbul');

	// Şu anki tarihten itibaren kaç gün öncesi güvenli veya güvensiz olsun ?
	const gerekli_sure = moment().tz('Europe/Istanbul').clone().subtract(guvenliGunSayisi, 'day');

	// Bilgi mesajı
	let sonuc = '';

	// Zamanı hesapla
	if(kayit_tarihi.isSameOrBefore(gerekli_sure)) {
		sonuc = '✅ Güvenilir';
	} else {
		sonuc = '❌ Güvenilir Değil';
	}

	// Sonucu gönder
	return sonuc;
}

export function getTarih()
{
	return moment().tz('Europe/Istanbul').format('DD.MM.YYYY, HH:mm:ss');
}