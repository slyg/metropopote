#!/bin/bash

# ----------------------------------------------
# --- Start node app and optionnally mongodb ---
# ----------------------------------------------

# Test if arguments are passed

hasarg=0
mongodbversion="2.2.0"

# tests if arguments
if test $# = 0
then
	hasarg=0
else
	hasarg=1
fi

test if mongodbversion specified
if test $2
then 
	mongodbversion=$2
fi

# Manage options

while test $# -gt 0
do
case $1 in

  # Normal option processing
  
    -h | --help)
      # usage and help
      echo "
-h, --help		Show options
-m, --mongod <version>	Launch mongodb server with node app, <version> is not mandatory, defaults 1.8.2
      "
      ;;
      
    -m | --mongod)
      echo "Launch mongod on in new shell (new terminal window)"
      osascript -e 'tell app "Terminal"
      	do script "/usr/local/Cellar/mongodb/'"$mongodbversion"'-x86_64/bin/mongod"
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
