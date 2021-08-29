HOST=${HOST:-localhost}
PORT=${PORT:-80}

BODY=$(curl -sS -r 8- "http://$HOST:$PORT/")
echo "CakeCTF{$BODY"
