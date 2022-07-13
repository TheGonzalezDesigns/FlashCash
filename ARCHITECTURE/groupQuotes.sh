#!/bin/bash

exchange=$1
network=$2
status=1
errStatus=0

if [[ -z $exchange ]]; then
	echo "Error: Missing exchange."
	status=0
	errStatus=1
fi

if [[ -z $network ]]; then
	echo "Error: Missing network."
	status=0
	errStatus=2
fi

SECONDS=0
quotes=$exchange"/DATA/QUOTES/"
files=$(dir $quotes --hide=dispatch -1)
quantity=$(ls $quotes | wc -l)
duration=$SECONDS

./composeQuotes.o "$files" "$quantity" "$quotes/" # will open all files and send them to filterQuotes.js
echo "$(($duration / 60)) minutes and $(($duration % 60)) seconds elapsed."