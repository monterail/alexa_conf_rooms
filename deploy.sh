#!/bin/sh
zip -r build.zip . -x *.git*
aws lambda update-function-code --function-name alexa_conf_rooms --zip-file fileb://./build.zip
