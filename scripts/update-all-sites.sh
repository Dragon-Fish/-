#!/bin/bash
echo -e "\e[1;43mUpdate Wiki All Start\e[0m"
echo -e "\e[1;42m=============== Main Site ===============\e[0m"
SITE=www php maintenance/update.php --quick
echo -e "\e[1;42m=============== Common Wiki ===============\e[0m"
SITE=common php maintenance/update.php --quick
echo -e "\e[1;43mUpdate Wiki All Done\e[0m"