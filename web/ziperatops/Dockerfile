FROM php:8-apache

ADD challenge/flag.txt /
RUN chmod 444 /flag.txt
RUN mv /flag.txt /flag-$(md5sum /flag.txt | awk '{print $1}').txt

RUN apt update
RUN apt-get install -y libzip-dev \
    && docker-php-ext-install zip

WORKDIR /var/www/html

ADD challenge/index.php ./
ADD challenge/utils.php ./
RUN mkdir ./temp
RUN chown -R root:www-data ./
RUN chmod -R 440           ./
RUN chmod    550           ./
RUN chown -R www-data:www-data ./temp
RUN chmod    330               ./temp
