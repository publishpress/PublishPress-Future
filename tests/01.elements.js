Before(({ I, loginAs }) => {
    loginAs('user');
});

Feature('Check if elements are enabled');

Scenario('Settings Page', ({ I }) => {
    I.amOnPage('/wp-admin/options-general.php?page=post-expirator.php');
    I.see('PublishPress Future Options');
});


Scenario('Post Listing', ({ I }) => {
    I.amOnPage('/wp-admin/edit.php');

    // general elements
    I.seeElement('th.column-expirationdate');
    I.seeElement('td.expirationdate');

    // interact and check for elements
    I.click( locate('td.title').first() );
    I.see( 'QUICK EDIT' );
    I.see( 'Enable Post Expiration' );
    I.see( 'Expires' );
    I.seeElement( 'button.save' );
    I.seeElement( '[name="enable-expirationdate"]' );
    I.seeElement( '[name="expirationdate_month"]' );
    I.seeElement( '[name="expirationdate_day"]' );
    I.seeElement( '[name="expirationdate_year"]' );
    I.seeElement( '[name="expirationdate_hour"]' );
    I.seeElement( '[name="expirationdate_minute"]' );

});
