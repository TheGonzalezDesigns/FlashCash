#!/bin/bash

exchange=$1
req=$2

break="$exchange/DATA/break"
br=$(cat $break)

br=$((br + 1))

if ! [[ -z $req ]]; then
	br=$req
fi

state=$(expr $br % 2)

echo $state > $break

if [[ $state -eq 0  ]]; then
	alert="\tAll systems are discontinued!"
else
	alert="\t  All systems are active!"
fi

echo -e
echo -e "\t*********************************************************"
echo -e "\t*                                                       *"
echo -e "\t*\t\t\tATTENTION:			*"
echo -e "\t*                                                       *"
echo -e "\t*\t$alert  		*"
echo -e "\t*                                                       *"
echo -e "\t*********************************************************"
echo -e
