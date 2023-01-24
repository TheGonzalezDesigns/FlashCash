#!/bin/bash

exchange=$1

./resume.sh $exchange && ./wake && ./limit.sh false
