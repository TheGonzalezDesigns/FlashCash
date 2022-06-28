#!/bin/bash

network="polygon-pos"
exchange=$1
waitTime=$2
source=$exchange'/contracts.ba'
reqs=($(cat $source))
totalWaitTime=$(echo "(${#reqs[@]}*$waitTime)/60" | bc -l)
items='['
fn=$exchange/allTokenData.json
rm -f -- $fn
touch $fn

echo -e
echo Fetching all token data for $exchange on $network. Should take about $totalWaitTime minutes.
echo -e

for contract in "${reqs[@]}"
	do
		sleep $waitTime
		echo -e
		echo Requesting $contract
		echo -e
		URL='https://api.coingecko.com/api/v3/coins/'$network'/contract/'$contract'?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false'	
		res=$(curl -X 'GET' $URL -H 'accept: application/json')
		if [[ $res == 'error code: 1015' || "$res" == "" ]]; then
			echo -e
			echo 'Request failed.'
			echo -e
		else
			item='{"contract":"'$contract'","data":'$res'},'
		fi
		items=$items$item
	done
items=${items::-1}']'
echo $items >> $fn
echo -e










