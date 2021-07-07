module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        files_php: [
            '*.php',
            '**/*.php',
            '!.git/**',
            '!vendor/**',
            '!node_modules/**',
            '!logs/**',
            '!.git/**',
        ],
        files_js: [
            '*.js',
            '**/*.js',
            '!.git/**',
            '!vendor/**',
            '!node_modules/**',
            '!logs/**',
            '!Gruntfile.js',
            '!.git/**',
        ],
        mkdir: {
            logs: {
                options: {
                    create: ['logs']
                }
            }
        },
        phpcs: {
            options: {
                bin: 'vendor/bin/phpcs',
                standard: 'phpcs.xml',
                reportFile: 'logs/phpcs.log',
                extensions: 'php',
                showSniffCodes: true
            },
            src: [
                '<%= files_php %>'
            ]
        },
        phpcbf: {
            options: {
                bin: 'vendor/bin/phpcbf',
                standard: 'phpcs.xml',
                noPatch: false,
                extensions: 'php'
            },
            src: [
                '<%= files_php %>'
            ]
        },
        phplint: {
            options: {
                standard: 'phpcs.xml'
            },
            src: [
                '<%= files_php %>'
            ]
        },
        jshint: {
            options: {
                jshintrc: true,
                reporterOutput: 'logs/jslogs.log'
            },
            all: [
                '<%= files_js %>'
            ]
        },
        pot_config: '<%= pkg.pot %>',
        makepot: {
            target: {
                options: {
                    mainFile: 'post-expirator.php',
                    type: 'wp-plugin',
                    exclude: ['/vendor'],
                    updateTimestamp: false,
                    processPot: function( pot, options ) {
                        // https://github.com/cedaro/grunt-wp-i18n/blob/develop/docs/examples/remove-package-metadata.md
                        var translation,
                        excluded_meta = [
                            'Plugin Name of the plugin/theme',
                            'Plugin URI of the plugin/theme',
                            'Author of the plugin/theme',
                            'Author URI of the plugin/theme'
                        ];

                        for ( translation in pot.translations[''] ) {
                            if ( 'undefined' !== typeof pot.translations[''][ translation ].comments.extracted ) {
                                if ( excluded_meta.indexOf( pot.translations[''][ translation ].comments.extracted ) >= 0 ) {
                                    console.log( 'Excluded meta: ' + pot.translations[''][ translation ].comments.extracted );
                                    delete pot.translations[''][ translation ];
                                }
                            }
                        }

                        // additional
                        pot.headers['last-translator'] = grunt.config.get('pot_config').lasttranslator;
                        pot.headers['language-team'] = grunt.config.get('pot_config').languageteam;
                        delete pot.headers['lang-translator'];
                        delete pot.headers['x-generator'];
                        delete pot.headers['po-revision-date'];
                        return pot;
                    }
                }
            }
        }
    });

    // default tasks
    grunt.registerTask('default', ['mkdir', 'phpcbf', 'phpcs', 'phplint', 'jshint', 'makepot']);

};