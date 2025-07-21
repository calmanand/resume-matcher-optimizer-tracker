#!/bin/bash
python -m spacy download en_core_web_sm
uvicorn main:app --host 0.0.0.0 --port 10000