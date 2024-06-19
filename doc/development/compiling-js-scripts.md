# Compiling JS Scripts

The scripts that will be compiled are defined in the `webpack.config.js` file in the root dir.

## Compiling for development

This command will compile all the JS scripts in the `src/assets/jsx` directory and output them to the `src/assets/js` directory. The scripts will be compiled with source maps and will not be minified.

```bash
composer build:js-dev
```

For development, you can also use the following command to watch for changes in the `src/assets/jsx` directory and automatically compile the scripts to the `src/assets/js` directory.

```bash
composer watch:js
```

## Compiling for production

This command will compile all the JS scripts in the `src/assets/jsx` directory and output them to the `src/assets/js` directory. The scripts will be minified and will not have source maps.

```bash
composer build:js
```
