# Kleiner Service zum Ansteuern des Etikettendruckers Brother QL-820NWB

HTTP-Request -> app.js -> generate-label.sh

## URL-Struktur

http://rpi.local:8181/index.png?barcode=<BARCODE>&artikelnr=<ARTIKELNR>&name=<NAME>&menge=<MENGE>&me=<ME>&etiketten=1


| Parameter | Anzahl Zeichen| Bemerkung                                                                                                                                                 |
|-----------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| barcode   | 16            | CODE128                                                                                                                                                   |
| artikelnr | 16            |                                                                                                                                                           |
| menge     | 5             | Positive Zahl                                                                                                                                             |
| name      | 18            | UTF-8                                                                                                                                                     |
| me        | 3             | Mengeneinheit                                                                                                                                             |
| etiketten | 2             | Anzahl Etiketten, die gedruckt werden müssen. Bei etiketten=0 wird das Etikett generiert, jedoch nicht an den Drucker geschickt (nützlich mit debug=true).|
| vorlage   | Konstante     | Optional, möglihce Werte sind *etikett_mit_logo* (Standardwert), *etikett_ohne_logo*                                                                      |



## Starten (zum Ausprobieren, sonst als Service s.u.)

`node app.js`


## Beispiele:

### Ausdruck eines Etiketts mit Logo
  
  http://rpi.local:8181/index.png?barcode=123456789ABCDEFG&artikelnr=123456789ABCDEFG&name=Sechskantschraube123&menge=-9999&me=St.&etiketten=1&vorlage=etikett_mit_logo

### Ausdruck eines Etiketts ohne Logo

  http://rpi.local:8181/index.png?barcode=123456789ABCDEFG&artikelnr=123456789ABCDEFG&name=Sechskantschraube123&menge=-9999&me=St.&etiketten=0&vorlage=etikett_ohne_logo

### Logausgaben 

  http://rpi.local:8181/log
  
### Inhalt des Ausgabeverzeichnisses

  http://rpi.local:8181/ls
	
### Durchstarten von label.service (neue Version wird von github bezogen)

  http://rpi.local:8181/restart

### Raspberry PI durchstarten

  http://rpi.local:8181/reboot
	
### Raspberry PI herunterfahren

  http://rpi.local:8181/reboot
	

# Installation
	`sudo apt-get install nodejs npm wkhtmltopdf python3-full`
	`pip install --upgrade brother_ql --break-system-packages`
	`cd label/html && npm install`
  `sudo cp label.service /etc/systemd/system/.`
  `sudo systemctl enable label.service`
	
# Start/Stop/Status
	`sudo systemctl start label.service`
  `sudo systemctl status label.service`
  `sudo systemctl stop label.service`

# Logausgaben
  `journalctl --unit=label.service -n 50 --no-pager`
	
# Links
- RAM fs https://iotassistant.io/raspberry-pi/writing-to-file-on-ram-disk-on-raspberry-pi/

