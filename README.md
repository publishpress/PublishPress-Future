PublishPress Dev-Workspace scripts
==================================

This repository contains scripts to help you setup a development environment for PublishPress plugins.

## Requirements

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

## Setup

1. Add the `bin` subdir as a subtree to your project, inside the `./dev-workspace/` folder:

    ```bash
    git subtree add --prefix=dev-workspace/bin https://github.com/publishpress/dev-workspaces.git main
    ```
