FROM python:3.9-slim

RUN pip install --no-cache-dir pycryptodome

WORKDIR /

ADD solve.py solve.py

ENTRYPOINT python solve.py
