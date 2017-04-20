#!/bin/bash
node createRecord.js -f $1 -r $2 && node grepRecord.js -r $2 -d $3 -s $4
