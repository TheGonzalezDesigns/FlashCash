#!/bin/bash
exchange=$1
throttle="$exchange/DATA/throttle"
pause="$exchange/DATA/pause"
time="$exchange/DATA/time"
tr=$(cat $throttle)
ps=$(cat $pause)
tm=$(cat $time)
c=$(echo "$tr + $ps" | bc -l)

if [[ -z $tr ]]; then
  tr=0
fi

if [[ -z $ps ]]; then
  ps=0
fi

compare() (IFS=" "
  exec awk "BEGIN{if (!($*)) exit(1)}"
)

if compare "$c > 0"; then
    # killall -r "sleep"
    ./wake

    totalWaitTime=$(./../TOOLS/estimateTime.sh $tr)

    echo -e
    echo "Now resuming, after waiting ${totalWaitTime}"
    echo ____________________________________________
    echo -e
fi

echo 0 > $throttle
echo 0 > $pause