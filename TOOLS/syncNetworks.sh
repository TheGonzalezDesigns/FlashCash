#!/bin/bash

directory=../SOLUTIONS/networks
networks=$(dir $directory)
model="fantom"
template=$directory/$model/*

echo "Now syncing all networks with $model."
echo -e

for network in ${networks[@]} 
do
	if [ "$network" != $model ];  then
		echo "Syncing $network..."
		echo -e
		network=$directory'/'$network
		rsync --exclude={'DATA/*','DATA'} -r $template $network
	fi
done
			
