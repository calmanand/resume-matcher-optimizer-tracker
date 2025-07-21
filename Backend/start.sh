#!/bin/bash
echo "Starting FastAPI on port $PORT"
uvicorn main:app --host 0.0.0.0 --port $PORT