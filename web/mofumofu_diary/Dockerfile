FROM php:8-apache

ADD challenge/flag.txt /
RUN chmod 444 /flag.txt

WORKDIR /var/www/html

ADD challenge/index.php ./
ADD challenge/util.php  ./
ADD challenge/images    ./images
RUN chown -R root:www-data ./
RUN chmod -R 444           ./
RUN chmod    555           ./
RUN chmod    555           ./images
