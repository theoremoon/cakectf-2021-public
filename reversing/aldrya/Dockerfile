FROM ubuntu:20.04

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get -y update --fix-missing && apt-get -y upgrade
RUN apt-get -y install xinetd
RUN groupadd -r ctf && useradd -r -g ctf ctf
RUN apt-get -y update --fix-missing
RUN apt-get -y install python3

ADD challenge/pwn.xinetd /etc/xinetd.d/ctf
ADD challenge/init.sh    /etc/init.sh
ADD challenge/redir.sh   /home/ctf/.redir.sh
RUN chmod 550 /home/ctf/.redir.sh
RUN chmod 700 /etc/init.sh
RUN chmod 1733 /tmp /var/tmp /dev/shm

WORKDIR /home/ctf
ADD challenge/flag.txt      /flag.txt
ADD distfiles/aldrya        aldrya
ADD distfiles/sample.aldrya sample.aldrya
ADD distfiles/server.py     server.py
RUN chmod 444 /flag.txt
RUN chmod 550 aldrya
RUN chmod 440 sample.aldrya
RUN mv /flag.txt /flag-$(md5sum /flag.txt | awk '{print $1}').txt

RUN chown -R root:ctf /home/ctf

RUN ls /home/ctf -lh

RUN service xinetd restart
