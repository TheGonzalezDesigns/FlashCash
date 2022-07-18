#!/bin/bash
exchange=$1
file=$2
vol=$3
time=$(cat "$exchange/DATA/time")

while read -r line; do
    a=($line)
    hash=${a[0]}
    contract_A=${a[1]}
    contract_B=${a[2]}
    ./proxyBinary.sh $hash $contract_A $contract_B $exchange $vol &
    sleep $time
    ./throttle.sh $exchange
done <$file