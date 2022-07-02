#!/bin/bash
fn=DATA/chainlist.html
rm -f -- $fn
touch $fn

echo -e
echo Requesting list of all chains.
echo -e
URL='https://chainlist.org/'	
res=$(curl $URL)
echo -e

if [[ $res == 'curl: (6) Could not resolve host: chainlist.org' || "$res" == "" ]]; then
    echo 'Request failed.'
else
    echo $res >> $fn
fi

echo -e










