FROM python:3.9-slim

WORKDIR /

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y zip

RUN pip install requests
ADD ./solve.py solve.py

CMD python solve.py
