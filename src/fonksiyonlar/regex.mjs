/*
 * 		Discord AURORA BOT
 * 
 * 	Dosya:
 * 		regex.mjs
 * 
 * 	Kodlama:
 * 		Burak (Nexor)
 * 
 * 	Tarih:
 * 		11.05.2024, 18:44:43
 */

import Kufur_Listesi from "./kufur_listesi.mjs";

/** @param {String} icerik */
export function Regex_Sayi(deger)
{
	const desen = /^\d+$/;
	return desen.test(deger);
}

/** @param {String} icerik */
export function Regex_URL(icerik)
{
	const desen = /^(http|https|ftp):\/\/|[a-zA-Z0-9\-\.]+\.[a-zA-Z](:[a-zA-Z0-9]*)?\/?([a-zA-Z0-9\-\._\?\,\'\/\\\+&%\$#\=~])*[^\.\,\)\(\s]$/;
	return icerik.match(desen);
}

/** @param {String} icerik */
export function Regex_BosMesaj(icerik)
{
	// 02221 - SOFT HYPHEN
	return icerik.includes("\u00AD");
}

/** @param {String} icerik */
export function Regex_TekrarKontrol(icerik)
{
	let sayac = 1;
	const limit = 8;
	for (let i = 0; i < icerik.length - 1; i++)
	{
		if (icerik[i] === icerik[i + 1])
		{
			sayac++;
			if(sayac >= limit)
			{
				return true;
			}
		}
		else
		{
			sayac = 1;
		}
	}
    return false;
}

/** @param {String} icerik */
export function Regex_CapsLock(icerik)
{
	if (icerik.length === 0) {
        return false;
    }

    let isAllLowerCase = true;

    for (let i = 0; i < icerik.length; i++) {
        const karakter = icerik.charAt(i);
        if (karakter !== karakter.toUpperCase()) {
            isAllLowerCase = false;
            break;
        }
    }

    return isAllLowerCase;
}

/** @param {String} icerik */
export function Regex_AntiKufur(icerik)
{
    if (Kufur_Listesi.length === 0) return false;

    let kelimeler = Kufur_Listesi.map(x => x.toLowerCase());
    let str = icerik.trim().toLowerCase().replace(/\s+/g, ' ');
    
    // Özel karakterlerler
    str = str.replace(/[.,\-,*><_()&%+!\/=?|]/g, '');

    let strArray = str.split(' ');

    for (let c of kelimeler)
	{
        if (strArray.includes(c))
		{
            return true;
        }
    }
    
    return false;
}