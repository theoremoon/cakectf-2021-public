FROM python:3.9-slim

RUN pip install --no-cache-dir pycryptodome

WORKDIR /

ADD solver.py solver.py

ENTRYPOINT python solver.py
