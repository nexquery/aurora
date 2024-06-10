/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		kullanicilar.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		06.05.2024, 21:39:43
 */

export const Kullanici =
{
	sunucu:
	{
		id: 0,				// Kişinin discord id'si								123456789
		hesap_olusturma: 0,	// Kullanıcının hesabını oluşturduğu tarihi gösterir	123456789
		isimler: [],		// Sunucuya kayıt olduğu isimleri gösterir:				{ isim: "⛥ Burak | 24", tarih: 1234, islem: "Kayıt / Boost" }
		giris: [],			// Sunucuya giriş yaptığı tarih verilerini gösterir:	{ kullanici_adi: fakeNex, tarih: 123456789 }
		cikis: [],			// Sunucudan çıkış yaptığı verileri gösterir:			{ kullanici_adi: fakeNex, tarih: 123456789 }
		roller: [],			// Kullanıcının gerekli olan rolleri:					"123", "456"
	},

	ses:
	{
		son_oda: "",
		aktiflik_suresi: 0,
		tarih: 0
	},

	loglar:
	{
		uyari: [], // Kullanıcının aldığı uyarılar
		jail: [], // Kullanıcının aldığı jailler
		kick: [], // Kullanıcı sunucudan kaç kere kicklendi ?
		ban: [], // Kullanıcı sunucudan kaç kere banlandı ?
		mute: [], // Kullanıcı sunucuda kaç kere mute yedi ?
	}
};

export default Kullanici;