#!/bin/bash

exchange=$1
res=$(./limit.sh)

if [ $res = true ]; then
	./pause.sh $exchange
	#echo "ASSESS: true // ${res}"
else
	#clear
	./resume.sh $exchange && ./wake && ./limit.sh false
	#echo "ASSESS: false // ${res}"
fi
