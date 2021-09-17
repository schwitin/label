# Kleiner Service zum Ansteuern des Etikettendruckers Brother QL-820NWB

HTTP-Request -> app.js -> generate-label.sh

## URL-Struktur

http://beaglebone.local:8181/index.png?barcode=<BARCODE>&artikelnr=<ARTIKELNR>&name=<NAME>&menge=<MENGE>&me=<ME>&etiketten=1


| Parameter | Anzahl Zeichen| Bemerkung                                                                                                                                                 |
|-----------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| barcode   | 16            | CODE128                                                                                                                                                   |
| artikelnr | 16            |                                                                                                                                                           |
| menge     | 5             | Positive Zahl                                                                                                                                             |
| name      | 18            | UTF-8                                                                                                                                                     |
| me        | 3             | Mengeneinheit                                                                                                                                             |
| etiketten | 2             | Anzahl Etiketten, die gedruckt werden müssen. Bei etiketten=0 wird das Etikett generiert, jedoch nicht an den Drucker geschickt (nützlich mit debug=true).|
| vorlage   | Konstante     | Optional, möglihce Werte sind *etikett_mit_logo* (Standardwert), *etikett_ohne_logo*                                                                      |
| log       | immer true    | Optional, darf nicht gleichzeitig mit debug verwendet werden. Gibt die Konsolenasugabe des vorherigen Requests zurück.                                    |
| debug     | immer true    | Optional, darf nicht gleichzeitig mit log verwendet werden. Gibt das von dem vorherigen Request generierte Bild zurück.                                   |



## Starten

`node app.js`


## Beispiele:

### Ausdruck eines Etiketts mit Logo

http://beaglebone.local:8181/index.png?barcode=123456789ABCDEFG&artikelnr=123456789ABCDEFG&name=Sechskantschraube123&menge=-9999&me=St.&etiketten=1&vorlage=etikett_mit_logo

### Ausdruck eines Etiketts ohne Logo

http://beaglebone.local:8181/index.png?barcode=123456789ABCDEFG&artikelnr=123456789ABCDEFG&name=Sechskantschraube123&menge=-9999&me=St.&etiketten=0&vorlage=etikett_ohne_logo


### Logausgaben des vorherigen Druckvorgangs
http://beaglebone.local:8181/index.png?barcode=123456789ABCDEFG&artikelnr=123456789ABCDEFG&name=Sechskantschraube123&menge=-9999&me=St.&etiketten=0&log=true&vorlage=etikett_mit_logo


### Ausgabe des zuvor generierten Etiketts als PNG-Bild 
http://beaglebone.local:8181/index.png?barcode=123456789ABCDEFG&artikelnr=123456789ABCDEFG&name=Sechskantschraube123&menge=-9999&me=St.&etiketten=0&debug=true&vorlage=etikett_mit_logo

