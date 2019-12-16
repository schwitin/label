# Kleiner Service zum Ansteuern des Etikettendruckers Brother QL-820NWB

HTTP-Request -> app.js -> generate-label.sh

## URL-Struktur

http://beaglebone.local:8181/index.png?barcode=<BARCODE>&artikelnr=<ARTIKELNR>&name=<NAME>&menge=<MENGE>&me=<ME>.&etiketten=1


| Parameter | Anzahl Zeichen | Bemerkung     |
|-----------|----------------|---------------|
| BARCODE   | 25             | CODE128       |
| ARTIKELNR | 16             |               |
| MENGE     | 5              | Positive Zahl |
| NAME      | 18             | UTF-8         |
| ME        | 3              | Mengeneinheit |
| ETIKETTEN | 2              | 1-99          |

