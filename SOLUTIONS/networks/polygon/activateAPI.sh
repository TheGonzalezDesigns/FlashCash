#!/bin/bash

exchange=$1
network=$2
status=1

until [ $status -eq 0 ]; do
	clear && './'$exchange'/getTokenList.sh' && node ./parseList.js $exchange && ./fetchTokens.sh $exchange 1.25 && node ./cleanList.js $exchange && node calcTokens.js $exchange $network
	status=$?
	#echo 'Status: '$status
done

if [[ $status -eq 0 ]]; then
	echo -e
	echo 'Successfully primed tokens for the '$exchange' architecture on '$2'.'
	echo -e
	echo "Get excited bitch, we're about to be rich!"
	echo -e
fi
