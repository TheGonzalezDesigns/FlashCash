#!/bin/bash

exchange=$1
vol=$2

trailLimit=$(cat "$exchange/DATA/trailLimit")
dir=$exchange"/DATA/QUOTES/"$vol"Vol"
port=8888
path=$port/offchain/validate

echo "./preload.o $dir $trailLimit $path"
./preload.o $dir $trailLimit $path  \
