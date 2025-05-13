FROM wordpress:cli-php8.4

USER root

RUN apk add --no-cache git openssh-client; \
    # Install composer
    curl -sS https://getcomposer.org/installer | php; \
    mv composer.phar /usr/local/bin/composer

RUN mkdir -p /config
RUN chown -R www-data:www-data /config

USER www-data

WORKDIR /var/www/html

# Copy the ray loader file to /config

COPY --chown=www-data:www-data load-spatie-ray.php /config/ray-loader.php
COPY --chown=www-data:www-data ./ray.php /config/ray.php
