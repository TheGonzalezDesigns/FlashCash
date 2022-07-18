#!/bin/bash
exchange=$1
throttle=$(cat "$exchange/DATA/throttle")

compare() (IFS=" "
  exec awk "BEGIN{if (!($*)) exit(1)}"
)

if compare "$throttle > 0"; then
    echo -e
    echo "Now throttling requests..."
    echo ____________________________________________
    echo -e
    sleep "$throttle"
fi