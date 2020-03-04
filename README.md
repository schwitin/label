# Kleiner Service zum Ansteuern des Etikettendruckers Brother QL-820NWB

HTTP-Request -> app.js -> generate-label.sh

## URL-Struktur

http://beaglebone.local:8181/index.png?barcode=<BARCODE>&artikelnr=<ARTIKELNR>&name=<NAME>&menge=<MENGE>&me=<ME>&etiketten=1

Beispiel:

http://beaglebone.local:8181/index.png?barcode=A1234567890AAAAAA&artikelnr=WWWWWWWW&name=WWWWWWW&menge=9999&me=St.&etiketten=1


| Parameter | Anzahl Zeichen | Bemerkung     |
|-----------|----------------|---------------|
| BARCODE   | 17             | CODE128       |
| ARTIKELNR | 17             |               |
| MENGE     | 3              | Positive Zahl |
| NAME      | 18             | UTF-8         |
| ME        | 3              | Mengeneinheit |
| ETIKETTEN | 2              | 1-99          |

