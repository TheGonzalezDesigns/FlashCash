#!/bin/bash
# // todo add minrecieve discount rate Currently at about .998-1% | maybe inlude slippage
exchange=$1
network=$2
status=1
abort=0
wait=7
m=".00998"

if [[ -z $exchange ]]; then
	echo "Error: Missing exchange."
	status=0
fi

if [[ -z $network ]]; then
	echo "Error: Missing network."
	status=0
fi

if [[ $status -eq 1 ]]; then
	price="$exchange/DATA/price"
    xName="$exchange/DATA/exchange"
    time="$exchange/DATA/time"
    vol="$exchange/DATA/volatility"
    mrc="$exchange/DATA/mrc"
    spread="$exchange/DATA/spread"

    echo -e
    read -p "Enter price: " -t $wait p
    if ! [[ -z $p ]]; then
        if  ! [[ "$p" -gt 0 ]]; then
            echo -e
            echo "Provide a price greater than 0."
            echo -e
            while ! [[ "$p" -gt 0 || "$abort" -eq 1 ]]
            do
                read -p "Enter price: " -t $wait p
                if [[ -z $p ]]; then
                    abort=1
                fi
                echo -e
            done
        fi
        if ! [[ "$abort" -eq 1 ]]; then
            read -p "Enter query time: " -t $wait t
            if ! [[ -z $t || "$abort" -eq 1 ]]; then
                read -p "Enter volatility (hi/lo): " -t $wait v
                if ! [[ -z $v ]]; then
                    if  ! [[ "$v" == "hi" || "$v" == "lo" ]]; then
                        while ! [[ "$v" == "hi" || "$v" == "lo" || "$abort" -eq 1 ]];
                        do
                            read -p "Enter volatility (hi/lo): " -t $wait v
                            if [[ -z $v ]]; then
                                abort=1
                            fi
                            echo -e
                        done
                    fi
                    read -p "Enter spread: " -t $wait s
                    if ! [[ -z $s ]]; then
                        if  ! [[ "$s" -gt 0 && "$s" -lt 6  ]]; then
                            echo -e
                            echo "Provide a spread value between 1 and 6."
                            echo -e
                            while ! [[ "$s" -gt 0 && "$s" -lt 6 || "$abort" -eq 1 ]]
                            do
                                read -p "Enter spread: " -t $wait s
                                if [[ -z $s ]]; then
                                    abort=1
                                fi
                                echo -e
                            done
                        fi
                    fi
                fi
            fi
        fi
    fi
    
    echo -e
    echo -e
    if [[ -z $p || -z $t || -z $v || -z $s ]]; then
        echo "No input provided, defaulting constants."
        echo 10000 > "$price"
        echo "0.085" > "$time"
        echo "lo" > "$vol"
        echo 5 > "$spread"
    else
        echo $p > "$price"
        echo "$t" > "$time"
        echo "$v" > "$vol"
        echo $s > "$spread"
    fi
    echo "$3" > "$xName"
    echo "$m" > "$mrc"
    echo -e
    echo "--------------------------------------------"
    echo -e
    echo "Generated constants:"
    echo -e
    echo "Current exchange: $(cat $xName)"
    echo "Current price: $(cat $price)"
    echo "Current quote query time: $(cat $time)"
    echo "Current volatility: $(cat $vol)"
    echo "Current MRC: $(cat $mrc)"
    echo "Current spread: $(cat $spread)"
    echo -e
    echo ____________________________________________
    echo -e
else
    echo "Process aborted."
    exit 1
fi