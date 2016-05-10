#!/usr/bin/env bash
while true
do
nvm use 6
node ./bot.js
echo "  "
echo "  "
echo "--------------------------restarting bot--------------------------"
echo "  "
echo "  "
done
read -p "Press [Enter] to close..."