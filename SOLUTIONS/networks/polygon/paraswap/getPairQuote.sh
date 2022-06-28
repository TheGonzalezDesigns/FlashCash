#!/bin/bash

network=137
source=$1
srcDec=0
dest=$2
destDec=0
amount=$3
#side=BUY
exchange=paraswap
script=solutions/exchanges/$exchange


#echo network: $network
#echo source: $source
#echo srcDec: $srcDec
#echo dest: $dest
#echo destDesc: $destDec
#echo acmount: $amount
#echo side: $side
#echo exchange $exchange
#echo -e
#echo -e --------------------------------
#echo -e
#echo BUYING...
bash $script $network $source $srcDec $dest $destDec $amount $side
#echo -e
#echo -e --------------------------------
#echo -e
#echo SELING...
#bash $script $network $source $srcDec $dest $destDec $amount SELL
