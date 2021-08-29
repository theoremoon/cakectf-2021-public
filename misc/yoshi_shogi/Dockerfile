FROM ubuntu:18.04

ENV DEBIAN_FRONTEND noninteractive

RUN apt update -y --fix-missing && apt upgrade -y
RUN apt install -y python3 python3-pip gpsshogi nginx
RUN pip3 install Flask uwsgi
RUN groupadd -r ctf && useradd -r -g ctf ctf

ADD ./challenge/init.sh /etc/init.sh
RUN chmod +x /etc/init.sh
RUN rm /etc/nginx/sites-available/default
ADD ./challenge/api/nginx.conf /etc/nginx/sites-available/default

WORKDIR /home/ctf/
ADD ./challenge/api/app.py ./
ADD ./challenge/api/uwsgi.ini ./
RUN chown root:ctf ./ -R

ENV PATH $PATH:/usr/games