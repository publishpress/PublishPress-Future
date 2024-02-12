<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'db.sqlite' );

/** Database username */
define( 'DB_USER', '' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', '' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '%KH>m^+]p7YG(aQ<|=1%!u3oFgy)*XK`h:qq:dJj`O@|hCdX:0}E9"%a[}(8=@P5' );
define( 'SECURE_AUTH_KEY',  '_g|,fgRAV=sQ.M-GmfwAB@%9"LBVnb{7Q(L}cT^a5//Khz=O`W2yeH0HXiI!o?P/' );
define( 'LOGGED_IN_KEY',    'E[pA]y]Fzt:%`y~(A.-5nl=g2R<G*nE/=46lNpovQrr0#`JQ$lvA/6".N?=EnyBd' );
define( 'NONCE_KEY',        'A|mMFSM?]Rw8oOS";eENK$VTVmK^_W#g+)fvD)T45(6;?AH>K~{Up;Yg$Nc&_9iW' );
define( 'AUTH_SALT',        'TfS+u}QGj;tre%L<g4FG`>mrl%OZFxxZC0}{,xAp]e>tm-DtTXXX}0+tasf;^*ll' );
define( 'SECURE_AUTH_SALT', 'Dp+hp9XUQ>.[-}5}s0i6T@IzAR]U|b4Bx`*Vk*nyXu{_osWcV<TL(^:gn[Yxvf`O' );
define( 'LOGGED_IN_SALT',   '|n2"msB^h/Xz8T,XfylID>j/<#.krJvijE}N"BACkqz5>ZZZZ0C_[8}UlHd[jlZw' );
define( 'NONCE_SALT',       'M<.4~jeoR)XkB12fL(y<^DV;H^"b0;|]YRhSARWsCW92C*Y>)>b9I?bt`Uzof$n.' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */

define( 'DB_DIR', __DIR__ . '/data' );
define( 'DB_FILE', 'db.sqlite' );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
