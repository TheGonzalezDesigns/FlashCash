#!/bin/bash

directory=../SOLUTIONS/networks
networks=$(dir $directory)
model="polygon"
template=$directory/$model/*

echo "Now syncing all networks with $model."
echo -e

for network in ${networks[@]} 
do
	if [ "$network" != $model ];  then
		echo "Syncing $network..."
		echo -e
		network=$directory'/'$network
		cp -r $template $network
	fi
done
			
