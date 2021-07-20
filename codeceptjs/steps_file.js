
const loginDefaults = {
  url: '/wp-admin',
  username: 'wordpress1',
  password: 'wordpress1',
};

module.exports = function() {
  return actor({
    login: function login(options = {}) {
      const params = Object.assign({}, loginDefaults, options);
      this.amOnPage(params.url);
      this.fillField('#user_login', params.username);
      this.fillField('#user_pass', params.password);
      this.click('#wp-submit');
      this.waitForNavigation();
      this.waitForElement('#wp-toolbar');
    },

  });
}
