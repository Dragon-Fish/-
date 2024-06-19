#!/bin/bash

# 0 1 * * * /data/cronjobs/flush_mysql_binlogs.sh > /data/cronjobs/flush_mysql_binlogs.log 2>&1

MAX_RETRIES=5
RETRY=0

function printTime() {
    echo -n $(date +"%Y-%m-%d %H:%M:%S")
}

echo "[INFO] $(printTime) Flushing binary logs"

while [ $RETRY -lt $MAX_RETRIES ]; do
    mysql -u root -e "FLUSH BINARY LOGS;"
    if [ $? -eq 0 ]; then
        break
    fi
    RETRY=$((RETRY+1))
    echo "[WARN] $(printTime) Failed to flush binary logs, retrying $RETRY/$MAX_RETRIES"
    sleep 1
done

if [ $RETRY -eq $MAX_RETRIES ]; then
    echo "[ERROR] $(printTime) Failed to flush binary logs after $MAX_RETRIES retries"
else
    echo "[OK] $(printTime) Successfully flushed binary logs"
fi
