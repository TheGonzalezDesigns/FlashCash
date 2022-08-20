#!/bin/bash

exchange=$1
network=$2
vol=$3
status=1
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

exchange=$relPath/$exchange
mrc=$(cat "$exchange/DATA/mrc")
spread=$(cat "$exchange/DATA/spread")
trailLimit=$(cat "$exchange/DATA/trailLimit")

if [[ -z $vol ]]; then
	vol=$(cat "$exchange/DATA/volatility")
fi

until [ $status -eq 0 ]; do
	src="$exchange/DATA/$vol"
	input=$src"VolTokens.cf"
	outputA=$src"CTV.srls"
	outputB=$src"CTVBinaries.srls"
	./composeBinaries.o $input $outputB \
	&& ./interlace.o $exchange'/DATA/'$vol'CTVBinaries.srls' $exchange'/DATA/'$vol'CTVInterlacedBinaries.srls' $spread \

	status=$?
	
	if [[ $status -ne 0  ]]; then
		sleep 25
	fi

done

if [[ $status -eq 0 && $errStatus -eq 0 ]]; then
	echo -e
	echo 'Token binaries are ready.'
	echo -e
fi
#!/bin/bash

exchange=$1
network=$2
vol=$3
status=1
errStatus=0

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

