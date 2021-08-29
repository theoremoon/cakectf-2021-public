FROM tiangolo/uwsgi-nginx-flask:python3.8-alpine

RUN apk update
RUN adduser -D ctf
RUN pip install Flask requests redis

WORKDIR /home/ctf
ADD ./app.py ./
ADD ./secret.py ./
ADD ./uwsgi.ini ./
ADD ./static ./static
ADD ./templates ./templates
RUN chown root:ctf ./ -R
