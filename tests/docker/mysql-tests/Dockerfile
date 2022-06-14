FROM mysql:5.7

COPY custom-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/custom-entrypoint.sh

ENTRYPOINT ["custom-entrypoint.sh"]

EXPOSE 3306 33060
CMD ["mysqld"]
