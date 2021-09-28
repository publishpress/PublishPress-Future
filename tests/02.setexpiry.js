Before(({I, loginAs}) => {
    loginAs('user');
});

Feature('Set expiry on posts');

Scenario('Quick Edit', ({I}) => {
    I.amOnPage('/wp-admin/edit.php');

    // elements specific to the post
    I.seeElement(locate('td.expirationdate').first().withText('Never'));

    // interact
    I.click(locate('td.title').first());
    I.dontSeeCheckboxIsChecked('[name="enable-expirationdate"]');
    I.checkOption('[name="enable-expirationdate"]');
    I.seeCheckboxIsChecked('[name="enable-expirationdate"]');
    I.selectOption('[name="expirationdate_month"]', '05');
    I.fillField('[name="expirationdate_day"]', '13');
    I.fillField('[name="expirationdate_year"]', '2030');
    I.fillField('[name="expirationdate_hour"]', '13');
    I.fillField('[name="expirationdate_minute"]', '13');
    I.click({css: 'button.save'});

    // check if saved
    I.dontSeeElement(locate('td.expirationdate').first().withText('Never'));
    I.seeElement(locate('td.expirationdate').first().withText('May 13, 2030 1:13 pm'));

    // refresh and check
    I.amOnPage('/wp-admin/edit.php');
    I.seeElement(locate('td.expirationdate').first().withText('May 13, 2030 1:13 pm'));

});
