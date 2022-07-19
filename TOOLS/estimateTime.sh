#!/bin/bash
time=$1
totalWaitTime=""

compare() (IFS=" "
  exec awk "BEGIN{if (!($*)) exit(1)}"
)
if compare "$time == 0"; then
	totalWaitTime="no time."
	flag="silent"
elif compare "$time < 1"; then
	totalWaitTime=$(echo "$time * 1000" | bc -l)
	totalWaitTime="$totalWaitTime ms"
	flag="silent"
elif [ "$time" -lt 60 ]; then
	totalWaitTime="$time seconds"
elif [ "$time" -lt 3600 ]; then
	totalWaitTime=$(echo "$time / 60" | bc -l)
	totalWaitTime="$totalWaitTime minutes"
elif [ "$time" -lt 86400 ]; then
	totalWaitTime=$(echo "$time / 3600" | bc -l)
	totalWaitTime="$totalWaitTime hours"
elif [ "$time" -lt 604800 ]; then
	totalWaitTime=$(echo "$time / 86400" | bc -l)
	totalWaitTime="$totalWaitTime days"
elif [ "$time" -lt 2592000 ]; then
	totalWaitTime=$(echo "$time / 604800" | bc -l)
	totalWaitTime="$totalWaitTime weeks"
elif [ "$time" -lt 31536000 ]; then
	totalWaitTime=$(echo "$time / 2592000" | bc -l)
	totalWaitTime="$totalWaitTime months"
else
	totalWaitTime=$(echo "$time / 31536000" | bc -l)
	totalWaitTime="$totalWaitTime years"
fi

echo $totalWaitTime
