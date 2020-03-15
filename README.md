# Kleiner Service zum Ansteuern des Etikettendruckers Brother QL-820NWB

HTTP-Request -> app.js -> generate-label.sh

## URL-Struktur

http://beaglebone.local:8181/index.png?barcode=<BARCODE>&artikelnr=<ARTIKELNR>&name=<NAME>&menge=<MENGE>&me=<ME>&etiketten=1


| Parameter | Anzahl Zeichen | Bemerkung     |
|-----------|----------------|---------------|
| barcode   | 17             | CODE128       |
| artikelnr | 17             |               |
| menge     | 3              | Positive Zahl |
| name      | 18             | UTF-8         |
| me        | 3              | Mengeneinheit |
| etiketten | 2              | 1-99          |
| log       | immer true     | optional      |
| debug     | immer true     | optional      |


## Optionale Parameter

debug=true - gibt das gerenderte Bild zurück 
oder 
log=true - gibt die Konsolenausgabe des vorherigen Requests zurück

## Beispiele:

http://beaglebone.local:8181/index.png?barcode=A1234567890AAAAAA&artikelnr=WWWWWWWW&name=WWWWWWW&menge=9999&me=St.&etiketten=1
http://beaglebone.local:8181/index.png?barcode=A1234567890AAAAAA&artikelnr=WWWWWWWW&name=WWWWWWW&menge=9999&me=St.&etiketten=1&log=true
http://beaglebone.local:8181/index.png?barcode=A1234567890AAAAAA&artikelnr=WWWWWWWW&name=WWWWWWW&menge=9999&me=St.&etiketten=1&debug=true
