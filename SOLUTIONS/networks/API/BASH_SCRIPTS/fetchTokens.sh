#!/bin/bash

waitTime=$1
reqs=($(cat DATA/coinGeckoTokens.ba))
items='['

fn=allTokenData.json
rm -f -- $fn
touch $fn

echo -e
echo Fetching all token data. #Include approx. wait time here
echo -e

for id in "${reqs[@]}"
	do
		sleep $waitTime
		res=$(curl -X 'GET' 'https://api.coingecko.com/api/v3/coins/'$id'?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false' -H 'accept: application/json')
		item=$res','
		items=$items$item
	done
items=$items']'
echo $items >> $fn
