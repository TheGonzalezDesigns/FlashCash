#!/bin/bash
network=$1
FL=../SOLUTIONS/flashloans
PROFILE=$FL/profiles.json
RELA="$FL/PROVIDERS"
PROVIDERS=$(dir $RELA)

echo "[" > $PROFILE

#echo "RELA: $RELA"
for PROVIDER in ${PROVIDERS[@]}
do
	RELB="$RELA/$PROVIDER/NETWORKS"
	FEE=$(cat $RELB/../FEE)
	#echo "RELB: $RELB"
	#echo $PROVIDER
	NETWORKS=$(dir $RELB)
	for NETWORK in ${NETWORKS[@]}
	do
		RELC="$RELB/$NETWORK/DATA/"
		LENDER=$(cat $RELC/LENDER/address)
		RELC="$RELC/TOKENS"
		#echo "RELC: $RELC"
		#echo $NETWORK
		TOKENS=$(dir $RELC)
		for TOKEN in ${TOKENS[@]}
		do
			RELD="$RELC/$TOKEN"
			#echo "RELD: $RELD"
			#echo $TOKEN
			AD=$(cat "$RELD/address")
			ENTRY="{\"provider\":\"$PROVIDER\", \"fee\":0$FEE, \"network\": \"$NETWORK\", \"lender\":\"$LENDER\", \"token\":\"$TOKEN\", \"contract\": \"$AD\", \"filePath\": \"$RELD\"},"
			echo $ENTRY >> $PROFILE
		done
	done
done
DATA="{}]"
echo $DATA >> $PROFILE

echo "Flashloan data ready."
echo -e

#cat $PROFILE | CLIP.exe

node ./primeContracts.js $PROFILE $network
