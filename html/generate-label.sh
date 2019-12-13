#!/bin/sh

# https://phantomjs.org/examples
# https://pypi.org/project/brother-ql/

QT_QPA_PLATFORM=offscreen

cp template.html index.html
echo $1 $2 $3
sed -i  "s/BARCODE/$1/g" index.html
sed -i  "s/NAME/$2/g" index.html
sed -i  "s/AMOUNT/$3/g" index.html

phantomjs rasterize.js file://`pwd`/index.html index.png 696px*171px

