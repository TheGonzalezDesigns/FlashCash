#!/bin/bash
exchange=$1
file=$2

while read -r line; do
    a=($line)
    hash=${a[0]}
    contract_A=${a[1]}
    contract_B=${a[2]}
    # echo $line
    ./proxyBinary.sh $hash $contract_A $contract_B $exchange
    sleep .0625
done <$file 
echo $exchange