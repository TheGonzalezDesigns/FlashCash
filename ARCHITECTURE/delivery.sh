#!/bin/bash

exchange=$1
vol=$2

trailLimit=$(cat "$exchange/DATA/trailLimit")
dir=$exchange"/DATA/QUOTES/"$vol"Vol"
port=8888
path=$port/claim

./preload.o $dir $trailLimit $path  \
#&& sleep .0005 \
#&& bun run ./filterQuotes.js $exchange $network $vol $mrc $trailLimit
#fastify api aka ./port.js
# whole fucking thing (preload + port) will lie in a script named ./delivery.sh
#./port will then send the package to "the border", a mini script  where quotes will be approved or rejected to cross into the smart contracts!
