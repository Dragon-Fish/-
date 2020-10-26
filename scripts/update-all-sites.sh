#!/bin/bash
startTime=`date +%s`
echo -e "\e[1;43mUpdate Wiki All Start\e[0m"
echo -e "\e[1;42m=============== Main Site ===============\e[0m"
SITE=www php maintenance/update.php --quick
echo -e "\e[1;42m=============== Common Wiki ===============\e[0m"
SITE=common php maintenance/update.php --quick
endTime=`date +%s`
sumTime=$(( $endTime - $startTime ))
echo -e "\e[1;43mUpdate Wiki All Done in $sumTime seconds\e[0m"