#!/bin/bash

# ----------------------------------------------
# --- Start node app and optionnally mongodb ---
# ----------------------------------------------

# Test if arguments are passed

hasarg=0

if test $# = 0
then
	hasarg=0
else
	hasarg=1
fi

# Manage options

while test $# -gt 0
do
case $1 in

  # Normal option processing
  
    -h | --help)
      # usage and help
      echo "
-h, --help	Show options
-m, --mongod	Launch mongodb server with node app
      "
      ;;
      
    -m | --mongod)
      echo "Launch mongod on in new shell (new terminal window)"
      osascript -e 'tell app "Terminal"
      	do script "/usr/local/Cellar/mongodb/1.8.2-x86_64/bin/mongod"
      end tell' & node app
      ;;

  # Special cases
    --)
      break
      ;;
    --*)
      # error unknown (long) option $1
      ;;
    -?)
      # error unknown (short) option $1
      ;;

  # Done with options
    *)
      break
      ;;
  esac

  shift
done

# By default, launch node app if no argument passed

if test $hasarg -eq 0
then
	node app
fi