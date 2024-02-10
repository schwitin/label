#!/bin/bash

# https://pypi.org/project/brother-ql/

# Beispiel-Aufruf
# curl 'http://localhost:8181/index.png?barcode=AbCdEfGHIJKLMNOPQRSTUFZFGlasdjkfl%C3%B6&artikelnr=WWWWWWWW&name=WWWWW&menge=9991&me=St.&etiketten=1'


# https://forum.qt.io/topic/75145/cross-compile-qt-5-7-for-raspberry-pi-3-problem-font-text-words-in-application-not-showing-up-during-running/13
export BROTHER_QL_MODEL=QL-820NWB
export BROTHER_QL_PRINTER=tcp://BRW105BAD1C7BB8.local
#export BROTHER_QL_PRINTER=tcp://192.168.2.116

THREAD_ID=`tr -dc A-Za-z0-9 </dev/urandom | head -c 3`

echo $(date +"%T.%3N") "$THREAD_ID Zu lange Strings abschneiden"
BARCODE=$(echo $1 | colrm 17)
ARTIKELNR=$(echo $2 | colrm 17)
NAME=$(echo $3 | colrm 19)
MENGE=$(echo $4 | colrm 6)
ME=$(echo $5 | colrm 4)
ETIKETTEN=$(echo $6 | colrm 3)

VORLAGE=${7:-etikett_mit_logo}

OUTPUT_IMAGE=/run/user/$UID/label-$THREAD_ID.png
OUTPUT_HTML=/run/user/$UID/label-$THREAD_ID.html
PRINT_CMD='/home/stalker/.local/bin/brother_ql print -l62 --red'

echo $(date +"%T.%3N") "$THREAD_ID BARCODE=$BARCODE"
echo $(date +"%T.%3N") "$THREAD_ID ARTIKELNR=$ARTIKELNR"
echo $(date +"%T.%3N") "$THREAD_ID NAME=$NAME"
echo $(date +"%T.%3N") "$THREAD_ID MENGE=$MENGE"
echo $(date +"%T.%3N") "$THREAD_ID ME=$ME"
echo $(date +"%T.%3N") "$THREAD_ID ETIKETTEN=$ETIKETTEN"
echo $(date +"%T.%3N") "$THREAD_ID VORLAGE=$VORLAGE"
echo $(date +"%T.%3N") "$THREAD_ID OUTPUT_IMAGE=$OUTPUT_IMAGE"


echo $(date +"%T.%3N") "$THREAD_ID Platzhalter in HTML eresetzen"
sed -e  "s^=BARCODE=^$BARCODE^g" -e "s^=ARTIKELNR=^$ARTIKELNR^g" -e "s^=NAME=^$NAME^g" -e "s^=MENGE=^$MENGE^g" -e "s^=ME=^$ME^g" $VORLAGE.html > $OUTPUT_HTML

echo $(date +"%T.%3N") "$THREAD_ID html2png"
wkhtmltoimage  --enable-local-file-access --width 696 file://$OUTPUT_HTML $OUTPUT_IMAGE 2>/dev/null


for (( i = 0; i < $ETIKETTEN; i++ ))
do
  PRINT_CMD="$PRINT_CMD $OUTPUT_IMAGE"
done

echo $(date +"%T.%3N") "$THREAD_ID Drucke $ETIKETTEN Etiketten"
echo $(date +"%T.%3N") "$THREAD_ID PRINT_CMD=$PRINT_CMD"
# $PRINT_CMD

echo $(date +"%T.%3N") "$THREAD_ID Loesche alte Etiketten"
find  /run/user/$UID -name "label-*.png" -mmin +1 -exec rm {} \;
find  /run/user/$UID -name "label-*.html" -mmin +1 -exec rm {} \;

echo $(date +"%T.%3N") "$THREAD_ID Ende"
