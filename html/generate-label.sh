#!/bin/bash

# https://phantomjs.org/examples
# https://pypi.org/project/brother-ql/

# Damit phantomjs ohne X läuft
export QT_QPA_PLATFORM=offscreen

export BROTHER_QL_MODEL=QL-820NWB
export BROTHER_QL_PRINTER=tcp://BRW105BAD1C7BB8.local

cp template.html index.html

# Zu lange String abschneiden
BARCODE=$(echo $1 | colrm 15)
NAME=$(echo $2 | colrm 28)
AMOUNT=$(echo $3 | colrm 6)
ME=$(echo $4 | colrm 4)
ETIKETTEN=$(echo $5 | colrm 3)

echo "BARCODE=$BARCODE"
echo "NAME=$NAME"
echo "AMOUNT=$AMOUNT"
echo "ME=$ME"
echo "ETIKETTEN=$ETIKETTEN"


# BARCODE=$1
# NAME=$2
# AMOUNT=$3
# ME=$4
# ETIKETTEN=$5

# Platzhalter in HTML eresetzen
sed -i  "s/BARCODE/$BARCODE/g" index.html
sed -i  "s/NAME/$NAME/g" index.html
sed -i  "s/AMOUNT/$AMOUNT/g" index.html
sed -i  "s/ME/$ME/g" index.html

# html2png
phantomjs rasterize.js file://`pwd`/index.html index.png 696px*280px

# print
for (( i = 0; i < $ETIKETTEN; i++ )) 
do
  # echo $i
  /home/stalker/.local/bin/brother_ql print -l62 --red index.png
done
