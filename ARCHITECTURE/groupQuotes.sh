#!/bin/bash

exchange=$1
network=$2
vol=$3
trailLimit=$4
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

# SECONDS=0
quotes=$exchange"/DATA/QUOTES/$vol""Vol"
files=$(dir $quotes --hide=dispatch.json --hide=hiVol --hide=loVol --hide=refine* -1)
quantity=$(dir $quotes --hide=dispatch.json --hide=hiVol --hide=loVol  --hide=refine* -1 | wc -l)
# duration=$SECONDS
./composeQuotes.o "$files" "$quantity" "$quotes/" $trailLimit # will open all files and send them to filterQuotes.js
# echo "$(($duration / 60)) minutes and $(($duration % 60)) seconds elapsed."
