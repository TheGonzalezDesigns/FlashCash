#!/bin/bash

network=137
file=tokenList.json

rm -f -- $file
touch $file

curl https://apiv5.paraswap.io/tokens/$network >> $file
