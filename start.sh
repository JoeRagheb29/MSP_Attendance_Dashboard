#!/bin/bash

echo "Starting MSP Attendance Dashboard..."
echo ""
echo "Installing dependencies if needed..."
npm run install:all
echo ""
echo "Starting both frontend and backend..."
npm run dev:all
