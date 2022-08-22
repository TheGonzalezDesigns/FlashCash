#!/bin/bash

exchange=$1
network=$2
vol=$3
relPath=../SOLUTIONS/networks/$2/

exchange=$relPath/$exchange
mrc=$(cat "$exchange/DATA/mrc")
spread=$(cat "$exchange/DATA/spread")
trailLimit=$(cat "$exchange/DATA/trailLimit")

./groupQuotes.sh $exchange $network $vol $trailLimit \
&& sleep .0005 \
&& bun run ./filterQuotes.js $exchange $network $vol $mrc $trailLimit
# refined.srls, final output is picked up by ./delivery via preload.cpp
