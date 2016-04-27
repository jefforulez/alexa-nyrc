#!/bin/bash

pushd ./src
zip -q -r ../target/alexaRunningCalendar.zip .
popd

aws lambda update-function-code \
    --region us-east-1 \
    --function-name="alexaRunningCalendar" \
    --zip-file="fileb://./target/alexaRunningCalendar.zip"
