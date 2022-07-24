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
	totalWaitTime=$(echo "scale=3; $time * 1000" | bc -l)
	totalWaitTime="$totalWaitTime ms"
	flag="silent"
elif compare "$time < 60 "; then
	totalWaitTime="$time seconds"
elif compare "$time < 3600 "; then
	totalWaitTime=$(echo "scale=3; $time / 60" | bc -l)
	totalWaitTime="$totalWaitTime minutes"
elif compare "$time < 86400 "; then
	totalWaitTime=$(echo "scale=3; $time / 3600" | bc -l)
	totalWaitTime="$totalWaitTime hours"
elif compare "$time < 604800 "; then
	totalWaitTime=$(echo "scale=3; $time / 86400" | bc -l)
	totalWaitTime="$totalWaitTime days"
elif compare "$time < 2592000 "; then
	totalWaitTime=$(echo "scale=3; $time / 604800" | bc -l)
	totalWaitTime="$totalWaitTime weeks"
elif compare "$time < 31536000 "; then
	totalWaitTime=$(echo "scale=3; $time / 2592000" | bc -l)
	totalWaitTime="$totalWaitTime months"
else
	totalWaitTime=$(echo "scale=3; $time / 31536000" | bc -l)
	totalWaitTime="$totalWaitTime years"
fi

echo $totalWaitTime
