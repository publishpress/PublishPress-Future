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
show_header "WordPress installation"
wp core is-installed || wp core install --url="$1" --title="$2" --admin_user="admin" --admin_password="admin" --admin_email="test@example.com" --skip-email

# Make sure WP is updated
show_header "Updating WordPress"
wp core update

# Make sure the database is up to date
show_header "Updating the database"
wp core update-db;

# Make sure all plugins are updated
show_header "Updating all plugins"
wp plugin update --all

# Make sure all themes are updated
show_header "Updating all themes"
wp theme update --all

# Install Classic Editor
show_header "Installing Classic Editor"
wp plugin install classic-editor --activate

# Install WP Mail SMTP
show_header "Installing WP Mail SMTP"
wp plugin install wp-mail-smtp --activate

# Activate Future Free
show_header "Activating Future Free"
wp plugin activate post-expirator

# Bypass admin email verification
wp option update admin_email_lifespan 2060442225 && echo -e "\e[32mAdmin email verification bypassed\e[0m";

# Update WP Mail SMTP options
wp db import /tmp/options.sql && echo -e "\e[32mWP Mail SMTP options updated\e[0m";

# Dump the database
show_header "Dumping the database"
wp db export /var/www/html/dump.sql && echo -e "\e[32mDatabase dump saved to /var/www/html/dump.sql\e[0m";

# Send test email
show_header "Sending test email"
wp eval "wp_mail(\"test@example.com\", \"Test Email from WP-CLI Installer\", \"This is a test email sent from the WordPress CLI installer script to verify SMTP settings and server connectivity.\");"
echo -e "\e[32mTest email sent\e[0m";
