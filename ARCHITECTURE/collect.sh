#!/bin/bash

dir="$1"
src="collection.json"
path="$dir$src"

files=$(dir -x1X $dir)

echo $dir

blob="["

for file in ${files[@]}
	do
		if [[ $file != $src  ]]; then
			json="$dir/$file"
			#echo "dir: $dir"
			#echo "src: $src"
			#echo "json $json"
			data="$(cat $json)"
			if [ $data != " "  ]; then
				blob=$blob$data
				blob=$blob","
			fi
		fi
	done

size="${#blob}"
limit=$((size-1))
blob="${blob[@]:0:$limit}"
collection=$blob"]"

echo "$collection" > $path
