#!/bin/bash
origin=$(pwd)


cd CONTRACTS/SERVER 
./run.sh &
cd $origin
#cd ./TERMINAL
#./run.sh &
echo "ALL LEDGERS READY"
