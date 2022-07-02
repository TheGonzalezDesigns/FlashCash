#!/bin/bash

exchange=$1
network=$2
waitTime=$3
source=$exchange'/DATA/contracts.ba'
reqs=($(cat $source))
totalWaitTime=$(echo "(${#reqs[@]}*$waitTime)/60" | bc -l)
items='['
fn=$exchange/DATA/allTokenData.json
rm -f -- $fn
touch $fn

echo -e
echo Fetching all token data for $exchange on $network. Should take about $totalWaitTime minutes.
echo -e

r=${#reqs[@]}

for contract in "${reqs[@]}"
	do
		r=$((r - 1))
		sleep $waitTime
		echo -e
		echo Requesting $contract' | '$r' requests remaining'
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
		#echo $item
		#echo -e
		#echo $URL
		#echo -e
	done
items=${items::-1}']'
echo $items >> $fn
echo -e










