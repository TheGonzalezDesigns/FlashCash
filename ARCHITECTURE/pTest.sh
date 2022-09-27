#!/bin/bash

input="$(cat ./pTestI.json)"
output="pTestO.json"

node ./parse.js "$output" "$input" .2
