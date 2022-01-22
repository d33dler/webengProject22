#!/usr/bin/bash
cd backend
npm install
npm run server & pids=$!

sleep 5

cd ../frontend
npm install
npm start & pids+=" $!"

trap "kill $pids" SIGTERM SIGINT
wait $pids
