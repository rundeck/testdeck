#!/bin/bash

# stdin will appear white in output
echo 'Hello stdout'

# stderr text will appear red in the output
>&2 echo 'Hello stderr'

exit 0