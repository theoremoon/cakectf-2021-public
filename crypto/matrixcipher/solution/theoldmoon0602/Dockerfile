FROM sagemath/sagemath:latest

USER root
WORKDIR /
ADD ./solve.sage ./solve.sage

ENTRYPOINT sage ./solve.sage
