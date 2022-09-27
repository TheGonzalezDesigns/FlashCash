#!/bin/bash

exchange=$1
vol=$2
quotes=$exchange"/DATA/QUOTES/$vol""Vol"

cd $quotes/
cd ./parsed
rm ./* &
cd ../
rm ./* &
echo "Cleaned old quotes out."
