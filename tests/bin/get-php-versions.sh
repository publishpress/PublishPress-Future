#!/usr/bin/env bash

find tests/docker/ -type f -name 'tests-php*\.yml' | sed 's/tests\/docker\/tests-//g' | sed 's/\.yml//g'
