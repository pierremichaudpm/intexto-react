#!/bin/bash

# Kill any existing vite processes
pkill -f vite

# Start the server
cd "/home/pierre/Documents/Intexto/site intexto/intexto-react"
npm run dev > /tmp/intexto-server.log 2>&1 &

# Save the PID
echo $! > /tmp/intexto-server.pid

# Wait a bit for server to start
sleep 3

# Show the log
tail -20 /tmp/intexto-server.log

echo ""
echo "==========================================="
echo "Server started! PID: $(cat /tmp/intexto-server.pid)"
echo "Log file: /tmp/intexto-server.log"
echo "To view logs: tail -f /tmp/intexto-server.log"
echo "To stop: kill $(cat /tmp/intexto-server.pid)"
echo "==========================================="
