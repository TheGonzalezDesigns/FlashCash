#!/bin/bash

exchange=$1
network=$2
status=0
errStatus=0
relPath=../SOLUTIONS/networks/$2/

if [[ -z $exchange ]]; then
        echo "Error: Missing exchange."
        status=0
        errStatus=1
fi

if [[ -z $network ]]; then
        echo "Error: Missing network."
        status=0
        errStatus=2
fi

DUMP="../DUMP"

echo $exchange > $DUMP/exchange
echo $network > $DUMP/network


if [[ $status -eq 0 && $errStatus -eq 0 ]]; then
   	echo ____________________________________________
        echo -e
        echo 'Network & Exchange route established.'
   	echo ____________________________________________
	#echo --------------------------------------------
	echo -e
	echo -e "Exchange:\t$(cat $DUMP/exchange)"
	echo -e
	echo --------------------------------------------
	echo -e
	echo -e "Network:\t$(cat $DUMP/network)"
	echo -e

fi
