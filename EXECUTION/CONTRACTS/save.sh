#!/bin/bash

network=$1

if [[ -z $network ]]; then
	network="bittorrent"
fi
rm -r ./artifacts/* 
npx hardhat compile && npx hardhat run scripts/deploy.js --network $network
