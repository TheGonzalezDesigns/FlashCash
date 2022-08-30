#!/bin/bash

exchange=$1
network=$2
vol=$3
relPath=../SOLUTIONS/networks/$2/
exchange=$relPath/$exchange
mrc=$4
spread=$5
trailLimit=$6


#echo exchange
#echo $exchange
#echo network
#echo $network
#echo vol
#echo $vol
#echo mrc
#echo $mrc
#echo spread
#echo $spread
#echo limit
#echo $trailLimit

./groupQuotes.sh $exchange $network $vol $trailLimit \
#&& sleep .0005
bun run ./filterQuotes.js $exchange $network $vol $mrc $trailLimit
code=$?

#if [[ $code -eq -1  ]]; then
#	echo "Should have found something..."
#	echo $code
#else
#	echo "Didn't find anything..."
#	echo $code
#fi
exit $code

