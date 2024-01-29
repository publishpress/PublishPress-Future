PublishPress Dev-Workspace scripts
==================================

This repository contains scripts to help you setup a development environment for PublishPress plugins.

## Requirements

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

## Setup

1. Add the repository as a subtree to your project, inside the `./dev-workspace/` folder with prefix `src`:

    ```bash
    git subtree add --prefix=dev-workspace/src https://github.com/publishpress/dev-workspaces.git main
    ```

2. Create a `./dev-workspace/.env` file as a copy of `./dev-workspace/src/.env.example` and fill in the variables.

    ```bash
    cp ./dev-workspace/src/.env.example ./dev-workspace/.env
    ```

3. Create a `./dev-workspace/exec` file as a copy of `./dev-workspace/src/exec.example`.

    ```bash
    cp ./dev-workspace/src/exec.example ./dev-workspace/exec
    ```

4. Make the `./dev-workspace/exec` file executable.

    ```bash
    chmod +x ./dev-workspace/exec
    ```

5. Run the `./dev-workspace/exec` file to check it is working.

    ```bash
    ./dev-workspace/exec
    ```

You should see the following output:

```bash
Usage: ./src/bin/exec [run|update|build|build-push]

Commands:
- run: Run the dev-workspace container
- update: Update the docker image for the dev-workspace container
- build: Build the docker image
- build-push: Build and push the docker image to the registry
```

## Updating the `dev-workspace/src` subtree

To update the subtree, run the following command:

```bash
git subtree pull --prefix=dev-workspace/src
```

## Using the dev-workspace container

### Running the dev-workspace container

To run the dev-workspace container, run the following command:

```bash
./dev-workspace/exec run
```

### Updating the dev-workspace container

To update the dev-workspace container, run the following command:

```bash
./dev-workspace/exec update
```

### Building the dev-workspace container

To build the dev-workspace container, run the following command:

```bash
./dev-workspace/exec build
```

### Building and pushing the dev-workspace container

To build and push the dev-workspace container, run the following command:

```bash
./dev-workspace/exec build-push
```
