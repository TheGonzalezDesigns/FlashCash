#!/bin/bash

network=$1

node ./getCoinGeckoCoins #getsAllCoins in the network
node ./filterCoinGeckoCoins $network #filters list by network and volatility
