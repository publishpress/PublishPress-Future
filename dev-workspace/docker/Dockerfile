FROM publishpress/dev-workspace-terminal:generic-2

ENV PLUGIN_NAME="PublishPress Future"
ENV PLUGIN_TYPE="PRO"

ENV NODE_VERSION=21.2.0
ENV NPM_VERSION=10.2.3
ENV NVM_VERSION=0.39.7
ENV NVM_DIR=/root/.nvm

# Upgrade node.js
RUN . $NVM_DIR/nvm.sh && nvm install ${NODE_VERSION}; \
    . $NVM_DIR/nvm.sh && nvm use v${NODE_VERSION}; \
    . $NVM_DIR/nvm.sh && nvm alias default v${NODE_VERSION}
