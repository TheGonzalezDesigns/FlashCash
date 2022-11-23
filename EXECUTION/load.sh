#!/bin/bash
origin=$(pwd)


cd ../BUREAU
solution="$(./solution)"
conversions="../$solution/DATA/conversions.json"
where="./TERMINAL/routes/"
cd $origin
cp "$conversions" $where
echo "CONVERSIONS RETRIEVED"
