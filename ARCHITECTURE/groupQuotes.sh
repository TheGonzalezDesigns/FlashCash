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

quotes="$exchange/DATA/QUOTES"
dispatch="$quotes/dispatch"
files=$(dir $quotes -t1 --hide=dispatch)

rm -rf $dispatch
touch $dispatch

for quote in ${files[@]}
do
	data=$(<"$quotes/$quote")
	echo "$data" >> $dispatch
done
