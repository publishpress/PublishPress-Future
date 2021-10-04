exports.config = {
    tests: 'tests/*.js',
    output: './codeceptjs/output',
    helpers: {
        Playwright: {
            url: process.env.url || 'http://localhost:91',
            show: process.env.show !== 'false',
            browser: 'chromium',
            waitForAction: 500
        }
    },
    include: {
        I: './codeceptjs/steps_file.js'
    },
    bootstrap: null,
    mocha: {},
    name: 'PostExpirator',
    plugins: {
        pauseOnFail: {},
        retryFailedStep: {
            enabled: true
        },
        tryTo: {
            enabled: true
        },
        screenshotOnFail: {
            enabled: true
        },
        autoLogin: {
            enabled: true,
            saveToFile: true,
            inject: 'loginAs',
            users: {
                user: {
                    login: (I) => I.login(),
                    // if we see the toolbar on the page, we assume we are logged in
                    check: (I) => {
                        I.amOnPage('/wp-admin');
                        I.waitForElement('#wp-toolbar');
                    }
                }
            }
        }
    }
}
