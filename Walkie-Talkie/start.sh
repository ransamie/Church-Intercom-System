#!/bin/bash
# Church Intercom Server

echo "---------------------------------------------------"
echo "    CHURCH INTERCOM SYSTEM - WALKIE-TALKIE         "
echo "---------------------------------------------------"
echo ""
echo "Starting server via Node.js..."

# Check if node is installed
if ! command -v node &> /dev/null
then
    echo "[ERROR] Node.js could not be found. Please install it."
    exit
fi

node index.js
