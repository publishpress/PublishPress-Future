ARG NODE_VERSION=18

FROM node:$NODE_VERSION-alpine AS node

FROM publishpress/dev-workspace-terminal:generic-4.3.7

ENV PLUGIN_NAME="PublishPress Future"
ENV PLUGIN_TYPE="FREE"

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

COPY git/.gitconfig /root/.gitconfig

RUN set -ex \
    && mkdir -p /root/.ssh \
    && npm install -g cross-env \
    # Clean npm cache to reduce image size
    && npm cache clean --force \
    # Remove unnecessary files
    && rm -rf /tmp/* \
    && rm -rf /var/cache/apk/* \
    # Set permissions for SSH directory
    && chmod 700 /root/.ssh
