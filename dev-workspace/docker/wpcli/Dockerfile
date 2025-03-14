FROM wordpress:cli-php8.3

USER root
RUN apk add --no-cache mariadb-connector-c mariadb-client && \
    ln -sf /usr/bin/mysql /usr/bin/mariadb

USER www-data
