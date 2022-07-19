#!/bin/bash
exchange=$1
throttle="$exchange/DATA/throttle"
tl=$(cat $throttle)
pause="$exchange/DATA/pause"
ps=$(cat $pause)
rate=1.5

# Program for Fibonacci
# Series
  
# Static input for N
N=$ps
 
# First Number of the
# Fibonacci Series
a=0
 
# Second Number of the
# Fibonacci Series
b=1
  
# echo "The Fibonacci series is : "
  
for (( i=0; i<N; i++ ))
do
    # echo -n "$a "
    fn=$((a + b))
    a=$b
    b=$fn
done
# End of for loop

time=$(echo "scale=3; ($b * $rate)/100" | bc -l)

totalWaitTime=$(./../TOOLS/estimateTime.sh $time)
# echo $wait > $throttle

echo -e
echo "Paused for ${totalWaitTime}"
echo ____________________________________________


ps=$((ps + 1))
tl=$time

echo "$tl" > $throttle
echo "$ps" > $pause