#!/bin/bash
hash=$1
contract_A=$2
contract_B=$3
exchange=$4
vol=$5
network=$6
price=$(cat $exchange'/DATA/price')
chainID=$(cat $exchange'/DATA/chainID')
xName=$(cat $exchange'/DATA/exchange')
mrc=$(cat $exchange'/DATA/mrc')
spread=$(cat $exchange'/DATA/spread')
trailLimit=$(cat $exchange'/DATA/trailLimit')
elucidate=$(cat "$exchange/../../../exchanges/API/QUERY/PAIR/DATA/$xName/elucidate.json")

node --no-warnings ./requestQuote.js $hash $contract_A $contract_B $price $exchange $chainID $xName "$elucidate" $vol $network $mrc $spread $trailLimit &
