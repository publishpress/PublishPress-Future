<?php

/**
 * The class that is responsible for all the displays.
 */
class PostExpirator_Display {

	/**
	 * The singleton instance.
	 */
	private static $_instance = null;

	/**
	 * Constructor.
	 */
	private function __construct() {
		$this->hooks();
	}

	/**
	 * Returns instance of the singleton.
	 */
	public static function getInstance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	/**
	 * Initialize the hooks.
	 */
	private function hooks() {
		add_action( 'admin_menu', array( $this, 'add_menu' ) );
	}

	/**
	 * Add plugin page menu.
	 */
	function add_menu() {
		add_submenu_page( 'options-general.php', __( 'Post Expirator Options', 'post-expirator' ), __( 'Post Expirator', 'post-expirator' ), 'manage_options', POSTEXPIRATOR_BASENAME, array( self::$_instance, 'settings_tabs' ) );
	}

	/**
	 * Loads the specified tab.
	 */
	public function load_tab( $tab ) {
		switch ( $tab ) {
			case 'general':
				$this->menu_general();
				break;
			case 'defaults':
				$this->menu_defaults();
				break;
			case 'diagnostics':
				$this->menu_diagnostics();
				break;
			case 'viewdebug':
				$this->menu_viewdebug();
				break;
		}
	}

	/**
	 * Creates the settings page.
	 */
	public function settings_tabs() {
		PostExpirator_Facade::load_assets( 'settings' );

		$tab = isset( $_GET['tab'] ) ? $_GET['tab'] : '';
		if ( empty( $tab ) ) {
			$tab = 'general';
		}

		$tab_index = 0;

		ob_start();

		switch ( $tab ) {
			case 'general':
				$tab_index = 0;
				$this->load_tab( 'general' );
				break;
			case 'defaults':
				$this->load_tab( 'defaults' );
				$tab_index = 1;
				break;
			case 'diagnostics':
				$this->load_tab( 'diagnostics' );
				$tab_index = 2;
				break;
			case 'viewdebug':
				$this->load_tab( 'viewdebug' );
				$tab_index = 3;
				break;
		}

		$html = ob_get_clean();

		$debug = postexpirator_debug(); // check for/load debug

		$tabs = array( 'general', 'defaults', 'diagnostics' );
		if ( POSTEXPIRATOR_DEBUG ) {
			$tabs[] = 'viewdebug';
		}

		echo '
			<div class="wrap">
				<h2>' . __( 'Post Expirator Options', 'post-expirator' ) . '</h2>
				<div id="pe-settings-tabs">
					<ul>
						<li data-href="' . admin_url( 'options-general.php?page=post-expirator.php&tab=general' ) . '"><a href="#tab-general" class="pe-tab">' . __( 'General Settings', 'post-expirator' ) . '</a></li>
						<li data-href="' . admin_url( 'options-general.php?page=post-expirator.php&tab=defaults' ) . '"><a href="#tab-defaults" class="pe-tab">' . __( 'Post Types', 'post-expirator' ) . '</a></li>
						<li data-href="' . admin_url( 'options-general.php?page=post-expirator.php&tab=diagnostics' ) . '"><a href="#tab-diagnostics" class="pe-tab">' . __( 'Diagnostics', 'post-expirator' ) . '</a></li>
		';
		if ( POSTEXPIRATOR_DEBUG ) {
			echo '<li data-href="' . admin_url( 'options-general.php?page=post-expirator.php&tab=viewdebug' ) . '"><a href="#tab-viewdebug" class="pe-tab">' . __( 'View Debug Logs', 'post-expirator' ) . '</a></li>';
		}
		echo '</ul>';

		foreach ( $tabs as $t ) {
			echo '<div id="tab-' . $t . '">' . ( $t === $tab ? $html : ( __( 'Loading', 'post-expirator' ) . '...' ) ) . '</div>';
		}
		echo '
				</div>
				<input type="hidden" id="pe-current-tab" value="' . $tab_index . '">
		</div>';
	}

	/**
	 * Diagnostics menu.
	 */
	private function menu_diagnostics() {
		if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
			if ( ! isset( $_POST['_postExpiratorMenuDiagnostics_nonce'] ) || ! wp_verify_nonce( $_POST['_postExpiratorMenuDiagnostics_nonce'], 'postexpirator_menu_diagnostics' ) ) {
				print 'Form Validation Failure: Sorry, your nonce did not verify.';
				exit;
			}
			if ( isset( $_POST['debugging-disable'] ) ) {
				update_option( 'expirationdateDebug', 0 );
						echo "<div id='message' class='updated fade'><p>";
				_e( 'Debugging Disabled', 'post-expirator' );
				echo '</p></div>';
			} elseif ( isset( $_POST['debugging-enable'] ) ) {
				update_option( 'expirationdateDebug', 1 );
						echo "<div id='message' class='updated fade'><p>";
				_e( 'Debugging Enabled', 'post-expirator' );
				echo '</p></div>';
			} elseif ( isset( $_POST['purge-debug'] ) ) {
				require_once( plugin_dir_path( __FILE__ ) . 'post-expirator-debug.php' );
				$debug = new PostExpiratorDebug();
				$debug->purge();
						echo "<div id='message' class='updated fade'><p>";
				_e( 'Debugging Table Emptied', 'post-expirator' );
				echo '</p></div>';
			}
		}

		$debug = postexpirator_debug();
		?>
			<form method="post" id="postExpiratorMenuUpgrade">
					<?php wp_nonce_field( 'postexpirator_menu_diagnostics', '_postExpiratorMenuDiagnostics_nonce' ); ?>
					<h3><?php _e( 'Advanced Diagnostics', 'post-expirator' ); ?></h3>
					<table class="form-table">
							<tr valign="top">
									<th scope="row"><label for="postexpirator-log"><?php _e( 'Debug Logging', 'post-expirator' ); ?></label></th>
									<td>
						<?php
						if ( POSTEXPIRATOR_DEBUG ) {
							echo '
								<input type="submit" class="button" name="debugging-disable" id="debugging-disable" value="(' . __( 'Status: Enabled', 'post-expirator' ) . ') ' . __( 'Disable Debugging', 'post-expirator' ) . '" />
								<br/><a href="' . admin_url( 'options-general.php?page=post-expirator.php&tab=viewdebug' ) . '">' . __( 'View Debug Logs', 'post-expirator' ) . '</a>';
						} else {
							echo '<input type="submit" class="button" name="debugging-enable" id="debugging-enable" value="(' . __( 'Status: Disabled', 'post-expirator' ) . ') ' . __( 'Enable Debugging', 'post-expirator' ) . '" />';
						}
						?>
									</td>
							</tr>
							<tr valign="top">
									<th scope="row"><?php _e( 'Purge Debug Log', 'post-expirator' ); ?></th>
									<td>
						<input type="submit" class="button" name="purge-debug" id="purge-debug" value="<?php _e( 'Purge Debug Log', 'post-expirator' ); ?>" />
					</td>
				</tr/>
							<tr valign="top">
									<th scope="row"><?php _e( 'WP-Cron Status', 'post-expirator' ); ?></th>
									<td>
						<?php
						if ( defined( 'DISABLE_WP_CRON' ) && DISABLE_WP_CRON === true ) {
							_e( 'DISABLED', 'post-expirator' );
						} else {
							_e( 'ENABLED - OK', 'post-expirator' );
						}
						?>
					</td>
				</tr/>
							<tr valign="top">
									<th scope="row"><label for="cron-schedule"><?php _e( 'Current Cron Schedule', 'post-expirator' ); ?></label></th>
									<td>
										<p><?php _e( 'The below table will show all currently scheduled cron events with the next run time.', 'post-expirator' ); ?></p>

						<div class="pe-scroll">
						<table cellspacing="0" class="striped">
							<tr>
								<th style="width: 30%"><?php _e( 'Date', 'post-expirator' ); ?></th>
								<th style="width: 30%;"><?php _e( 'Event', 'post-expirator' ); ?></th>
								<th style="width: 30%;"><?php _e( 'Arguments / Schedule', 'post-expirator' ); ?></th>
							</tr>
						<?php
						$cron = _get_cron_array();
						foreach ( $cron as $key => $value ) {
							foreach ( $value as $eventkey => $eventvalue ) {
								$class = $eventkey === 'postExpiratorExpire' ? 'pe-event' : '';
								print '<tr class="' . $class . '">';
								print '<td>' . date_i18n( 'r', $key ) . '</td>';
								print '<td>' . $eventkey . '</td>';
								$arrkey = array_keys( $eventvalue );
								print '<td>';
								foreach ( $arrkey as $eventguid ) {
									print '<table><tr>';
									if ( empty( $eventvalue[ $eventguid ]['args'] ) ) {
										print '<td>' . __( 'No Arguments', 'post-expirator' ) . '</td>';
									} else {
										print '<td>';
										$args = array();
										foreach ( $eventvalue[ $eventguid ]['args'] as $key => $value ) {
											$args[] = "$key => $value";
										}
										print implode( "<br/>\n", $args );
										print '</td>';
									}
									if ( empty( $eventvalue[ $eventguid ]['schedule'] ) ) {
										print '<td>' . __( 'Single Event', 'post-expirator' ) . '</td>';
									} else {
										print '<td>' . $eventvalue[ $eventguid ]['schedule'] . ' (' . $eventvalue[ $eventguid ]['interval'] . ')</td>';
									}
									print '</tr></table>';
								}
								print '</td>';
								print '</tr>';
							}
						}
						?>
						</table>
						</div>
									</td>
							</tr>
					</table>
			</form>
		<?php
	}

	/**
	 * Debug menu.
	 */
	private function menu_viewdebug() {
		require_once POSTEXPIRATOR_BASEDIR . '/post-expirator-debug.php';
		print '<p>' . __( 'Below is a dump of the debugging table, this should be useful for troubleshooting.', 'post-expirator' ) . '</p>';
		$debug = new PostExpiratorDebug();
		$debug->getTable();
	}

	/**
	 * The default menu.
	 */
	private function menu_defaults() {
		$debug = postexpirator_debug();
		$types = postexpirator_get_post_types();

		if ( isset( $_POST['expirationdateSaveDefaults'] ) ) {
			if ( ! isset( $_POST['_postExpiratorMenuDefaults_nonce'] ) || ! wp_verify_nonce( $_POST['_postExpiratorMenuDefaults_nonce'], 'postexpirator_menu_defaults' ) ) {
				print 'Form Validation Failure: Sorry, your nonce did not verify.';
				exit;
			} else {
				// Filter Content
				$_POST = filter_input_array( INPUT_POST, FILTER_SANITIZE_STRING );

				$defaults = array();
				foreach ( $types as $type ) {
					if ( isset( $_POST[ 'expirationdate_expiretype-' . $type ] ) ) {
						$defaults[ $type ]['expireType'] = $_POST[ 'expirationdate_expiretype-' . $type ];
					}
					if ( isset( $_POST[ 'expirationdate_autoenable-' . $type ] ) ) {
						$defaults[ $type ]['autoEnable'] = intval( $_POST[ 'expirationdate_autoenable-' . $type ] );
					}
					if ( isset( $_POST[ 'expirationdate_taxonomy-' . $type ] ) ) {
						$defaults[ $type ]['taxonomy'] = $_POST[ 'expirationdate_taxonomy-' . $type ];
					}
					if ( isset( $_POST[ 'expirationdate_activemeta-' . $type ] ) ) {
						$defaults[ $type ]['activeMetaBox'] = $_POST[ 'expirationdate_activemeta-' . $type ];
					}
					$defaults[ $type ]['emailnotification'] = trim( $_POST[ 'expirationdate_emailnotification-' . $type ] );

					// Save Settings
					update_option( 'expirationdateDefaults' . ucfirst( $type ), $defaults[ $type ] );
				}
				echo "<div id='message' class='updated fade'><p>";
				_e( 'Saved Options!', 'post-expirator' );
				echo '</p></div>';
			}
		}

		?>
			<form method="post">
				<?php wp_nonce_field( 'postexpirator_menu_defaults', '_postExpiratorMenuDefaults_nonce' ); ?>
				<h3><?php _e( 'Default Expiration Values', 'post-expirator' ); ?></h3>

				<p><?php _e( 'Use the values below to set the default actions/values to be used for each for the corresponding post types.  These values can all be overwritten when creating/editing the post/page.', 'post-expirator' ); ?></p>
			
			<?php
			foreach ( $types as $type ) {
				$post_type_object = get_post_type_object( $type );
				echo '<fieldset>';
				echo "<legend>&nbsp;{$post_type_object->labels->singular_name}&nbsp;</legend>";
				$defaults = get_option( 'expirationdateDefaults' . ucfirst( $type ) );

				// phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
				if ( isset( $defaults['autoEnable'] ) && $defaults['autoEnable'] == 1 ) {
					$expiredautoenabled = 'checked = "checked"';
					$expiredautodisabled = '';
				} else {
					$expiredautoenabled = '';
					$expiredautodisabled = 'checked = "checked"';
				}
				if ( isset( $defaults['activeMetaBox'] ) && $defaults['activeMetaBox'] === 'inactive' ) {
					$expiredactivemetaenabled = '';
					$expiredactivemetadisabled = 'checked = "checked"';
				} else {
					$expiredactivemetaenabled = 'checked = "checked"';
					$expiredactivemetadisabled = '';
				}
				if ( ! isset( $defaults['taxonomy'] ) ) {
					$defaults['taxonomy'] = false;
				}
				if ( ! isset( $defaults['emailnotification'] ) ) {
					$defaults['emailnotification'] = '';
				}
				?>
				<table class="form-table">
					<tr valign="top">
						<th scope="row"><label for="expirationdate_activemeta-<?php echo $type; ?>"><?php _e( 'Active', 'post-expirator' ); ?></label></th>
						<td>
							<input type="radio" name="expirationdate_activemeta-<?php echo $type; ?>" id="expirationdate_activemeta-true-<?php echo $type; ?>" value="active" <?php echo $expiredactivemetaenabled; ?>/> <label for="expired-active-meta-true"><?php _e( 'Active', 'post-expirator' ); ?></label>
							&nbsp;&nbsp;
							<input type="radio" name="expirationdate_activemeta-<?php echo $type; ?>" id="expirationdate_activemeta-false-<?php echo $type; ?>" value="inactive" <?php echo $expiredactivemetadisabled; ?>/> <label for="expired-active-meta-false"><?php _e( 'Inactive', 'post-expirator' ); ?></label>
							<p class="description"><?php _e( 'Select whether the post expirator meta box is active for this post type.', 'post-expirator' ); ?></p>
						</td>
					</tr>
					<tr valign="top">
						<th scope="row"><label for="expirationdate_expiretype-<?php echo $type; ?>"><?php _e( 'How to expire', 'post-expirator' ); ?></label></th>
						<td>
							<?php echo _postexpirator_expire_type( array('name' => 'expirationdate_expiretype-' . $type, 'selected' => $defaults['expireType']) ); ?>
							<p class="description"><?php _e( 'Select the default expire action for the post type.', 'post-expirator' ); ?></p>
						</td>
					</tr>
					<tr valign="top">
						<th scope="row"><label for="expirationdate_autoenable-<?php echo $type; ?>"><?php _e( 'Auto-Enable?', 'post-expirator' ); ?></label></th>
						<td>
							<input type="radio" name="expirationdate_autoenable-<?php echo $type; ?>" id="expirationdate_autoenable-true-<?php echo $type; ?>" value="1" <?php echo $expiredautoenabled; ?>/> <label for="expired-auto-enable-true"><?php _e( 'Enabled', 'post-expirator' ); ?></label>
							&nbsp;&nbsp;
							<input type="radio" name="expirationdate_autoenable-<?php echo $type; ?>" id="expirationdate_autoenable-false-<?php echo $type; ?>" value="0" <?php echo $expiredautodisabled; ?>/> <label for="expired-auto-enable-false"><?php _e( 'Disabled', 'post-expirator' ); ?></label>
							<p class="description"><?php _e( 'Select whether the post expirator is enabled for all new posts.', 'post-expirator' ); ?></p>
						</td>
					</tr>
					<tr valign="top">
						<th scope="row"><label for="expirationdate_taxonomy-<?php echo $type; ?>"><?php _e( 'Taxonomy (hierarchical)', 'post-expirator' ); ?></label></th>
						<td>
							<?php echo _postexpirator_taxonomy( array('type' => $type, 'name' => 'expirationdate_taxonomy-' . $type, 'selected' => $defaults['taxonomy']) ); ?>
						</td>
					</tr>
					<tr valign="top">
						<th scope="row"><label for="expirationdate_emailnotification-<?php echo $type; ?>"><?php _e( 'Who to notify', 'post-expirator' ); ?></label></th>
						<td>
							<input class="large-text" type="text" name="expirationdate_emailnotification-<?php echo $type; ?>" id="expirationdate_emailnotification-<?php echo $type; ?>" value="<?php echo $defaults['emailnotification']; ?>" />
							<p class="description"><?php _e( 'Enter a comma separate list of emails that you would like to be notified when the post expires.', 'post-expirator' ); ?></p>
						</td>
					</tr>

				</table>
				</fieldset>
				<?php
			}
			?>
					<p class="submit">
							<input type="submit" name="expirationdateSaveDefaults" class="button-primary" value="<?php _e( 'Save Changes', 'post-expirator' ); ?>" />
					</p>
			</form>
		<?php
	}

	/**
	 * Show the Expiration Date options page
	 */
	private function menu_general() {
		if ( isset( $_POST['expirationdateSave'] ) && $_POST['expirationdateSave'] ) {
			if ( ! isset( $_POST['_postExpiratorMenuGeneral_nonce'] ) || ! wp_verify_nonce( $_POST['_postExpiratorMenuGeneral_nonce'], 'postexpirator_menu_general' ) ) {
				print 'Form Validation Failure: Sorry, your nonce did not verify.';
				exit;
			} else {
				// Filter Content
				$_POST = filter_input_array( INPUT_POST, FILTER_SANITIZE_STRING );

				update_option( 'expirationdateDefaultDateFormat', $_POST['expired-default-date-format'] );
				update_option( 'expirationdateDefaultTimeFormat', $_POST['expired-default-time-format'] );
				update_option( 'expirationdateDisplayFooter', $_POST['expired-display-footer'] );
				update_option( 'expirationdateEmailNotification', $_POST['expired-email-notification'] );
				update_option( 'expirationdateEmailNotificationAdmins', $_POST['expired-email-notification-admins'] );
				update_option( 'expirationdateEmailNotificationList', trim( $_POST['expired-email-notification-list'] ) );
				update_option( 'expirationdateFooterContents', $_POST['expired-footer-contents'] );
				update_option( 'expirationdateFooterStyle', $_POST['expired-footer-style'] );
				update_option( 'expirationdateGutenbergSupport', $_POST['gutenberg-support'] );
				if ( isset( $_POST['expirationdate_category'] ) ) {
					update_option( 'expirationdateCategoryDefaults', $_POST['expirationdate_category'] );
				}
				update_option( 'expirationdateDefaultDate', $_POST['expired-default-expiration-date'] );
				if ( $_POST['expired-custom-expiration-date'] ) {
					update_option( 'expirationdateDefaultDateCustom', $_POST['expired-custom-expiration-date'] );
				}
						echo "<div id='message' class='updated fade'><p>";
						_e( 'Saved Options!', 'post-expirator' );
						echo '</p></div>';
			}
		}

		// phpcs:disable WordPress.NamingConventions.ValidVariableName.InterpolatedVariableNotSnakeCase
		// phpcs:disable WordPress.PHP.StrictComparisons.LooseComparison

		// Get Option
		$expirationdateDefaultDateFormat = get_option( 'expirationdateDefaultDateFormat', POSTEXPIRATOR_DATEFORMAT );
		$expirationdateDefaultTimeFormat = get_option( 'expirationdateDefaultTimeFormat', POSTEXPIRATOR_TIMEFORMAT );
		$expireddisplayfooter = get_option( 'expirationdateDisplayFooter', POSTEXPIRATOR_FOOTERDISPLAY );
		$expiredemailnotification = get_option( 'expirationdateEmailNotification', POSTEXPIRATOR_EMAILNOTIFICATION );
		$expiredemailnotificationadmins = get_option( 'expirationdateEmailNotificationAdmins', POSTEXPIRATOR_EMAILNOTIFICATIONADMINS );
		$expiredemailnotificationlist = get_option( 'expirationdateEmailNotificationList', '' );
		$expirationdateFooterContents = get_option( 'expirationdateFooterContents', POSTEXPIRATOR_FOOTERCONTENTS );
		$expirationdateFooterStyle = get_option( 'expirationdateFooterStyle', POSTEXPIRATOR_FOOTERSTYLE );
		$expirationdateDefaultDate = get_option( 'expirationdateDefaultDate', POSTEXPIRATOR_EXPIREDEFAULT );
		$expirationdateDefaultDateCustom = get_option( 'expirationdateDefaultDateCustom' );

		$categories = get_option( 'expirationdateCategoryDefaults' );

		$expireddisplayfooterenabled = '';
		$expireddisplayfooterdisabled = '';
		if ( $expireddisplayfooter == 0 ) {
			$expireddisplayfooterdisabled = 'checked="checked"';
		} elseif ( $expireddisplayfooter == 1 ) {
			$expireddisplayfooterenabled = 'checked="checked"';
		}

		$expiredemailnotificationenabled = '';
		$expiredemailnotificationdisabled = '';
		if ( $expiredemailnotification == 0 ) {
			$expiredemailnotificationdisabled = 'checked="checked"';
		} elseif ( $expiredemailnotification == 1 ) {
			$expiredemailnotificationenabled = 'checked="checked"';
		}

		$expiredemailnotificationadminsenabled = '';
		$expiredemailnotificationadminsdisabled = '';
		if ( $expiredemailnotificationadmins == 0 ) {
			$expiredemailnotificationadminsdisabled = 'checked="checked"';
		} elseif ( $expiredemailnotificationadmins == 1 ) {
			$expiredemailnotificationadminsenabled = 'checked="checked"';
		}
		?>

		<p><?php _e( 'The post expirator plugin sets a custom meta value, and then optionally allows you to select if you want the post changed to a draft status or deleted when it expires.', 'post-expirator' ); ?></p>

		<h3><?php _e( 'Shortcode', 'post-expirator' ); ?></h3>
		<p><?php echo sprintf( __( 'Valid %s attributes:', 'post-expirator' ), '<code>[postexpirator]</code>' ); ?></p>
		<ul class="pe-list">
			<li><p><?php echo sprintf( __( '%1$s - valid options are %2$sfull%3$s (default), %4$sdate%5$s, %6$stime%7$s', 'post-expirator' ), '<code>type</code>', '<code>', '</code>', '<code>', '</code>', '<code>', '</code>' ); ?></p></li>
			<li><p><?php echo sprintf( __( '%s - format set here will override the value set on the settings page', 'post-expirator' ), '<code>dateformat</code>' ); ?></p></li>
			<li><p><?php echo sprintf( __( '%s - format set here will override the value set on the settings page', 'post-expirator' ), '<code>timeformat</code>' ); ?></p></li>
		</ul>
		<hr/>

		<form method="post" id="expirationdate_save_options">
			<?php wp_nonce_field( 'postexpirator_menu_general', '_postExpiratorMenuGeneral_nonce' ); ?>
			<h3><?php _e( 'Defaults', 'post-expirator' ); ?></h3>
			<table class="form-table">
				<tr valign="top">
					<th scope="row"><label for="expired-default-date-format"><?php _e( 'Date Format', 'post-expirator' ); ?></label></th>
					<td>
						<input type="text" name="expired-default-date-format" id="expired-default-date-format" value="<?php echo $expirationdateDefaultDateFormat; ?>" size="25" /> <span class="description">(<?php echo date_i18n( "$expirationdateDefaultDateFormat" ); ?>)</span>
						<p class="description"><?php echo sprintf( __( 'The default format to use when displaying the expiration date within a post using the shortcode or within the footer.  For information on valid formatting options, see: %s.', 'post-expirator' ), '<a href="http://us2.php.net/manual/en/function.date.php" target="_blank">PHP Date Function</a>' ); ?></p>
					</td>
				</tr>
				<tr valign="top">
					<th scope="row"><label for="expired-default-time-format"><?php _e( 'Time Format', 'post-expirator' ); ?></label></th>
					<td>
						<input type="text" name="expired-default-time-format" id="expired-default-time-format" value="<?php echo $expirationdateDefaultTimeFormat; ?>" size="25" /> <span class="description">(<?php echo date_i18n( "$expirationdateDefaultTimeFormat" ); ?>)</span>
						<p class="description"><?php echo sprintf( __( 'The default format to use when displaying the expiration time within a post using the shortcode or within the footer.  For information on valid formatting options, see: %s.', 'post-expirator' ), '<a href="http://us2.php.net/manual/en/function.date.php" target="_blank">PHP Date Function</a>' ); ?>
					</td>
				</tr>
				<tr valign="top">
					<th scope="row"><label for="expired-default-expiration-date"><?php _e( 'Default Date/Time Duration', 'post-expirator' ); ?></label></th>
					<td>
						<select name="expired-default-expiration-date" id="expired-default-expiration-date" onchange="expirationdate_toggle_defaultdate(this)">
							<option value="null" <?php echo ( $expirationdateDefaultDate == 'null' ) ? ' selected="selected"' : ''; ?>><?php _e( 'None', 'post-expirator' ); ?></option>
							<option value="custom" <?php echo ( $expirationdateDefaultDate == 'custom' ) ? ' selected="selected"' : ''; ?>><?php _e( 'Custom', 'post-expirator' ); ?></option>
							<option value="publish" <?php echo ( $expirationdateDefaultDate == 'publish' ) ? ' selected="selected"' : ''; ?>><?php _e( 'Post/Page Publish Time', 'post-expirator' ); ?></option>
						</select>
						<p class="description"><?php _e( 'Set the default expiration date to be used when creating new posts and pages.  Defaults to none.', 'post-expirator' ); ?></p>
						<?php $show = ( $expirationdateDefaultDate == 'custom' ) ? 'block' : 'none'; ?>
						<div id="expired-custom-container" style="display: <?php echo $show; ?>;">
						<br/>
						<label for="expired-custom-expiration-date">Custom:</label>
						<input type="text" value="<?php echo $expirationdateDefaultDateCustom; ?>" name="expired-custom-expiration-date" id="expired-custom-expiration-date" />
						<p class="description"><?php echo sprintf( __( 'Set the custom value to use for the default expiration date.  For information on formatting, see %1$s. For example, you could enter %2$s+1 month%3$s or %4$s+1 week 2 days 4 hours 2 seconds%5$s or %6$snext Thursday%7$s.', 'post-expirator' ), '<a href="http://php.net/manual/en/function.strtotime.php" target="_new">PHP strtotime function</a>', '<code>', '</code>', '<code>', '</code>', '<code>', '</code>' ); ?></p>
						</div>
					</td>
				</tr>
				<tr valign="top">
					<th scope="row"><?php _e( 'Default Expiration Category', 'post-expirator' ); ?></th>
					<td>
			<?php
					echo '<div class="wp-tab-panel" id="post-expirator-cat-list">';
					echo '<ul id="categorychecklist" class="list:category categorychecklist form-no-clear">';
					$walker = new Walker_PostExpirator_Category_Checklist();
					wp_terms_checklist( 0, array( 'taxonomy' => 'category', 'walker' => $walker, 'selected_cats' => $categories, 'checked_ontop' => false ) );
					echo '</ul>';
					echo '</div>';
			?>
						<p class="description"><?php _e( 'Sets the default expiration category for the post.', 'post-expirator' ); ?></p>
					</td>
				</tr>
			</table>

			<h3><?php _e( 'Expiration Email Notification', 'post-expirator' ); ?></h3>
			<p class="description"><?php _e( 'Whenever a post expires, an email can be sent to alert users of the expiration.', 'post-expirator' ); ?></p>
			<table class="form-table">
				<tr valign="top">
					<th scope="row"><?php _e( 'Enable Email Notification?', 'post-expirator' ); ?></th>
					<td>
						<input type="radio" name="expired-email-notification" id="expired-email-notification-true" value="1" <?php echo $expiredemailnotificationenabled; ?>/> <label for="expired-email-notification-true"><?php _e( 'Enabled', 'post-expirator' ); ?></label>
						&nbsp;&nbsp;
						<input type="radio" name="expired-email-notification" id="expired-email-notification-false" value="0" <?php echo $expiredemailnotificationdisabled; ?>/> <label for="expired-email-notification-false"><?php _e( 'Disabled', 'post-expirator' ); ?></label>
						<p class="description"><?php _e( 'This will enable or disable the send of email notification on post expiration.', 'post-expirator' ); ?></p>
					</td>
				</tr>
				<tr valign="top">
					<th scope="row"><?php _e( 'Include Blog Administrators?', 'post-expirator' ); ?></th>
					<td>
						<input type="radio" name="expired-email-notification-admins" id="expired-email-notification-admins-true" value="1" <?php echo $expiredemailnotificationadminsenabled; ?>/> <label for="expired-email-notification-admins-true"><?php _e( 'Enabled', 'post-expirator' ); ?></label>
						&nbsp;&nbsp;
						<input type="radio" name="expired-email-notification-admins" id="expired-email-notification-admins-false" value="0" <?php echo $expiredemailnotificationadminsdisabled; ?>/> <label for="expired-email-notification-admins-false"><?php _e( 'Disabled', 'post-expirator' ); ?></label>
						<p class="description"><?php _e( 'This will include all users with the role of "Administrator" in the post expiration email.', 'post-expirator' ); ?></p>
					</td>
				</tr>
				<tr valign="top">
					<th scope="row"><label for="expired-email-notification-list"><?php _e( 'Who to notify', 'post-expirator' ); ?></label></th>
					<td>
						<input class="large-text" type="text" name="expired-email-notification-list" id="expired-email-notification-list" value="<?php echo $expiredemailnotificationlist; ?>" />
						<p class="description"><?php _e( 'Enter a comma separate list of emails that you would like to be notified when the post expires.  This will be applied to ALL post types.  You can set post type specific emails on the Defaults tab.', 'post-expirator' ); ?></p>
					</td>
				</tr>
			</table>

			<h3><?php _e( 'Post Footer Display', 'post-expirator' ); ?></h3>
			<p class="description"><?php _e( 'Enabling this below will display the expiration date automatically at the end of any post which is set to expire.', 'post-expirator' ); ?></p>
			<table class="form-table">
				<tr valign="top">
					<th scope="row"><?php _e( 'Show in post footer?', 'post-expirator' ); ?></th>
					<td>
						<input type="radio" name="expired-display-footer" id="expired-display-footer-true" value="1" <?php echo $expireddisplayfooterenabled; ?>/> <label for="expired-display-footer-true"><?php _e( 'Enabled', 'post-expirator' ); ?></label>
						&nbsp;&nbsp;
						<input type="radio" name="expired-display-footer" id="expired-display-footer-false" value="0" <?php echo $expireddisplayfooterdisabled; ?>/> <label for="expired-display-footer-false"><?php _e( 'Disabled', 'post-expirator' ); ?></label>
						<p class="description"><?php _e( 'This will enable or disable displaying the post expiration date in the post footer.', 'post-expirator' ); ?></p>
					</td>
				</tr>
				<tr valign="top">
					<th scope="row"><label for="expired-footer-contents"><?php _e( 'Footer Contents', 'post-expirator' ); ?></label></th>
					<td>
						<textarea id="expired-footer-contents" name="expired-footer-contents" rows="3" cols="50"><?php echo $expirationdateFooterContents; ?></textarea>
						<p class="description"><?php _e( 'Enter the text you would like to appear at the bottom of every post that will expire.  The following placeholders will be replaced with the post expiration date in the following format:', 'post-expirator' ); ?></p>
						<ul class="pe-list">
							<li><p class="description">EXPIRATIONFULL -> <?php echo date_i18n( "$expirationdateDefaultDateFormat $expirationdateDefaultTimeFormat" ); ?></p></li>
							<li><p class="description">EXPIRATIONDATE -> <?php echo date_i18n( "$expirationdateDefaultDateFormat" ); ?></p></li>
							<li><p class="description">EXPIRATIONTIME -> <?php echo date_i18n( "$expirationdateDefaultTimeFormat" ); ?></p></li>
						</ul>
					</td>
				</tr>
				<tr valign="top">
					<th scope="row"><label for="expired-footer-style"><?php _e( 'Footer Style', 'post-expirator' ); ?></label></th>
					<td>
						<input type="text" name="expired-footer-style" id="expired-footer-style" value="<?php echo $expirationdateFooterStyle; ?>" size="25" />
						(<span style="<?php echo $expirationdateFooterStyle; ?>"><?php _e( 'This post will expire on', 'post-expirator' ); ?> <?php echo date_i18n( "$expirationdateDefaultDateFormat $expirationdateDefaultTimeFormat" ); ?></span>)
						<p class="description"><?php _e( 'The inline css which will be used to style the footer text.', 'post-expirator' ); ?></p>
					</td>
				</tr>
			</table>

			<h3><?php _e( 'Advanced Options', 'post-expirator' ); ?></h3>
			<p class="description"><?php _e( 'Please do not update anything here unless you know what it entails. For advanced users only.', 'post-expirator' ); ?></p>
			<?php
				$gutenberg = get_option( 'expirationdateGutenbergSupport', 1 );
			?>
			<table class="form-table">
				<tr valign="top">
					<th scope="row"><?php _e( 'Block Editor Support', 'post-expirator' ); ?></th>
					<td>
						<input type="radio" name="gutenberg-support" id="gutenberg-support-enabled" value="1" <?php echo intval( $gutenberg ) === 1 ? 'checked' : ''; ?>/> <label for="gutenberg-support-enabled"><?php _e( 'Show Gutenberg style box', 'post-expirator' ); ?></label>
						&nbsp;&nbsp;
						<input type="radio" name="gutenberg-support" id="gutenberg-support-disabled" value="0" <?php echo intval( $gutenberg ) === 0 ? 'checked' : ''; ?>/> <label for="gutenberg-support-disabled"><?php _e( 'Show Classic Editor style box', 'post-expirator' ); ?></label>
						<p class="description"><?php _e( 'Toggle between native support for the Block Editor or the backward compatible Classic Editor style metabox.', 'post-expirator' ); ?></p>
					</td>
				</tr>
			</table>

			<p class="submit">
				<input type="submit" name="expirationdateSave" class="button-primary" value="<?php _e( 'Save Changes', 'post-expirator' ); ?>" />
			</p>
	</form>
		<?php
		// phpcs:enable
	}

}
