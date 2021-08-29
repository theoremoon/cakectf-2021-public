FROM debian:buster-slim

ENV DEBIAN_FRONTEND=nointeractive

RUN apt-get update && apt-get install -yqq curl

ADD ./script.bash /solve.bash

ENTRYPOINT bash /solve.bash
