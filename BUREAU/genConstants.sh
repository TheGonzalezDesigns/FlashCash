#!/bin/bash

exchange=$1
network=$2
price="$exchange/DATA/price"
xName="$exchange/DATA/exchange"
time="$exchange/DATA/time"

echo 10000 > "$price"
echo "$3" > "$xName"
echo "0.085" > $time""


echo "Generating constants:"
echo -e
echo "Current exchange: $(cat $xName)"
echo "Current price: $(cat $price)"
echo "Current quote query time: $(cat $time)"
echo -e
echo ____________________________________________