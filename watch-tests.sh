#! /usr/bin/env bash

LAST_HASH=$(md5 -q test.js)

while true; do sleep 1;
	if [ $LAST_HASH != $(md5 -q test.js) ]; then
		clear
		node test.js;
		LAST_HASH=$(md5 -q test.js)
	fi
done
