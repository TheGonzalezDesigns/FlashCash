#!/bin/bash
exchange=$1
throttle="$exchange/DATA/throttle"
pause="$exchange/DATA/pause"

if [[ -z $throttle ]]; then
  throttle=0
fi

ompare() (IFS=" "
  exec awk "BEGIN{if (!($*)) exit(1)}"
)

if compare "$throttle > 0"; then

    totalWaitTime=$(./../TOOLS/estimateTime.sh $time)

    echo -e
    echo "Now resuming, after waiting ${totalWaitTime}"
    echo ____________________________________________
    echo -e
fi

echo 0 > $throttle
echo 0 > $pause
