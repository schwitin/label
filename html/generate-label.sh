#!/bin/bash

# https://phantomjs.org/examples
# https://pypi.org/project/brother-ql/

# Damit phantomjs ohne X läuft
export QT_QPA_PLATFORM=offscreen
export BROTHER_QL_MODEL=QL-820NWB
# export BROTHER_QL_PRINTER=tcp://BRW105BAD1C7BB8.local
export BROTHER_QL_PRINTER=tcp://192.168.2.116


echo $(date +"%T.%3N") "Zu lange Strings abschneiden"
BARCODE=$(echo $1 | colrm 18)
ARTIKELNR=$(echo $2 | colrm 18)
NAME=$(echo $3 | colrm 19)
MENGE=$(echo $4 | colrm 5)
ME=$(echo $5 | colrm 4)
ETIKETTEN=$(echo $6 | colrm 3)

echo "BARCODE=$BARCODE"
echo "ARTIKELNR=$ARTIKELNR"
echo "NAME=$NAME"
echo "MENGE=$MENGE"
echo "ME=$ME"
echo "ETIKETTEN=$ETIKETTEN"


echo $(date +"%T.%3N") "Platzhalter in HTML eresetzen"
sed -e  "s^=BARCODE=^$BARCODE^g" -e "s^=ARTIKELNR=^$ARTIKELNR^g" -e "s^=NAME=^$NAME^g" -e "s^=MENGE=^$MENGE^g" -e "s^=ME=^$ME^g" template.html > index.html

echo $(date +"%T.%3N") "html2png"
phantomjs rasterize.js file://`pwd`/index.html index.png  696px*271px

# print
for (( i = 0; i < $ETIKETTEN; i++ )) 
do
  echo $(date +"%T.%3N") "Drucke" $i   
  /home/stalker/.local/bin/brother_ql print -l62 --red index.png
done

echo $(date +"%T.%3N") "Ende"
