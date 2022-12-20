#!/usr/bin/env node

/*
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */
import inquirer from "inquirer";

import {execSync} from 'child_process';
const exec = commands => {
    execSync(commands, {stdio: 'inherit', shell: true});
};

const additionalArgs = process.argv.slice(2);

inquirer
    .prompt([
        {
            type: "list",
            name: "version",
            message: "Select a PHP version",
            choices: ["5.6", "7.4", "8.0", "8.1", "8.2"]
        },
    ])
    .then((answers) => {
        const command = additionalArgs.join(' ').replace('{{VERSION}}', answers.version);
        exec(command);
    })
    .catch((error) => {
    });
