#!/bin/bash
exchange=$1
file=$2
vol=$3
network=$4
time=$(cat "$exchange/DATA/time")

echo "Binaries Deploying "

while read -r line; do
    a=($line)
    hash=${a[0]}
    contract_A=${a[1]}
    contract_B=${a[2]}
    ./proxyBinary.sh $hash $contract_A $contract_B $exchange $vol $network &
    sleep $time
    ./throttle.sh $exchange
    #./asses.sh $exchange
done <$file
