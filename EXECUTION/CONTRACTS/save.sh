#!/bin/bash

network=$1

if [[ -z $network ]]; then
	network="fantom"
fi

npx hardhat compile && npx hardhat run scripts/deploy.js --network $network
