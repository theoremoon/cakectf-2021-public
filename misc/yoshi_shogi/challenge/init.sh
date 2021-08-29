#!/bin/sh
service nginx start
uwsgi --ini /home/ctf/uwsgi.ini && /bin/sleep infinity
