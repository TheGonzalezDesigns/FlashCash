#!/bin/bash

#$getPrice=(paraswap f2b5a8c37278bcdd50727d5ca879f8e5a4642e2e 0xc2132d05d31c914a87c6611c10748aeb04b58e8f 100000)

waitTime=$1

echo $PWD

for i in {1..1500}
	do
		echo "CALL \#$i"
		./solutions/networks/polygon/paraswap.sh 0xc2132d05d31c914a87c6611c10748aeb04b58e8f 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 10000
		sleep $waitTime
	done
