#!/usr/bin/bash
cd backend
npm run server & pids=$!

sleep 5

cd ../frontend
npm start & pids+=" $!"

trap "kill $pids" SIGTERM SIGINT
wait $pids
