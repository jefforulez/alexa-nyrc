#!/bin/sh

aws lambda create-function \
    --region us-east-1 \
    --function-name="alexaRunningCalendar" \
    --runtime="nodejs4.3" \
    --handler="index.handler" \
    --role="arn:aws:iam::295875439397:role/lambda_basic_execution" \
    --description="New York Running Calendar" \
    --zip-file="fileb://./target/alexaRunningCalendar.zip"

