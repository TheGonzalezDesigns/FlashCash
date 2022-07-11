#!/bin/bash
hash=$1
contract_A=$2
contract_B=$3
exchange=$4
price=$(cat $exchange'/DATA/price')
chainID=$(cat $exchange'/DATA/chainID')
xName=$(cat $exchange'/DATA/exchange')
elucidate=$(cat "$exchange/../../../exchanges/API/QUERY/PAIR/DATA/$xName/elucidate.json")

node ./requestQuote.js $hash $contract_A $contract_B $price $exchange $chainID $xName "$elucidate" &