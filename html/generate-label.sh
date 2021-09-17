#!/bin/bash

# https://phantomjs.org/examples
# https://pypi.org/project/brother-ql/

# Beispiel-Aufruf
# curl 'http://localhost:8181/index.png?barcode=AbCdEfGHIJKLMNOPQRSTUFZFGlasdjkfl%C3%B6&artikelnr=WWWWWWWW&name=WWWWW&menge=9991&me=St.&etiketten=1'


# Damit phantomjs ohne X läuft
export QT_QPA_PLATFORM=offscreen
# https://forum.qt.io/topic/75145/cross-compile-qt-5-7-for-raspberry-pi-3-problem-font-text-words-in-application-not-showing-up-during-running/13
export QT_QPA_FONTDIR=/usr/share/fonts/truetype/dejavu
export BROTHER_QL_MODEL=QL-820NWB
export BROTHER_QL_PRINTER=tcp://BRW105BAD1C7BB8.local
#export BROTHER_QL_PRINTER=tcp://192.168.2.116
# 192.168.1.27
# 192.168.1.24

echo $(date +"%T.%3N") "Zu lange Strings abschneiden"
BARCODE=$(echo $1 | colrm 17)
ARTIKELNR=$(echo $2 | colrm 17)
NAME=$(echo $3 | colrm 19)
MENGE=$(echo $4 | colrm 6)
ME=$(echo $5 | colrm 4)
ETIKETTEN=$(echo $6 | colrm 3)

VORLAGE=${7:-etikett_mit_logo}

echo "BARCODE=$BARCODE"
echo "ARTIKELNR=$ARTIKELNR"
echo "NAME=$NAME"
echo "MENGE=$MENGE"
echo "ME=$ME"
echo "ETIKETTEN=$ETIKETTEN"
echo "VORLAGE=$VORLAGE"


echo $(date +"%T.%3N") "Platzhalter in HTML eresetzen"
sed -e  "s^=BARCODE=^$BARCODE^g" -e "s^=ARTIKELNR=^$ARTIKELNR^g" -e "s^=NAME=^$NAME^g" -e "s^=MENGE=^$MENGE^g" -e "s^=ME=^$ME^g" $VORLAGE.html > index.html

echo $(date +"%T.%3N") "html2png"
# phantomjs rasterize.js file://`pwd`/index.html index.png  696px*271px
# chromium --headless --disable-gpu --screenshot=index.png --window-size=696,271 file://`pwd`/index.html
wkhtmltoimage  --enable-local-file-access --width 696 file://`pwd`/index.html index.png

# print
for (( i = 0; i < $ETIKETTEN; i++ )) 
do
  echo $(date +"%T.%3N") "Drucke" $i   
  /home/stalker/.local/bin/brother_ql print -l62 --red index.png
done

echo $(date +"%T.%3N") "Ende"
