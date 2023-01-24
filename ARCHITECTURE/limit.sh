#!/bin/bash

state=$1

if [[ -z $state ]]; then
	curl "http://localhost:4444/state-limit/"
else
	curl -X POST "http://localhost:4444/state-limit/?limit=${state}" -o /dev/null --silent
fi
