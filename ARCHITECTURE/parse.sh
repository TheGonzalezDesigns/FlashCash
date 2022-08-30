#!/bin/bash

cd ../BUREAU/

hash=$1
input=$2
MRC=$3
vol="$(./volatility)"
dir="$(./data)/QUOTES/$vol""Vol/parsed/"
file="$hash.json"
path="$dir$file"

cd ../ARCHITECTURE

node ./parse.js "$path" "$input" "$MRC"

./collect.sh "$dir"
#mv "$file" "$dir"

#json $path

#echo $input
