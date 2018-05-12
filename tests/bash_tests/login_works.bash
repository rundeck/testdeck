#!/bin/bash

# Failing test example

# stdin will appear white in output
echo 'Hello stdout'

# stderr text will appear red in the output
>&2 echo 'Hello stderr'

# Non-zero exit code notifies runner this test has failed
exit 1