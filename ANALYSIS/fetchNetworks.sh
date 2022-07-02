#!/bin/bash
fn=DATA/networks.json
rm -f -- $fn
touch $fn

echo -e
echo Requesting list of all networks.
echo -e
URL='https://api.coingecko.com/api/v3/asset_platforms'	
res=$(curl -X 'GET' $URL -H 'accept: application/json')

if [[ $res == 'error code: 1015' || "$res" == "" ]]; then
    echo 'Request failed.'
else
    echo $res >> $fn
fi

echo -e










