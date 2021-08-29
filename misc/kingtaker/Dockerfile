FROM alpine:3

RUN apk add apache2
WORKDIR /var/www/localhost/htdocs/
ADD challenge/public/index.html ./
ADD challenge/public/game.html  ./
ADD challenge/public/static     ./static

ADD challenge/init.sh /etc/init.sh
RUN chmod +x /etc/init.sh
