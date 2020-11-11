FROM php:7-apache

RUN apt-get update && apt-get install -y \
        libicu-dev \
    && docker-php-ext-install \
        mysqli \
    && docker-php-ext-enable \
        mysqli

# Enable apache rewrite
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf
