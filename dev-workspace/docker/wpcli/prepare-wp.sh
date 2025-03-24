#! /bin/bash

show_header() {
    echo "================================================"
    echo " $1"
    echo "================================================"
}

# Clean up the database
show_header "Cleaning up the database"
wp db reset --yes

# Install WordPress
show_header "Installing WordPress"
wp core install --url="http://localhost:60802" --title="Future Free - Test Site" --admin_user="admin" --admin_password="admin" --admin_email="test@example.com" --skip-email

# Delete default plugins
show_header "Deleting default plugins"
wp plugin delete akismet
wp plugin delete hello

# Install Classic Editor
show_header "Installing Classic Editor"
wp plugin install classic-editor --activate

# Install WP Mail SMTP
show_header "Installing WP Mail SMTP"
wp plugin install wp-mail-smtp --activate

# Activate Future Free
show_header "Activating Future Free"
wp plugin activate post-expirator

# Import data.sql.
show_header "Importing database data"
# The command `wp db import` is showing an error saying mysql is deprecated.
/usr/bin/mariadb --defaults-file=/tmp/my.cnf -h db -u testuser -ptestpass testdb < /tmp/options.sql
echo "Done"

# Send test email
show_header "Sending test email"
wp eval "wp_mail(\"test@example.com\", \"Test Email from WP-CLI Installer\", \"This is a test email sent from the WordPress CLI installer script to verify SMTP settings and server connectivity.\");"
echo "Done"
