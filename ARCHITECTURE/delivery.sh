#!/bin/bash

exchange=$1
network=$2
vol=$3
relPath=../SOLUTIONS/networks/$2/

exchange=$relPath/$exchange
mrc=$(cat "$exchange/DATA/mrc")
spread=$(cat "$exchange/DATA/spread")
trailLimit=$(cat "$exchange/DATA/trailLimit")

./preload.o $exchange $network $vol \
#&& sleep .0005 \
#&& bun run ./filterQuotes.js $exchange $network $vol $mrc $trailLimit
#fastify api aka ./port.js
# whole fucking thing (preload + port) will lie in a script named ./delivery.sh
#./port will then send the package to "the border", a mini script  where quotes will be approved or rejected to cross into the smart contracts!
