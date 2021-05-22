<?php
/*
Plugin Name: Post Expirator
Plugin URI: http://wordpress.org/extend/plugins/post-expirator/
Description: Allows you to add an expiration date (minute) to posts which you can configure to either delete the post, change it to a draft, or update the post categories at expiration time.
Author: Aaron Axelsen
Version: 2.4.1
Author URI: http://postexpirator.tuxdocs.net/
Text Domain: post-expirator
*/

/* Load translation, if it exists */
function postExpirator_init() {
	$plugin_dir = basename(dirname(__FILE__));
	load_plugin_textdomain( 'post-expirator', null, $plugin_dir.'/languages/' );
}
add_action('plugins_loaded', 'postExpirator_init');

// Default Values
define('POSTEXPIRATOR_VERSION','2.4.1');
define('POSTEXPIRATOR_DATEFORMAT',__('l F jS, Y','post-expirator'));
define('POSTEXPIRATOR_TIMEFORMAT',__('g:ia','post-expirator'));
define('POSTEXPIRATOR_FOOTERCONTENTS',__('Post expires at EXPIRATIONTIME on EXPIRATIONDATE','post-expirator'));
define('POSTEXPIRATOR_FOOTERSTYLE','font-style: italic;');
define('POSTEXPIRATOR_FOOTERDISPLAY','0');
define('POSTEXPIRATOR_EMAILNOTIFICATION','0');
define('POSTEXPIRATOR_EMAILNOTIFICATIONADMINS','0');
define('POSTEXPIRATOR_DEBUGDEFAULT','0');
define('POSTEXPIRATOR_EXPIREDEFAULT','null');

function postExpirator_plugin_action_links($links, $file) {
    $this_plugin = basename(plugin_dir_url(__FILE__)) . '/post-expirator.php';
    if($file == $this_plugin) {
        $links[] = '<a href="options-general.php?page=post-expirator">' . __('Settings', 'post-expirator') . '</a>';
    }
    return $links;
}
add_filter('plugin_action_links', 'postExpirator_plugin_action_links', 10, 2);

/**
 * Add admin notice hook if cron schedule needs to be reset
 */
add_action('admin_notices','postExpirationAdminNotice');
function postExpirationAdminNotice() {
	// Check if WP-Cron is Enabled
	#if (defined('DISABLE_WP_CRON') && DISABLE_WP_CRON === true) {
	#	$class = 'notice notice-error';
	#	$message = __( 'POST EXPIRATOR ERROR: WP-Cron is disabled on this server.  This plugin requires WP-Cron and will not function until it is corrected.','post-expirator');
	#	$message .= '<br/><br/>' . __( ' If you have manually configured cron click here to dismiss this message.', 'post-expirator' );
	#	printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), $message  );
	#}
}

/**
 * adds an 'Expires' column to the post display table.
 */
add_filter ('manage_posts_columns', 'expirationdate_add_column', 10, 2);
function expirationdate_add_column ($columns,$type) {
	$defaults = get_option('expirationdateDefaults'.ucfirst($type));
	if (!isset($defaults['activeMetaBox']) || $defaults['activeMetaBox'] == 'active') {
	  	$columns['expirationdate'] = __('Expires','post-expirator');
	}
  	return $columns;
}

add_action( 'init', 'init_managesortablecolumns', 100 );
function init_managesortablecolumns (){
    $post_types = get_post_types(array('public'=>true));
    foreach( $post_types as $post_type ){
        add_filter( 'manage_edit-' . $post_type . '_sortable_columns', 'expirationdate_sortable_column' );
    }
}
function expirationdate_sortable_column($columns) {
	$columns['expirationdate'] = 'expirationdate';
	return $columns;
}

add_action( 'pre_get_posts', 'my_expirationdate_orderby' );
function my_expirationdate_orderby( $query ) {
    	if( ! is_admin() )
        	return;

	$orderby = $query->get( 'orderby');

	if( 'expirationdate' == $orderby ) {
		$query->set('meta_query',array(
    			'relation'  => 'OR',
	    		array(
        			'key'       => '_expiration-date',
        			'compare'   => 'EXISTS'
	    		),
    			array(
        			'key'       => '_expiration-date',
        			'compare'   => 'NOT EXISTS',
	        		'value'     => ''
    			)
		));
        	$query->set('orderby','meta_value_num');
   	}
}

/**
 * adds an 'Expires' column to the page display table.
 */
add_filter ('manage_pages_columns', 'expirationdate_add_column_page');
function expirationdate_add_column_page ($columns) {
	$defaults = get_option('expirationdateDefaultsPage');
	if (!isset($defaults['activeMetaBox']) || $defaults['activeMetaBox'] == 'active') {
	  	$columns['expirationdate'] = __('Expires','post-expirator');
	}
  	return $columns;
}

/**
 * fills the 'Expires' column of the post display table.
 */
add_action ('manage_posts_custom_column', 'expirationdate_show_value');
add_action ('manage_pages_custom_column', 'expirationdate_show_value');
function expirationdate_show_value ($column_name) {
	global $post;
	$id = $post->ID;
	if ($column_name === 'expirationdate') {
		$ed = get_post_meta($id,'_expiration-date',true);
    		echo ($ed ? get_date_from_gmt(gmdate('Y-m-d H:i:s',$ed),get_option('date_format').' '.get_option('time_format')) : __("Never",'post-expirator'));

		//Values for Quick Edit
		if ($ed) {
			$year = get_date_from_gmt(gmdate('Y-m-d H:i:s',$ed),'Y');
			$month = get_date_from_gmt(gmdate('Y-m-d H:i:s',$ed),'m');
			$day = get_date_from_gmt(gmdate('Y-m-d H:i:s',$ed),'d');
			$hour = get_date_from_gmt(gmdate('Y-m-d H:i:s',$ed),'H');
			$minute = get_date_from_gmt(gmdate('Y-m-d H:i:s',$ed),'i');
			echo '<span id="expirationdate_year-'.$id.'" style="display: none;">'.$year.'</span>';
			echo '<span id="expirationdate_month-'.$id.'" style="display: none;">'.$month.'</span>';
			echo '<span id="expirationdate_day-'.$id.'" style="display: none;">'.$day.'</span>';
			echo '<span id="expirationdate_hour-'.$id.'" style="display: none;">'.$hour.'</span>';
			echo '<span id="expirationdate_minute-'.$id.'" style="display: none;">'.$minute.'</span>';
			echo '<span id="expirationdate_enabled-'.$id.'" style="display: none;">true</span>';
		} else {
			echo '<span id="expirationdate_year-'.$id.'" style="display: none;">'.date('Y').'</span>';
			echo '<span id="expirationdate_month-'.$id.'" style="display: none;">'.date('m').'</span>';
			echo '<span id="expirationdate_day-'.$id.'" style="display: none;">'.date('d').'</span>';
			echo '<span id="expirationdate_hour-'.$id.'" style="display: none;">'.date('H').'</span>';
			echo '<span id="expirationdate_minute-'.$id.'" style="display: none;">'.date('i').'</span>';
			echo '<span id="expirationdate_enabled-'.$id.'" style="display: none;">false</span>';
		}
  	}
}


add_action( 'quick_edit_custom_box', 'display_expirationdate_quickedit', 10, 2 );
function display_expirationdate_quickedit( $column_name, $post_type ) {
	if ($column_name != 'expirationdate') return;
    	?>
	<div style="clear:both"></div>
	<fieldset class="inline-edit-col-left post-expirator-quickedit">
		<div class="inline-edit-col">
		<div class="inline-edit-group">
		<span class="title">Post Expirator</span>
			<p><input name="enable-expirationdate" type="checkbox" /><span class="title">Enable Post Expiration</span></p>
			<fieldset class="inline-edit-date">
				<legend><span class="title">Expires</span></legend>
				<div class="timestamp-wrap">
				    <label><span class="screen-reader-text">Month</span>
				    <select name="expirationdate_month">
					<option value="01" data-text="Jan">01-Jan</option>
					<option value="02" data-text="Feb">02-Feb</option>
					<option value="03" data-text="Mar">03-Mar</option>
					<option value="04" data-text="Apr">04-Apr</option>
					<option value="05" data-text="May">05-May</option>
					<option value="06" data-text="Jun">06-Jun</option>
					<option value="07" data-text="Jul">07-Jul</option>
					<option value="08" data-text="Aug">08-Aug</option>
					<option value="09" data-text="Sep">09-Sep</option>
					<option value="10" data-text="Oct">10-Oct</option>
					<option value="11" data-text="Nov">11-Nov</option>
					<option value="12" data-text="Dec">12-Dec</option>
				    </select>
				    </label>
				    <label><span class="screen-reader-text">Day</span>
				<input name="expirationdate_day" value="" size="2" maxlength="2" autocomplete="off" type="text"></label>, 
				<label><span class="screen-reader-text">Year</span>
				<input name="expirationdate_year" value="" size="4" maxlength="4" autocomplete="off" type="text"></label> @ 
				<label><span class="screen-reader-text">Hour</span>
				<input name="expirationdate_hour" value="" size="2" maxlength="2" autocomplete="off" type="text"></label>:
				<label><span class="screen-reader-text">Minute</span>
				<input name="expirationdate_minute" value="" size="2" maxlength="2" autocomplete="off" type="text"></label></div>
				<input name="expirationdate_quickedit" value="true" type="hidden"/>
			</fieldset>
		</div>
		</div>
	</fieldset>
<?php

}

add_action( 'bulk_edit_custom_box', 'display_expirationdate_bulkedit', 10, 2 );
function display_expirationdate_bulkedit( $column_name, $post_type ) {
	if ($column_name != 'expirationdate') return;
    	?>
	<div style="clear:both"></div>
	<div class="inline-edit-col post-expirator-quickedit">
		<div class="inline-edit-col">
		<div class="inline-edit-group">
		<span class="title"><?php echo __('Post Expirator: Will only update expiration date if already configured on post.','post-expirator'); ?></span>
			<fieldset class="inline-edit-date">
				<legend><span class="title">Expires</span></legend>
				<div class="timestamp-wrap">
				    <label><span class="screen-reader-text">Month</span>
				    <select name="expirationdate_month">
					<option value="false">- No Change -</option>
					<option value="01" data-text="Jan">01-Jan</option>
					<option value="02" data-text="Feb">02-Feb</option>
					<option value="03" data-text="Mar">03-Mar</option>
					<option value="04" data-text="Apr">04-Apr</option>
					<option value="05" data-text="May">05-May</option>
					<option value="06" data-text="Jun">06-Jun</option>
					<option value="07" data-text="Jul">07-Jul</option>
					<option value="08" data-text="Aug">08-Aug</option>
					<option value="09" data-text="Sep">09-Sep</option>
					<option value="10" data-text="Oct">10-Oct</option>
					<option value="11" data-text="Nov">11-Nov</option>
					<option value="12" data-text="Dec">12-Dec</option>
				    </select>
				    </label>
				    <label><span class="screen-reader-text">Day</span>
				<input name="expirationdate_day" placeholder="Day" value="" size="2" maxlength="2" autocomplete="off" type="text"></label>, 
				<label><span class="screen-reader-text">Year</span>
				<input name="expirationdate_year" placeholder="Year" value="" size="4" maxlength="4" autocomplete="off" type="text"></label> @ 
				<label><span class="screen-reader-text">Hour</span>
				<input name="expirationdate_hour" placeholder="Hour" value="" size="2" maxlength="2" autocomplete="off" type="text"></label>:
				<label><span class="screen-reader-text">Minute</span>
				<input name="expirationdate_minute" placeholder="Min" value="" size="2" maxlength="2" autocomplete="off" type="text"></label></div>
				<input name="expirationdate_quickedit" value="true" type="hidden"/>
			</fieldset>
		</div>
		</div>
	</div>
<?php

}

/**
 * Adds hooks to get the meta box added to pages and custom post types
 */
function expirationdate_meta_custom() {
	$custom_post_types = get_post_types();
	array_push($custom_post_types,'page');
	foreach ($custom_post_types as $t) {
		$defaults = get_option('expirationdateDefaults'.ucfirst($t));
		if (!isset($defaults['activeMetaBox']) || $defaults['activeMetaBox'] == 'active') {
			add_meta_box('expirationdatediv', __('Post Expirator','post-expirator'), 'expirationdate_meta_box', $t, 'side', 'core');
		}
	}
}
add_action ('add_meta_boxes','expirationdate_meta_custom');

/**
 * Actually adds the meta box
 */
function expirationdate_meta_box($post) {
	// Get default month
	$expirationdatets = get_post_meta($post->ID,'_expiration-date',true);
	$firstsave = get_post_meta($post->ID,'_expiration-date-status',true);

	// nonce
	wp_nonce_field( '__postexpirator', '_postexpiratornonce' );

	$default = '';
	$expireType = '';
	$defaults = get_option('expirationdateDefaults'.ucfirst($post->post_type));
	if (empty($expirationdatets)) {
		$default = get_option('expirationdateDefaultDate',POSTEXPIRATOR_EXPIREDEFAULT);
		if ($default == 'null') {
			$defaultmonth 	=	date_i18n('m');
			$defaultday 	=	date_i18n('d');
			$defaulthour 	=	date_i18n('H');
			$defaultyear 	=	date_i18n('Y');
			$defaultminute 	= 	date_i18n('i');

		} elseif ($default == 'custom') {
			$custom = get_option('expirationdateDefaultDateCustom');
			if ($custom === false) $ts = time();
			else {
				$tz = get_option('timezone_string');
				if ( $tz ) date_default_timezone_set( $tz );
				$ts = time() + (strtotime($custom) - time());
				if ( $tz ) date_default_timezone_set('UTC');
			}
			$defaultmonth 	=	get_date_from_gmt(gmdate('Y-m-d H:i:s',$ts),'m');
			$defaultday 	=	get_date_from_gmt(gmdate('Y-m-d H:i:s',$ts),'d');
			$defaultyear 	=	get_date_from_gmt(gmdate('Y-m-d H:i:s',$ts),'Y');
			$defaulthour 	=	get_date_from_gmt(gmdate('Y-m-d H:i:s',$ts),'H');
			$defaultminute 	=	get_date_from_gmt(gmdate('Y-m-d H:i:s',$ts),'i');
		}

		$enabled = '';
		$disabled = ' disabled="disabled"';
		$categories = get_option('expirationdateCategoryDefaults');

		if (isset($defaults['expireType'])) {
			$expireType = $defaults['expireType'];
		}

		if (isset($defaults['autoEnable']) && ($firstsave !== 'saved') && ($defaults['autoEnable'] === true || $defaults['autoEnable'] == 1)) { 
			$enabled = ' checked="checked"'; 
			$disabled='';
		} 
	} else {
		$defaultmonth 	=	get_date_from_gmt(gmdate('Y-m-d H:i:s',$expirationdatets),'m');
		$defaultday 	=	get_date_from_gmt(gmdate('Y-m-d H:i:s',$expirationdatets),'d');
		$defaultyear 	=	get_date_from_gmt(gmdate('Y-m-d H:i:s',$expirationdatets),'Y');
		$defaulthour 	=	get_date_from_gmt(gmdate('Y-m-d H:i:s',$expirationdatets),'H');
		$defaultminute 	=	get_date_from_gmt(gmdate('Y-m-d H:i:s',$expirationdatets),'i');
		$enabled 	= 	' checked="checked"';
		$disabled 	= 	'';
		$opts 		= 	get_post_meta($post->ID,'_expiration-date-options',true);
		if (isset($opts['expireType'])) {
                	$expireType = $opts['expireType'];
		}
		$categories = isset($opts['category']) ? $opts['category'] : false;
	}

	$rv = array();
	$rv[] = '<p><input type="checkbox" name="enable-expirationdate" id="enable-expirationdate" value="checked"'.$enabled.' onclick="expirationdate_ajax_add_meta(\'enable-expirationdate\')" />';
	$rv[] = '<label for="enable-expirationdate">'.__('Enable Post Expiration','post-expirator').'</label></p>';

	if ($default == 'publish') {
		$rv[] = '<em>'.__('The published date/time will be used as the expiration value','post-expirator').'</em><br/>';
	} else {
		$rv[] = '<table><tr>';
		$rv[] = '<th style="text-align: left;">'.__('Year','post-expirator').'</th>';
		$rv[] = '<th style="text-align: left;">'.__('Month','post-expirator').'</th>';
		$rv[] = '<th style="text-align: left;">'.__('Day','post-expirator').'</th>';
		$rv[] = '</tr><tr>';
		$rv[] = '<td>';
		$rv[] = '<select name="expirationdate_year" id="expirationdate_year"'.$disabled.'>';
		$currentyear = date('Y');

		if ($defaultyear < $currentyear) $currentyear = $defaultyear;

		for($i = $currentyear; $i <= $currentyear + 10; $i++) {
			if ($i == $defaultyear)
				$selected = ' selected="selected"';
			else
				$selected = '';
			$rv[] = '<option'.$selected.'>'.($i).'</option>';
		}
		$rv[] = '</select>';
		$rv[] = '</td><td>';
		$rv[] = '<select name="expirationdate_month" id="expirationdate_month"'.$disabled.'>';

		for($i = 1; $i <= 12; $i++) {
			if ($defaultmonth == date_i18n('m',mktime(0, 0, 0, $i, 1, date_i18n('Y'))))
				$selected = ' selected="selected"';
			else
				$selected = '';
			$rv[] = '<option value="'.date_i18n('m',mktime(0, 0, 0, $i, 1, date_i18n('Y'))).'"'.$selected.'>'.date_i18n('F',mktime(0, 0, 0, $i, 1, date_i18n('Y'))).'</option>';
		}

		$rv[] = '</select>';
		$rv[] = '</td><td>';
		$rv[] = '<input type="text" id="expirationdate_day" name="expirationdate_day" value="'.$defaultday.'" size="2"'.$disabled.' />,';
		$rv[] = '</td></tr><tr>';
		$rv[] = '<th style="text-align: left;"></th>';
		$rv[] = '<th style="text-align: left;">'.__('Hour','post-expirator').'('.date_i18n('T',mktime(0, 0, 0, $i, 1, date_i18n('Y'))).')</th>';
		$rv[] = '<th style="text-align: left;">'.__('Minute','post-expirator').'</th>';
		$rv[] = '</tr><tr>';
		$rv[] = '<td>@</td><td>';
	 	$rv[] = '<select name="expirationdate_hour" id="expirationdate_hour"'.$disabled.'>';

		for($i = 1; $i <= 24; $i++) {
			if ($defaulthour == date_i18n('H',mktime($i, 0, 0, date_i18n('n'), date_i18n('j'), date_i18n('Y'))))
				$selected = ' selected="selected"';
			else
				$selected = '';
			$rv[] = '<option value="'.date_i18n('H',mktime($i, 0, 0, date_i18n('n'), date_i18n('j'), date_i18n('Y'))).'"'.$selected.'>'.date_i18n('H',mktime($i, 0, 0, date_i18n('n'), date_i18n('j'), date_i18n('Y'))).'</option>';
		}

		$rv[] = '</select></td><td>';
		$rv[] = '<input type="text" id="expirationdate_minute" name="expirationdate_minute" value="'.$defaultminute.'" size="2"'.$disabled.' />';
		$rv[] = '</td></tr></table>';
	}
	$rv[] = '<input type="hidden" name="expirationdate_formcheck" value="true" />';
	echo implode("\n",$rv);

	echo '<br/>'.__('How to expire','post-expirator').': ';
	echo _postExpiratorExpireType(array('type' => $post->post_type, 'name'=>'expirationdate_expiretype','selected'=>$expireType,'disabled'=>$disabled,'onchange' => 'expirationdate_toggle_category(this)'));
	echo '<br/>';

	if ($post->post_type != 'page') {
		if (isset($expireType) && ($expireType == 'category' || $expireType == 'category-add' || $expireType == 'category-remove')) {
			$catdisplay = 'block';
		} else {
			$catdisplay = 'none';
		}
		echo '<div id="expired-category-selection" style="display: '.$catdisplay.'">';
		echo '<br/>'.__('Expiration Categories','post-expirator').':<br/>';

		echo '<div class="wp-tab-panel" id="post-expirator-cat-list">';
		echo '<ul id="categorychecklist" class="list:category categorychecklist form-no-clear">';
		$walker = new Walker_PostExpirator_Category_Checklist();
		if (!empty($disabled)) $walker->setDisabled();
		$taxonomies = get_object_taxonomies($post->post_type,'object');
	        $taxonomies = wp_filter_object_list($taxonomies, array('hierarchical' => true));
		if (sizeof($taxonomies) == 0) {
			echo '<p>'.__('You must assign a heirarchical taxonomy to this post type to use this feature.','post-expirator').'</p>';
		} elseif (sizeof($taxonomies) > 1 && !isset($defaults['taxonomy'])) {
			echo '<p>'.__('More than 1 heirachical taxonomy detected.  You must assign a default taxonomy on the settings screen.','post-expirator').'</p>';
		} else {
			$keys = array_keys($taxonomies);
			$taxonomy = isset($defaults['taxonomy']) ? $defaults['taxonomy'] : $keys[0];
			wp_terms_checklist(0, array( 'taxonomy' => $taxonomy, 'walker' => $walker, 'selected_cats' => $categories, 'checked_ontop' => false ) );
			echo '<input type="hidden" name="taxonomy-heirarchical" value="'.$taxonomy.'" />';
		}
		echo '</ul>';
		echo '</div>';
		if (isset($taxonomy))
		echo '<p class="post-expirator-taxonomy-name">'.__('Taxonomy Name','post-expirator').': '.$taxonomy.'</p>';
		echo '</div>';
	}
	echo '<div id="expirationdate_ajax_result"></div>';
}

/**
 * Add's ajax javascript
 */
function expirationdate_js_admin_header() {
	// Define custom JavaScript function
	?>
<script type="text/javascript">
//<![CDATA[
function expirationdate_ajax_add_meta(expireenable) {
	var expire = document.getElementById(expireenable);

	if (expire.checked == true) {
		var enable = 'true';
		if (document.getElementById('expirationdate_month')) {
			document.getElementById('expirationdate_month').disabled = false;
			document.getElementById('expirationdate_day').disabled = false;
			document.getElementById('expirationdate_year').disabled = false;
			document.getElementById('expirationdate_hour').disabled = false;
			document.getElementById('expirationdate_minute').disabled = false;
		}
		document.getElementById('expirationdate_expiretype').disabled = false;
		var cats = document.getElementsByName('expirationdate_category[]');
		var max = cats.length;
		for (var i=0; i<max; i++) {
			cats[i].disabled = '';
		}
	} else {
		if (document.getElementById('expirationdate_month')) {
			document.getElementById('expirationdate_month').disabled = true;
			document.getElementById('expirationdate_day').disabled = true;
			document.getElementById('expirationdate_year').disabled = true;
			document.getElementById('expirationdate_hour').disabled = true;
			document.getElementById('expirationdate_minute').disabled = true;
		}
		document.getElementById('expirationdate_expiretype').disabled = true;
		var cats = document.getElementsByName('expirationdate_category[]');
		var max = cats.length;
		for (var i=0; i<max; i++) {
			cats[i].disabled = 'disable';
		}
		var enable = 'false';
	}
	return true;
}
function expirationdate_toggle_category(id) {
	if (id.options[id.selectedIndex].value == 'category') {
		jQuery('#expired-category-selection').show();
	} else if (id.options[id.selectedIndex].value == 'category-add') {
		jQuery('#expired-category-selection').show(); //TEMP
	} else if (id.options[id.selectedIndex].value == 'category-remove') {
		jQuery('#expired-category-selection').show(); //TEMP
	} else {
		jQuery('#expired-category-selection').hide();
	}
}
function expirationdate_toggle_defaultdate(id) {
	if (id.options[id.selectedIndex].value == 'custom') {
		jQuery('#expired-custom-container').show();
	} else {
		jQuery('#expired-custom-container').hide();
	}

}
//]]>
</script>
<?php
}
add_action('admin_head', 'expirationdate_js_admin_header' );

/**
 * Get correct URL (HTTP or HTTPS)
 */
function expirationdate_get_blog_url() {
	if (is_multisite())
		echo network_home_url('/');
	else
        	echo home_url('/');
}

/**
 * Called when post is saved - stores expiration-date meta value
 */
add_action('save_post','expirationdate_update_post_meta');
function expirationdate_update_post_meta($id) {
	// don't run the echo if this is an auto save
	if ( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE )
		return;

	// don't run the echo if the function is called for saving revision.
        $posttype = get_post_type($id);
	if ( $posttype == 'revision' )
		return;

	if (!isset($_POST['expirationdate_quickedit'])) {
		if (!isset($_POST['expirationdate_formcheck']))
			return;
	}

	if (isset($_POST['enable-expirationdate'])) {
        	$default = get_option('expirationdateDefaultDate',POSTEXPIRATOR_EXPIREDEFAULT);
		if ($default == 'publish') {
		        $month 	 = intval($_POST['mm']);
	       		$day 	 = intval($_POST['jj']);
        		$year 	 = intval($_POST['aa']);
        		$hour 	 = intval($_POST['hh']);
		        $minute  = intval($_POST['mn']);
		} else {
		        $month	 = intval($_POST['expirationdate_month']);
       			$day 	 = intval($_POST['expirationdate_day']);
		        $year 	 = intval($_POST['expirationdate_year']);
	       		$hour 	 = intval($_POST['expirationdate_hour']);
        		$minute  = intval($_POST['expirationdate_minute']);
		}
		$category = isset($_POST['expirationdate_category']) ? $_POST['expirationdate_category'] : 0;

		$ts = get_gmt_from_date("$year-$month-$day $hour:$minute:0",'U');

		if (isset($_POST['expirationdate_quickedit'])) {
	        	$ed = get_post_meta($id,'_expiration-date',true);
                	if ($ed) {
        	        	$opts = get_post_meta($id, '_expiration-date-options', true);
	                }
		} else {
			$opts = array();

			// Schedule/Update Expiration
			$opts['expireType'] = $_POST['expirationdate_expiretype'];
			$opts['id'] = $id;

			if ($opts['expireType'] == 'category' || $opts['expireType'] == 'category-add' || $opts['expireType'] == 'category-remove') {
			        if (isset($category) && !empty($category)) {
					if (!empty($category)) {
						$opts['category'] = $category;
						$opts['categoryTaxonomy'] = $_POST['taxonomy-heirarchical'];
					}
				}
			}
		}
		_scheduleExpiratorEvent($id,$ts,$opts);
	} else {
		_unscheduleExpiratorEvent($id);
	}
}

function _scheduleExpiratorEvent($id,$ts,$opts) {
       	$debug = postExpiratorDebug(); //check for/load debug

	do_action('postexpiratior_schedule',$id,$ts,$opts); // allow custom actions

	if (wp_next_scheduled('postExpiratorExpire',array($id)) !== false) {
		wp_clear_scheduled_hook('postExpiratorExpire',array($id)); //Remove any existing hooks
		if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> EXISTING FOUND - UNSCHEDULED'));
	}

	wp_schedule_single_event($ts,'postExpiratorExpire',array($id));
	if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> SCHEDULED at '.date_i18n('r',$ts).' '.'('.$ts.') with options '.print_r($opts,true)));

	// Update Post Meta
       	update_post_meta($id, '_expiration-date', $ts);
        update_post_meta($id, '_expiration-date-options', $opts);
	update_post_meta($id, '_expiration-date-status','saved');
}

function _unscheduleExpiratorEvent($id) {
       	$debug = postExpiratorDebug(); // check for/load debug

	do_action('postexpiratior_unschedule',$id); // allow custom actions

	delete_post_meta($id, '_expiration-date');
	delete_post_meta($id, '_expiration-date-options');

	// Delete Scheduled Expiration
	if (wp_next_scheduled('postExpiratorExpire',array($id)) !== false) {
		wp_clear_scheduled_hook('postExpiratorExpire',array($id)); //Remove any existing hooks
		if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> UNSCHEDULED'));
	}
	update_post_meta($id, '_expiration-date-status','saved');
}

/**
 * The new expiration function, to work with single scheduled events.
 *
 * This was designed to hopefully be more flexible for future tweaks/modifications to the architecture.
 *
 * @param array $opts - options to pass into the expiration process, in key/value format
 */
function postExpiratorExpire($id) {
        $debug = postExpiratorDebug(); //check for/load debug

	if (empty($id)) {
		if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => 'No Post ID found - exiting'));
		return false;
	}

	if (is_null(get_post($id))) {
		if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> Post does not exist - exiting'));
		return false;
	}

	$posttype = get_post_type($id);
	$posttitle = get_the_title($id);
	$postlink = get_post_permalink($id);

	$postoptions = get_post_meta($id,'_expiration-date-options',true);
	extract($postoptions);
        $ed = get_post_meta($id,'_expiration-date',true);

	// Check for default expire only if not passed in
	if (empty($expireType)) {
		$posttype = get_post_type($id);
		if ($posttype == 'page') {
			$expireType = strtolower(get_option('expirationdateExpiredPageStatus',POSTEXPIRATOR_PAGESTATUS));
		} elseif ($posttype == 'post') {
			$expireType = strtolower(get_option('expirationdateExpiredPostStatus','Draft'));
		} else {
			$expireType = apply_filters('postexpirator_custom_posttype_expire', $expireType, $posttype); //hook to set defaults for custom post types
		}
	}

	// Remove KSES - wp_cron runs as an unauthenticated user, which will by default trigger kses filtering,
	// even if the post was published by a admin user.  It is fairly safe here to remove the filter call since
	// we are only changing the post status/meta information and not touching the content.
	kses_remove_filters();

	// Do Work
	if ($expireType == 'draft') {
		if (wp_update_post(array('ID' => $id, 'post_status' => 'draft')) == 0) {
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> FAILED '.$expireType.' '.print_r($postoptions,true)));
		} else {
			$emailBody = sprintf( __( '%s (%s) has expired at %s. Post status has been successfully changed to "%s".', 'post-expirator' ),'##POSTTITLE##','##POSTLINK##','##EXPIRATIONDATE##',strtoupper($expireType) );
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> PROCESSED '.$expireType.' '.print_r($postoptions,true)));
		}
	} elseif ($expireType == 'private') {
		if (wp_update_post(array('ID' => $id, 'post_status' => 'private')) == 0) {
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> FAILED '.$expireType.' '.print_r($postoptions,true)));
		} else {
			$emailBody = sprintf( __( '%s (%s) has expired at %s. Post status has been successfully changed to "%s".', 'post-expirator' ),'##POSTTITLE##','##POSTLINK##','##EXPIRATIONDATE##',strtoupper($expireType) );
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> PROCESSED '.$expireType.' '.print_r($postoptions,true)));
		}
	} elseif ($expireType == 'delete') {
		if (wp_delete_post($id) === false) {
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> FAILED '.$expireType.' '.print_r($postoptions,true)));
		} else {
			$emailBody = sprintf( __( '%s (%s) has expired at %s. Post status has been successfully changed to "%s".', 'post-expirator' ),'##POSTTITLE##','##POSTLINK##','##EXPIRATIONDATE##',strtoupper($expireType) );
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> PROCESSED '.$expireType.' '.print_r($postoptions,true)));
		}
	} elseif ($expireType == 'trash') {
		if (wp_trash_post($id) === false) {
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> FAILED '.$expireType.' '.print_r($postoptions,true)));
		} else {
			$emailBody = sprintf( __( '%s (%s) has expired at %s. Post status has been successfully changed to "%s".', 'post-expirator' ),'##POSTTITLE##','##POSTLINK##','##EXPIRATIONDATE##',strtoupper($expireType) );
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> PROCESSED '.$expireType.' '.print_r($postoptions,true)));
		}
	} elseif ($expireType == 'stick') {
		if (stick_post($id) === false) {
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> FAILED '.$expireType.' '.print_r($postoptions,true)));
		} else {
			$emailBody = sprintf( __( '%s (%s) has expired at %s. Post "%s" status has been successfully set.', 'post-expirator' ),'##POSTTITLE##','##POSTLINK##','##EXPIRATIONDATE##','STICKY' );
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> PROCESSED '.$expireType.' '.print_r($postoptions,true)));
		}
	} elseif ($expireType == 'unstick') {
		if (unstick_post($id) === false) {
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> FAILED '.$expireType.' '.print_r($postoptions,true)));
		} else {
			$emailBody = sprintf( __( '%s (%s) has expired at %s. Post "%s" status has been successfully removed.', 'post-expirator' ),'##POSTTITLE##','##POSTLINK##','##EXPIRATIONDATE##','STICKY' );
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> PROCESSED '.$expireType.' '.print_r($postoptions,true)));
		}
	} elseif ($expireType == 'category') {
		if (!empty($category)) {
			if (!isset($categoryTaxonomy) || $categoryTaxonomy == 'category') {
				if (wp_update_post(array('ID' => $id, 'post_category' => $category)) == 0) {
					if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> FAILED '.$expireType.' '.print_r($postoptions,true)));
				} else {
					$emailBody = sprintf( __( '%s (%s) has expired at %s. Post "%s" have now been set to "%s".', 'post-expirator' ),'##POSTTITLE##','##POSTLINK##','##EXPIRATIONDATE##','CATEGORIES', implode(',',_postExpiratorGetCatNames($category)));
					if (POSTEXPIRATOR_DEBUG) {
						$debug->save(array('message' => $id.' -> PROCESSED '.$expireType.' '.print_r($postoptions,true)));
						$debug->save(array('message' => $id.' -> CATEGORIES REPLACED '.print_r(_postExpiratorGetCatNames($category),true)));
						$debug->save(array('message' => $id.' -> CATEGORIES COMPLETE '.print_r(_postExpiratorGetCatNames($category),true)));
					}
				}
			} else {
				$terms = array_map('intval', $category);
				if (is_wp_error(wp_set_object_terms($id,$terms,$categoryTaxonomy,false))) {
					if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> FAILED '.$expireType.' '.print_r($postoptions,true)));
				} else {
					$emailBody = sprintf( __( '%s (%s) has expired at %s. Post "%s" have now been set to "%s".', 'post-expirator' ),'##POSTTITLE##','##POSTLINK##','##EXPIRATIONDATE##','CATEGORIES', implode(',',_postExpiratorGetCatNames($category)));
					if (POSTEXPIRATOR_DEBUG) {
						$debug->save(array('message' => $id.' -> PROCESSED '.$expireType.' '.print_r($postoptions,true)));
						$debug->save(array('message' => $id.' -> CATEGORIES REPLACED '.print_r(_postExpiratorGetCatNames($category),true)));
						$debug->save(array('message' => $id.' -> CATEGORIES COMPLETE '.print_r(_postExpiratorGetCatNames($category),true)));
					}
				}
			}
		} else {
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> CATEGORIES MISSING '.$expireType.' '.print_r($postoptions,true)));
		}
	} elseif ($expireType == 'category-add') {
		if (!empty($category)) {
			if (!isset($categoryTaxonomy) || $categoryTaxonomy == 'category') {
				$cats = wp_get_post_categories($id);
				$merged = array_merge($cats,$category);
				if (wp_update_post(array('ID' => $id, 'post_category' => $merged)) == 0) {
					if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> FAILED '.$expireType.' '.print_r($postoptions,true)));
				} else {
					$emailBody = sprintf( __( '%s (%s) has expired at %s. The following post "%s" have now been added: "%s". The full list of categories on the post are: "%s".', 'post-expirator' ),'##POSTTITLE##','##POSTLINK##','##EXPIRATIONDATE##','CATEGORIES', implode(',',_postExpiratorGetCatNames($category)),implode(',',_postExpiratorGetCatNames($merged)));
					if (POSTEXPIRATOR_DEBUG) {
						$debug->save(array('message' => $id.' -> PROCESSED '.$expireType.' '.print_r($postoptions,true)));
						$debug->save(array('message' => $id.' -> CATEGORIES ADDED '.print_r(_postExpiratorGetCatNames($category),true)));
						$debug->save(array('message' => $id.' -> CATEGORIES COMPLETE '.print_r(_postExpiratorGetCatNames($merged),true)));
					}
				}
			} else {
				$terms = array_map('intval', $category);
				if (is_wp_error(wp_set_object_terms($id,$terms,$categoryTaxonomy,true))) {
					if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> FAILED '.$expireType.' '.print_r($postoptions,true)));
				} else {
					$emailBody = sprintf( __( '%s (%s) has expired at %s. The following post "%s" have now been added: "%s". The full list of categories on the post are: "%s".', 'post-expirator' ),'##POSTTITLE##','##POSTLINK##','##EXPIRATIONDATE##','CATEGORIES', implode(',',_postExpiratorGetCatNames($category)),implode(',',_postExpiratorGetCatNames($merged)));
					if (POSTEXPIRATOR_DEBUG) {
						$debug->save(array('message' => $id.' -> PROCESSED '.$expireType.' '.print_r($postoptions,true)));
						$debug->save(array('message' => $id.' -> CATEGORIES ADDED '.print_r(_postExpiratorGetCatNames($category),true)));
						$debug->save(array('message' => $id.' -> CATEGORIES COMPLETE '.print_r(_postExpiratorGetCatNames($category),true)));
					}
				}
			}
		} else {
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> CATEGORIES MISSING '.$expireType.' '.print_r($postoptions,true)));
		}
	} elseif ($expireType == 'category-remove') {
                if (!empty($category)) {
			if (!isset($categoryTaxonomy) || $categoryTaxonomy == 'category') {
				$cats = wp_get_post_categories($id);
				$merged = array();
				foreach ($cats as $cat) {
					if (!in_array($cat,$category)) {
						$merged[] = $cat;
					}
				}
                	        if (wp_update_post(array('ID' => $id, 'post_category' => $merged)) == 0) {
					if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> FAILED '.$expireType.' '.print_r($postoptions,true)));
	                        } else {
					$emailBody = sprintf( __( '%s (%s) has expired at %s. The following post "%s" have now been removed: "%s". The full list of categories on the post are: "%s".', 'post-expirator' ),'##POSTTITLE##','##POSTLINK##','##EXPIRATIONDATE##','CATEGORIES', implode(',',_postExpiratorGetCatNames($category)),implode(',',_postExpiratorGetCatNames($merged)));
        	                        if (POSTEXPIRATOR_DEBUG) {
						$debug->save(array('message' => $id.' -> PROCESSED '.$expireType.' '.print_r($postoptions,true)));
						$debug->save(array('message' => $id.' -> CATEGORIES REMOVED '.print_r(_postExpiratorGetCatNames($category),true)));
						$debug->save(array('message' => $id.' -> CATEGORIES COMPLETE '.print_r(_postExpiratorGetCatNames($merged),true)));
					}
        	                }
			} else {
				$terms = wp_get_object_terms($id, $categoryTaxonomy, array('fields' => 'ids'));
				$merged = array();
				foreach ($terms as $term) {
					if (!in_array($term,$category)) {
						$merged[] = $term;
					}
				}
				$terms = array_map('intval', $merged);
				if (is_wp_error(wp_set_object_terms($id,$terms,$categoryTaxonomy,false))) {
					if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> FAILED '.$expireType.' '.print_r($postoptions,true)));
				} else {
					$emailBody = sprintf( __( '%s (%s) has expired at %s. The following post "%s" have now been removed: "%s". The full list of categories on the post are: "%s".', 'post-expirator' ),'##POSTTITLE##','##POSTLINK##','##EXPIRATIONDATE##','CATEGORIES', implode(',',_postExpiratorGetCatNames($category)),implode(',',_postExpiratorGetCatNames($merged)));
					if (POSTEXPIRATOR_DEBUG) {
						$debug->save(array('message' => $id.' -> PROCESSED '.$expireType.' '.print_r($postoptions,true)));
						$debug->save(array('message' => $id.' -> CATEGORIES REMOVED '.print_r(_postExpiratorGetCatNames($category),true)));
						$debug->save(array('message' => $id.' -> CATEGORIES COMPLETE '.print_r(_postExpiratorGetCatNames($category),true)));
					}
				}
			}
                } else {
			if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> CATEGORIES MISSING '.$expireType.' '.print_r($postoptions,true)));
                }
	}

	//Process Email
	$emailenabled = get_option('expirationdateEmailNotification',POSTEXPIRATOR_EMAILNOTIFICATION);
	if ($emailenabled == 1 && isset($emailBody)) {
		$subj = sprintf( __('Post Expiration Complete "%s"', 'post-expirator'), $posttitle);
		$emailBody = str_replace( "##POSTTITLE##", $posttitle, $emailBody );
		$emailBody = str_replace( "##POSTLINK##", $postlink, $emailBody );
		$emailBody = str_replace( "##EXPIRATIONDATE##", get_date_from_gmt(gmdate('Y-m-d H:i:s',$ed),get_option('date_format').' '.get_option('time_format')), $emailBody );

		$emails = array();
		// Get Blog Admins
		$emailadmins = get_option('expirationdateEmailNotificationAdmins',POSTEXPIRATOR_EMAILNOTIFICATIONADMINS);
		if ($emailadmins == 1) {
			$blogusers = get_users('role=Administrator');
			foreach ($blogusers as $user) {
				$emails[] = $user->user_email;
			}
		}

		// Get Global Notification Emails
		$emaillist = get_option('expirationdateEmailNotificationList');
		if (!empty($emaillist)) {
			$vals = explode(',',$emaillist);
			foreach ($vals as $val) {
				$emails[] = trim($val);
			}
		}

		// Get Post Type Notification Emails
	        $defaults = get_option('expirationdateDefaults'.ucfirst($posttype));
		if (isset($defaults['emailnotification']) && !empty($defaults['emailnotification'])) {
			$vals = explode(',',$defaults['emailnotification']);
			foreach ($vals as $val) {
				$emails[] = trim($val);
			}
		}

		// Send Emails
		foreach ($emails as $email) {
	        	if (wp_mail($email, sprintf(__('[%s] %s'), get_option('blogname'), $subj), $emailBody)) {
        	                if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> EXPIRATION EMAIL SENT ('.$email.')'));
			} else {
                        	if (POSTEXPIRATOR_DEBUG) $debug->save(array('message' => $id.' -> EXPIRATION EMAIL FAILED ('.$email.')'));
			}
		}
	}

}
add_action('postExpiratorExpire','postExpiratorExpire');

function _postExpiratorGetCatNames($cats) {
	$out = array();
	foreach ($cats as $cat) {
		$out[$cat] = get_the_category_by_id($cat);
	}
	return $out;
}

/**
 * Build the menu for the options page
 */
function postExpiratorMenuTabs($tab) {
        echo '<p>';
	if (empty($tab)) $tab = 'general';
        echo '<a href="'.admin_url('options-general.php?page=post-expirator.php&tab=general').'"'.($tab == 'general' ? ' style="font-weight: bold; text-decoration:none;"' : '').'>'.__('General Settings','post-expirator').'</a> | ';
        echo '<a href="'.admin_url('options-general.php?page=post-expirator.php&tab=defaults').'"'.($tab == 'defaults' ? ' style="font-weight: bold; text-decoration:none;"' : '').'>'.__('Defaults','post-expirator').'</a> | ';
        echo '<a href="'.admin_url('options-general.php?page=post-expirator.php&tab=diagnostics').'"'.($tab == 'diagnostics' ? ' style="font-weight: bold; text-decoration:none;"' : '').'>'.__('Diagnostics','post-expirator').'</a> | ';
	echo '<a href="'.admin_url('options-general.php?page=post-expirator.php&tab=viewdebug').'"'.($tab == 'viewdebug' ? ' style="font-weight: bold; text-decoration:none;"' : '').'>'.__('View Debug Logs','post-expirator').'</a>';
        echo '</p><hr/>';
}

/**
 *
 */
function postExpiratorMenu() {
        $tab = isset($_GET['tab']) ? $_GET['tab'] : '';

	echo '<div class="wrap">';
        echo '<h2>'.__('Post Expirator Options','post-expirator').'</h2>';

	postExpiratorMenuTabs($tab);
	if (empty($tab) || $tab == 'general') {
		postExpiratorMenuGeneral();
	} elseif ($tab == 'defaults') {
		postExpiratorMenuDefaults();
	} elseif ($tab == 'diagnostics') {
		postExpiratorMenuDiagnostics();
	} elseif ($tab == 'viewdebug') {
		postExpiratorMenuViewdebug();
	}
	echo '</div>';
}

/**
 * Hook's to add plugin page menu
 */
function postExpiratorPluginMenu() {
	add_submenu_page('options-general.php',__('Post Expirator Options','post-expirator'),__('Post Expirator','post-expirator'),'manage_options',basename(__FILE__),'postExpiratorMenu');
}
add_action('admin_menu', 'postExpiratorPluginMenu');

/**
 * Show the Expiration Date options page
 */
function postExpiratorMenuGeneral() {
	if (isset($_POST['expirationdateSave']) && $_POST['expirationdateSave']) {
		if ( !isset($_POST['_postExpiratorMenuGeneral_nonce']) || !wp_verify_nonce($_POST['_postExpiratorMenuGeneral_nonce'],'postExpiratorMenuGeneral') ) {
			print 'Form Validation Failure: Sorry, your nonce did not verify.';
			exit;
		} else {
			//Filter Content
			$_POST = filter_input_array(INPUT_POST,FILTER_SANITIZE_STRING);

			update_option('expirationdateDefaultDateFormat',$_POST['expired-default-date-format']);
			update_option('expirationdateDefaultTimeFormat',$_POST['expired-default-time-format']);
			update_option('expirationdateDisplayFooter',$_POST['expired-display-footer']);
			update_option('expirationdateEmailNotification',$_POST['expired-email-notification']);
			update_option('expirationdateEmailNotificationAdmins',$_POST['expired-email-notification-admins']);
			update_option('expirationdateEmailNotificationList',trim($_POST['expired-email-notification-list']));
			update_option('expirationdateFooterContents',$_POST['expired-footer-contents']);
			update_option('expirationdateFooterStyle',$_POST['expired-footer-style']);
			if (isset($_POST['expirationdate_category'])) update_option('expirationdateCategoryDefaults',$_POST['expirationdate_category']);
			update_option('expirationdateDefaultDate',$_POST['expired-default-expiration-date']);
			if ($_POST['expired-custom-expiration-date']) update_option('expirationdateDefaultDateCustom',$_POST['expired-custom-expiration-date']);
                	echo "<div id='message' class='updated fade'><p>";
        	        _e('Saved Options!','post-expirator');
	                echo "</p></div>";
		}
	}

	// Get Option
	$expirationdateDefaultDateFormat = get_option('expirationdateDefaultDateFormat',POSTEXPIRATOR_DATEFORMAT);
	$expirationdateDefaultTimeFormat = get_option('expirationdateDefaultTimeFormat',POSTEXPIRATOR_TIMEFORMAT);
	$expireddisplayfooter = get_option('expirationdateDisplayFooter',POSTEXPIRATOR_FOOTERDISPLAY);
	$expiredemailnotification = get_option('expirationdateEmailNotification',POSTEXPIRATOR_EMAILNOTIFICATION);
	$expiredemailnotificationadmins = get_option('expirationdateEmailNotificationAdmins',POSTEXPIRATOR_EMAILNOTIFICATIONADMINS);
	$expiredemailnotificationlist = get_option('expirationdateEmailNotificationList','');
	$expirationdateFooterContents = get_option('expirationdateFooterContents',POSTEXPIRATOR_FOOTERCONTENTS);
	$expirationdateFooterStyle = get_option('expirationdateFooterStyle',POSTEXPIRATOR_FOOTERSTYLE);
	$expirationdateDefaultDate = get_option('expirationdateDefaultDate',POSTEXPIRATOR_EXPIREDEFAULT);
	$expirationdateDefaultDateCustom = get_option('expirationdateDefaultDateCustom');

	$categories = get_option('expirationdateCategoryDefaults');

	$expireddisplayfooterenabled = '';
	$expireddisplayfooterdisabled = '';
	if ($expireddisplayfooter == 0)
		$expireddisplayfooterdisabled = 'checked="checked"';
	else if ($expireddisplayfooter == 1)
		$expireddisplayfooterenabled = 'checked="checked"';

	$expiredemailnotificationenabled = '';
	$expiredemailnotificationdisabled = '';
	if ($expiredemailnotification == 0)
		$expiredemailnotificationdisabled = 'checked="checked"';
	else if ($expiredemailnotification == 1)
		$expiredemailnotificationenabled = 'checked="checked"';

	$expiredemailnotificationadminsenabled = '';
	$expiredemailnotificationadminsdisabled = '';
	if ($expiredemailnotificationadmins == 0)
		$expiredemailnotificationadminsdisabled = 'checked="checked"';
	else if ($expiredemailnotificationadmins == 1)
		$expiredemailnotificationadminsenabled = 'checked="checked"';
	?>
	<p>
	<?php _e('The post expirator plugin sets a custom meta value, and then optionally allows you to select if you want the post changed to a draft status or deleted when it expires.','post-expirator'); ?>
	</p>
	<p>
	<?php _e('Valid [postexpirator] attributes:','post-expirator'); ?>
	<ul>
		<li><?php _e('type - defaults to full - valid options are full,date,time','post-expirator');?></li>
		<li><?php _e('dateformat - format set here will override the value set on the settings page','post-expirator');?></li>
		<li><?php _e('timeformat - format set here will override the value set on the settings page','post-expirator');?></li>
	</ul>
	</p>
	<form method="post" id="expirationdate_save_options">
		<?php wp_nonce_field('postExpiratorMenuGeneral','_postExpiratorMenuGeneral_nonce'); ?>
		<h3><?php _e('Defaults','post-expirator'); ?></h3>
		<table class="form-table">
			<tr valign="top">
				<th scope="row"><label for="expired-default-date-format"><?php _e('Date Format:','post-expirator');?></label></th>
				<td>
					<input type="text" name="expired-default-date-format" id="expired-default-date-format" value="<?php echo $expirationdateDefaultDateFormat ?>" size="25" /> (<?php echo date_i18n("$expirationdateDefaultDateFormat") ?>)
					<br/>
					<?php _e('The default format to use when displaying the expiration date within a post using the [postexpirator] shortcode or within the footer.  For information on valid formatting options, see: <a href="http://us2.php.net/manual/en/function.date.php" target="_blank">PHP Date Function</a>.','post-expirator'); ?>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><label for="expired-default-time-format"><?php _e('Time Format:','post-expirator');?></label></th>
				<td>
					<input type="text" name="expired-default-time-format" id="expired-default-time-format" value="<?php echo $expirationdateDefaultTimeFormat ?>" size="25" /> (<?php echo date_i18n("$expirationdateDefaultTimeFormat") ?>)
					<br/>
					<?php _e('The default format to use when displaying the expiration time within a post using the [postexpirator] shortcode or within the footer.  For information on valid formatting options, see: <a href="http://us2.php.net/manual/en/function.date.php" target="_blank">PHP Date Function</a>.','post-expirator'); ?>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><label for="expired-default-expiration-date"><?php _e('Default Date/Time Duration:','post-expirator');?></label></th>
				<td>
					<select name="expired-default-expiration-date" id="expired-default-expiration-date" onchange="expirationdate_toggle_defaultdate(this)">
						<option value="null" <?php echo ($expirationdateDefaultDate == 'null') ? ' selected="selected"' : ''; ?>><?php _e('None','post-expirator');?></option>
						<option value="custom" <?php echo ($expirationdateDefaultDate == 'custom') ? ' selected="selected"' : ''; ?>><?php _e('Custom','post-expirator');?></option>
						<option value="publish" <?php echo ($expirationdateDefaultDate == 'publish') ? ' selected="selected"' : ''; ?>><?php _e('Post/Page Publish Time','post-expirator');?></option>
					</select>
					<br/>
					<?php _e('Set the default expiration date to be used when creating new posts and pages.  Defaults to none.','post-expirator'); ?>
					<?php $show = ($expirationdateDefaultDate == 'custom') ? 'block' : 'none'; ?>
					<div id="expired-custom-container" style="display: <?php echo $show; ?>;">
					<br/><label for="expired-custom-expiration-date">Custom:</label> <input type="text" value="<?php echo $expirationdateDefaultDateCustom; ?>" name="expired-custom-expiration-date" id="expired-custom-expiration-date" />
					<br/>
					<?php _e('Set the custom value to use for the default expiration date.  For information on formatting, see <a href="http://php.net/manual/en/function.strtotime.php">PHP strtotime function</a>. For example, you could enter "+1 month" or "+1 week 2 days 4 hours 2 seconds" or "next Thursday."','post-expirator'); ?>
					</div>
				</td>
			</tr>
		</table>
		<h3><?php _e('Category Expiration','post-expirator');?></h3>
		<table class="form-table">
			<tr valign="top">
				<th scope="row"><?php _e('Default Expiration Category','post-expirator');?>:</th>
				<td>
		<?php
                echo '<div class="wp-tab-panel" id="post-expirator-cat-list">';
                echo '<ul id="categorychecklist" class="list:category categorychecklist form-no-clear">';
                $walker = new Walker_PostExpirator_Category_Checklist();
                wp_terms_checklist(0, array( 'taxonomy' => 'category', 'walker' => $walker, 'selected_cats' => $categories, 'checked_ontop' => false ) );
                echo '</ul>';
                echo '</div>';
		?>
					<br/>
					<?php _e("Set's the default expiration category for the post.",'post-expirator');?>
				</td>
			</tr>
		</table>

		<h3><?php _e('Expiration Email Notification','post-expirator');?></h3>
		<p><?php _e('Whenever a post expires, an email can be sent to alert users of the expiration.','post-expirator');?></p>
		<table class="form-table">
			<tr valign="top">
				<th scope="row"><?php _e('Enable Email Notification?','post-expirator');?></th>
				<td>
					<input type="radio" name="expired-email-notification" id="expired-email-notification-true" value="1" <?php echo $expiredemailnotificationenabled ?>/> <label for="expired-email-notification-true"><?php _e('Enabled','post-expirator');?></label>
					<br/>
					<input type="radio" name="expired-email-notification" id="expired-email-notification-false" value="0" <?php echo $expiredemailnotificationdisabled ?>/> <label for="expired-email-notification-false"><?php _e('Disabled','post-expirator');?></label>
					<br/>
					<?php _e('This will enable or disable the send of email notification on post expiration.','post-expirator');?>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?php _e('Include Blog Administrators?','post-expirator');?></th>
				<td>
					<input type="radio" name="expired-email-notification-admins" id="expired-email-notification-admins-true" value="1" <?php echo $expiredemailnotificationadminsenabled ?>/> <label for="expired-email-notification-admins-true"><?php _e('Enabled','post-expirator');?></label>
					<br/>
					<input type="radio" name="expired-email-notification-admins" id="expired-email-notification-admins-false" value="0" <?php echo $expiredemailnotificationadminsdisabled ?>/> <label for="expired-email-notification-admins-false"><?php _e('Disabled','post-expirator');?></label>
					<br/>
					<?php _e('This will include all users with the role of "Administrator" in the post expiration email.','post-expirator');?>
				</td>
			</tr>
			<tr valign="top">
                        	<th scope="row"><label for="expired-email-notification-list"><?php _e('Who to notify:','post-expirator'); ?></label></th>
                                <td>
                                	<input class="large-text" type="text" name="expired-email-notification-list" id="expired-email-notification-list" value="<?php echo $expiredemailnotificationlist ?>" />
                                        <br/>
                                	<?php _e('Enter a comma seperate list of emails that you would like to be notified when the post expires.  This will be applied to ALL post types.  You can set post type specific emails on the Defaults tab.','post-expirator');?>
                                </td>
			</tr>
		</table>

		<h3><?php _e('Post Footer Display','post-expirator');?></h3>
		<p><?php _e('Enabling this below will display the expiration date automatically at the end of any post which is set to expire.','post-expirator');?></p>
		<table class="form-table">
			<tr valign="top">
				<th scope="row"><?php _e('Show in post footer?','post-expirator');?></th>
				<td>
					<input type="radio" name="expired-display-footer" id="expired-display-footer-true" value="1" <?php echo $expireddisplayfooterenabled ?>/> <label for="expired-display-footer-true"><?php _e('Enabled','post-expirator');?></label>
					<br/>
					<input type="radio" name="expired-display-footer" id="expired-display-footer-false" value="0" <?php echo $expireddisplayfooterdisabled ?>/> <label for="expired-display-footer-false"><?php _e('Disabled','post-expirator');?></label>
					<br/>
					<?php _e('This will enable or disable displaying the post expiration date in the post footer.','post-expirator');?>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><label for="expired-footer-contents"><?php _e('Footer Contents:','post-expirator');?></label></th>
				<td>
					<textarea id="expired-footer-contents" name="expired-footer-contents" rows="3" cols="50"><?php echo $expirationdateFooterContents; ?></textarea>
					<br/>
					<?php _e('Enter the text you would like to appear at the bottom of every post that will expire.  The following placeholders will be replaced with the post expiration date in the following format:','post-expirator');?>
					<ul>
						<li>EXPIRATIONFULL -> <?php echo date_i18n("$expirationdateDefaultDateFormat $expirationdateDefaultTimeFormat") ?></li>
						<li>EXPIRATIONDATE -> <?php echo date_i18n("$expirationdateDefaultDateFormat") ?></li>
						<li>EXPIRATIONTIME -> <?php echo date_i18n("$expirationdateDefaultTimeFormat") ?></li>
					</ul>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><label for="expired-footer-style"><?php _e('Footer Style:','post-expirator');?></label></th>
				<td>
					<input type="text" name="expired-footer-style" id="expired-footer-style" value="<?php echo $expirationdateFooterStyle ?>" size="25" />
					(<span style="<?php echo $expirationdateFooterStyle ?>"><?php _e('This post will expire on','post-expirator');?> <?php echo date_i18n("$expirationdateDefaultDateFormat $expirationdateDefaultTimeFormat"); ?></span>)
					<br/>
					<?php _e('The inline css which will be used to style the footer text.','post-expirator');?>
				</td>
			</tr>
		</table>
		<p class="submit">
			<input type="submit" name="expirationdateSave" class="button-primary" value="<?php _e('Save Changes','post-expirator');?>" />
		</p>
	</form>
	<?php
}

function postExpiratorMenuDefaults() {
	$debug = postExpiratorDebug();
	$types = get_post_types(array('public' => true, '_builtin' => false));
	array_unshift($types,'post','page');

	if (isset($_POST['expirationdateSaveDefaults'])) {
		if ( !isset($_POST['_postExpiratorMenuDefaults_nonce']) || !wp_verify_nonce($_POST['_postExpiratorMenuDefaults_nonce'],'postExpiratorMenuDefaults') ) {
			print 'Form Validation Failure: Sorry, your nonce did not verify.';
			exit;
		} else {
			//Filter Content
                        $_POST = filter_input_array(INPUT_POST,FILTER_SANITIZE_STRING);

			$defaults = array();
			foreach ($types as $type) {
				if (isset($_POST['expirationdate_expiretype-'.$type])) {
					$defaults[$type]['expireType'] = $_POST['expirationdate_expiretype-'.$type];
				}
				if (isset($_POST['expirationdate_autoenable-'.$type])) {
					$defaults[$type]['autoEnable'] = intval($_POST['expirationdate_autoenable-'.$type]);
				}
				if (isset($_POST['expirationdate_taxonomy-'.$type])) {
					$defaults[$type]['taxonomy'] = $_POST['expirationdate_taxonomy-'.$type];
				}
				if (isset($_POST['expirationdate_activemeta-'.$type])) {
					$defaults[$type]['activeMetaBox'] = $_POST['expirationdate_activemeta-'.$type];
				}
				$defaults[$type]['emailnotification'] = trim($_POST['expirationdate_emailnotification-'.$type]);

				//Save Settings
		                update_option('expirationdateDefaults'.ucfirst($type),$defaults[$type]);
			}
                	echo "<div id='message' class='updated fade'><p>";
       		        _e('Saved Options!','post-expirator');
        	        echo "</p></div>";
		}
	}

	?>
        <form method="post">
                <?php wp_nonce_field('postExpiratorMenuDefaults','_postExpiratorMenuDefaults_nonce'); ?>
                <h3><?php _e('Default Expiration Values','post-expirator');?></h3>
		<p>
		<?php _e('Use the values below to set the default actions/values to be used for each for the corresponding post types.  These values can all be overwritten when creating/editing the post/page.','post-expirator'); ?>
		</p>
		<?php
		foreach ($types as $type) {
			echo "<fieldset style='border: 1px solid black; border-radius: 6px; padding: 0px 12px; margin-bottom: 20px;'>";
			echo "<legend>Post Type: $type</legend>";
			$defaults = get_option('expirationdateDefaults'.ucfirst($type));

			if (isset($defaults['autoEnable']) && $defaults['autoEnable'] == 1) {
				$expiredautoenabled = 'checked = "checked"';
				$expiredautodisabled = '';
			} else {
				$expiredautoenabled = '';
				$expiredautodisabled = 'checked = "checked"';
			}
			if (isset($defaults['activeMetaBox']) && $defaults['activeMetaBox'] == 'inactive') {
				$expiredactivemetaenabled = '';
				$expiredactivemetadisabled = 'checked = "checked"';
			} else {
				$expiredactivemetaenabled = 'checked = "checked"';
				$expiredactivemetadisabled = '';
			}
			if (!isset($defaults['taxonomy'])) $defaults['taxonomy'] = false;
			if (!isset($defaults['emailnotification'])) $defaults['emailnotification'] = '';
			?>
			<table class="form-table">
				<tr valign="top">
					<th scope="row"><label for="expirationdate_activemeta-<?php echo $type ?>"><?php _e('Active:','post-expirator');?></label></th>
					<td>
						<input type="radio" name="expirationdate_activemeta-<?php echo $type ?>" id="expirationdate_activemeta-true-<?php echo $type ?>" value="active" <?php echo $expiredactivemetaenabled ?>/> <label for="expired-active-meta-true"><?php _e('Active','post-expirator');?></label>
						<br/>
						<input type="radio" name="expirationdate_activemeta-<?php echo $type ?>" id="expirationdate_activemeta-false-<?php echo $type ?>" value="inactive" <?php echo $expiredactivemetadisabled ?>/> <label for="expired-active-meta-false"><?php _e('Inactive','post-expirator');?></label>
						<br/>
						<?php _e('Select whether the post expirator meta box is active for this post type.','post-expirator');?>
					</td>
				</tr>
				<tr valign="top">
					<th scope="row"><label for="expirationdate_expiretype-<?php echo $type ?>"><?php _e('How to expire:','post-expirator'); ?></label></th>
					<td>
						<?php echo _postExpiratorExpireType(array('name'=>'expirationdate_expiretype-'.$type,'selected' => $defaults['expireType'])); ?>
						</select>
						<br/>
						<?php _e('Select the default expire action for the post type.','post-expirator');?>
					</td>
				</tr>
				<tr valign="top">
					<th scope="row"><label for="expirationdate_autoenable-<?php echo $type ?>"><?php _e('Auto-Enable?','post-expirator');?></label></th>
					<td>
						<input type="radio" name="expirationdate_autoenable-<?php echo $type ?>" id="expirationdate_autoenable-true-<?php echo $type ?>" value="1" <?php echo $expiredautoenabled ?>/> <label for="expired-auto-enable-true"><?php _e('Enabled','post-expirator');?></label>
						<br/>
						<input type="radio" name="expirationdate_autoenable-<?php echo $type ?>" id="expirationdate_autoenable-false-<?php echo $type ?>" value="0" <?php echo $expiredautodisabled ?>/> <label for="expired-auto-enable-false"><?php _e('Disabled','post-expirator');?></label>
						<br/>
						<?php _e('Select whether the post expirator is enabled for all new posts.','post-expirator');?>
					</td>
				</tr>
				<tr valign="top">
					<th scope="row"><label for="expirationdate_taxonomy-<?php echo $type ?>"><?php _e('Taxonomy (hierarchical):','post-expirator'); ?></label></th>
					<td>
						<?php echo _postExpiratorTaxonomy(array('type' => $type, 'name'=>'expirationdate_taxonomy-'.$type,'selected' => $defaults['taxonomy'])); ?>
					</td>
				</tr>
				<tr valign="top">
					<th scope="row"><label for="expirationdate_emailnotification-<?php echo $type ?>"><?php _e('Who to notify:','post-expirator'); ?></label></th>
					<td>
						<input class="large-text" type="text" name="expirationdate_emailnotification-<?php echo $type ?>" id="expirationdate_emailnotification-<?php echo $type ?>" value="<?php echo $defaults['emailnotification']; ?>" />
						<br/>
						<?php _e('Enter a comma seperate list of emails that you would like to be notified when the post expires.','post-expirator');?>
					</td>
				</tr>

			</table>
			</fieldset>
			<?php
		}
		?>
                <p class="submit">
                        <input type="submit" name="expirationdateSaveDefaults" class="button-primary" value="<?php _e('Save Changes','post-expirator');?>" />
                </p>
        </form>
	<?php
}

function postExpiratorMenuDiagnostics() {
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		if ( !isset($_POST['_postExpiratorMenuDiagnostics_nonce']) || !wp_verify_nonce($_POST['_postExpiratorMenuDiagnostics_nonce'],'postExpiratorMenuDiagnostics') ) {
			print 'Form Validation Failure: Sorry, your nonce did not verify.';
			exit;
		}
		if (isset($_POST['debugging-disable'])) {
			update_option('expirationdateDebug',0);
        	        echo "<div id='message' class='updated fade'><p>"; _e('Debugging Disabled','post-expirator'); echo "</p></div>";
		} elseif (isset($_POST['debugging-enable'])) {
			update_option('expirationdateDebug',1);
                	echo "<div id='message' class='updated fade'><p>"; _e('Debugging Enabled','post-expirator'); echo "</p></div>";
		} elseif (isset($_POST['purge-debug'])) {
			require_once(plugin_dir_path(__FILE__).'post-expirator-debug.php');
			$debug = new postExpiratorDebug();
			$debug->purge();
        	        echo "<div id='message' class='updated fade'><p>"; _e('Debugging Table Emptied','post-expirator'); echo "</p></div>";
		}
	}

	$debug = postExpiratorDebug();
	?>
        <form method="post" id="postExpiratorMenuUpgrade">
                <?php wp_nonce_field('postExpiratorMenuDiagnostics','_postExpiratorMenuDiagnostics_nonce'); ?>
                <h3><?php _e('Advanced Diagnostics','post-expirator');?></h3>
                <table class="form-table">
                        <tr valign="top">
                                <th scope="row"><label for="postexpirator-log"><?php _e('Post Expirator Debug Logging:','post-expirator');?></label></th>
                                <td>
					<?php
					if (POSTEXPIRATOR_DEBUG) { 
						echo __('Status: Enabled','post-expirator').'<br/>';
						echo '<input type="submit" class="button" name="debugging-disable" id="debugging-disable" value="'.__('Disable Debugging','post-expirator').'" />';
					} else {
						echo __('Status: Disabled','post-expirator').'<br/>';
						echo '<input type="submit" class="button" name="debugging-enable" id="debugging-enable" value="'.__('Enable Debugging','post-expirator').'" />';
					}
					?>
                                        <br/>
					<a href="<?php echo admin_url('options-general.php?page=post-expirator.php&tab=viewdebug') ?>">View Debug Logs</a>
                                </td>
                        </tr>
                        <tr valign="top">
                                <th scope="row"><?php _e('Purge Debug Log:','post-expirator');?></th>
                                <td>
					<input type="submit" class="button" name="purge-debug" id="purge-debug" value="<?php _e('Purge Debug Log','post-expirator');?>" />
				</td>
			</tr/>
                        <tr valign="top">
                                <th scope="row"><?php _e('WP-Cron Status:','post-expirator');?></th>
                                <td>
					<?php 
					if (defined('DISABLE_WP_CRON') && DISABLE_WP_CRON === true) {
						_e('DISABLED','post-expirator');
					} else {
						_e('ENABLED - OK','post-expirator');
					}
					?>
				</td>
			</tr/>
                        <tr valign="top">
                                <th scope="row"><label for="cron-schedule"><?php _e('Current Cron Schedule:','post-expirator');?></label></th>
                                <td>
					<?php _e('The below table will show all currently scheduled cron events with the next run time.','post-expirator');?><br/>
					<table>
						<tr>
							<th style="width: 200px;"><?php _e('Date','post-expirator');?></th>
							<th style="width: 200px;"><?php _e('Event','post-expirator');?></th>
							<th style="width: 500px;"><?php _e('Arguments / Schedule','post-expirator');?></th>
						</tr>
					<?php
					$cron = _get_cron_array();
					foreach ($cron as $key=>$value) {
						foreach ($value as $eventkey=>$eventvalue) {
						print '<tr>';
						print '<td>'.date_i18n('r',$key).'</td>';
						print '<td>'.$eventkey.'</td>';
						$arrkey = array_keys($eventvalue);
						print '<td>';
						foreach ($arrkey as $eventguid) {
							print '<table><tr>';
							if (empty($eventvalue[$eventguid]['args'])) {
								print '<td>No Arguments</td>';
							} else {
								print '<td>';
								$args = array();
								foreach ($eventvalue[$eventguid]['args'] as $key=>$value) {
									$args[] = "$key => $value";
								}
								print implode("<br/>\n",$args);
								print '</td>';
							}
							if (empty($eventvalue[$eventguid]['schedule'])) {
								print '<td>'.__('Single Event','post-expirator').'</td>';
							} else {
								print '<td>'.$eventvalue[$eventguid]['schedule'].' ('.$eventvalue[$eventguid]['interval'].')</td>';
							}
							print '</tr></table>';
						}
						print '</td>';
						print '</tr>';
						}
					}
					?>
					</table>
                                </td>
                        </tr>
                </table>
        </form>
	<?php
}

function postExpiratorMenuViewdebug() {
	require_once(plugin_dir_path(__FILE__).'post-expirator-debug.php');
	print "<p>".__('Below is a dump of the debugging table, this should be useful for troubleshooting.','post-expirator')."</p>";
	$debug = new postExpiratorDebug();
	$debug->getTable();
}

// [postexpirator format="l F jS, Y g:ia" tz="foo"]
function postexpirator_shortcode($atts) {
	global $post;

        $expirationdatets = get_post_meta($post->ID,'_expiration-date',true);
	if (empty($expirationdatets))
		return false;

	extract(shortcode_atts(array(
		'dateformat' => get_option('expirationdateDefaultDateFormat',POSTEXPIRATOR_DATEFORMAT),
		'timeformat' => get_option('expirationdateDefaultTimeFormat',POSTEXPIRATOR_TIMEFORMAT),
		'type' => 'full',
		'tz' => date('T')
	), $atts));

	if (empty($dateformat)) {
		global $expirationdateDefaultDateFormat;
		$dateformat = $expirationdateDefaultDateFormat;
	}

	if (empty($timeformat)) {
		global $expirationdateDefaultTimeFormat;
		$timeformat = $expirationdateDefaultTimeFormat;
	}

	if ($type == 'full')
		$format = $dateformat.' '.$timeformat;
	else if ($type == 'date')
		$format = $dateformat;
	else if ($type == 'time')
		$format = $timeformat;

	return get_date_from_gmt(gmdate('Y-m-d H:i:s',$expirationdatets),$format);
}
add_shortcode('postexpirator', 'postexpirator_shortcode');

function postexpirator_add_footer($text) {
	global $post;

	// Check to see if its enabled
	$displayFooter = get_option('expirationdateDisplayFooter');
	if ($displayFooter === false || $displayFooter == 0)
		return $text;

        $expirationdatets = get_post_meta($post->ID,'_expiration-date',true);
	if (!is_numeric($expirationdatets))
		return $text;

        $dateformat = get_option('expirationdateDefaultDateFormat',POSTEXPIRATOR_DATEFORMAT);
        $timeformat = get_option('expirationdateDefaultTimeFormat',POSTEXPIRATOR_TIMEFORMAT);
        $expirationdateFooterContents = get_option('expirationdateFooterContents',POSTEXPIRATOR_FOOTERCONTENTS);
        $expirationdateFooterStyle = get_option('expirationdateFooterStyle',POSTEXPIRATOR_FOOTERSTYLE);

	$search = array(
		'EXPIRATIONFULL',
		'EXPIRATIONDATE',
		'EXPIRATIONTIME'
	);
	$replace = array(
		get_date_from_gmt(gmdate('Y-m-d H:i:s',$expirationdatets),"$dateformat $timeformat"),
		get_date_from_gmt(gmdate('Y-m-d H:i:s',$expirationdatets),$dateformat),
		get_date_from_gmt(gmdate('Y-m-d H:i:s',$expirationdatets),$timeformat)
	);

	$add_to_footer = '<p style="'.$expirationdateFooterStyle.'">'.str_replace($search,$replace,$expirationdateFooterContents).'</p>';
	return $text.$add_to_footer;
}
add_action('the_content','postexpirator_add_footer',0);

/**
 * Check for Debug
 */
function postExpiratorDebug() {
	$debug = get_option('expirationdateDebug');
	if ($debug == 1) {
		if (!defined('POSTEXPIRATOR_DEBUG')) define('POSTEXPIRATOR_DEBUG',1);
                require_once(plugin_dir_path(__FILE__).'post-expirator-debug.php'); // Load Class
                return new postExpiratorDebug();
	} else {
		if (!defined('POSTEXPIRATOR_DEBUG')) define('POSTEXPIRATOR_DEBUG',0);
		return false;
	}
}


/**
 * Add Stylesheet
 */
function postexpirator_css() {
        $myStyleUrl = plugins_url('style.css', __FILE__); // Respects SSL, Style.css is relative to the current file
        $myStyleFile = WP_PLUGIN_DIR . '/post-expirator/style.css';
        if ( file_exists($myStyleFile) ) {
            wp_register_style('postexpirator-css', $myStyleUrl);
            wp_enqueue_style('postexpirator-css');
        }

}
add_action('admin_init','postexpirator_css');

/**
 * Post Expirator Activation/Upgrade
 */
function postexpirator_upgrade() {

	// Check for current version, if not exists, run activation
	$version = get_option('postexpiratorVersion');
	if ($version === false) { //not installed, run default activation
		postexpirator_activate();
		update_option('postexpiratorVersion',POSTEXPIRATOR_VERSION);
	} else {
		if (version_compare($version,'1.6.1') == -1) {
			update_option('postexpiratorVersion',POSTEXPIRATOR_VERSION);
			update_option('expirationdateDefaultDate',POSTEXPIRATOR_EXPIREDEFAULT);
		}

		if (version_compare($version,'1.6.2') == -1) {
			update_option('postexpiratorVersion',POSTEXPIRATOR_VERSION);
		}

		if (version_compare($version,'2.0.0-rc1') == -1) {
			global $wpdb;

			// Schedule Events/Migrate Config
			$results = $wpdb->get_results($wpdb->prepare('select post_id, meta_value from ' . $wpdb->postmeta . ' as postmeta, '.$wpdb->posts.' as posts where postmeta.post_id = posts.ID AND postmeta.meta_key = %s AND postmeta.meta_value >= %d','expiration-date',time()));
			foreach ($results as $result) {
				wp_schedule_single_event($result->meta_value,'postExpiratorExpire',array($result->post_id));
				$opts = array();
				$opts['id'] = $result->post_id;
				$posttype = get_post_type($result->post_id);
	        		if ($posttype == 'page') {
		                	$opts['expireType'] = strtolower(get_option('expirationdateExpiredPageStatus','Draft'));
	                	} else {
                	        	$opts['expireType'] = strtolower(get_option('expirationdateExpiredPostStatus','Draft'));
				}

				$cat = get_post_meta($result->post_id,'_expiration-date-category',true);
				if ((isset($cat) && !empty($cat))) {
					$opts['category'] = $cat;
					$opts['expireType'] = 'category';
				}
				update_post_meta($result->post_id,'_expiration-date-options',$opts);
			}

			// update meta key to new format
			$wpdb->query($wpdb->prepare("UPDATE $wpdb->postmeta SET meta_key = %s WHERE meta_key = %s",'_expiration-date','expiration-date'));

			// migrate defaults
			$pagedefault = get_option('expirationdateExpiredPageStatus');
			$postdefault = get_option('expirationdateExpiredPostStatus');
			if ($pagedefault) update_option('expirationdateDefaultsPage',array('expireType' => $pagedefault));
			if ($postdefault) update_option('expirationdateDefaultsPost',array('expireType' => $postdefault));

			delete_option('expirationdateCronSchedule');
			delete_option('expirationdateAutoEnabled');
			delete_option('expirationdateExpiredPageStatus');
			delete_option('expirationdateExpiredPostStatus');
			update_option('postexpiratorVersion',POSTEXPIRATOR_VERSION);
		}

		if (version_compare($version,'2.0.1') == -1) {
			// Forgot to do this in 2.0.0
		        if (is_multisite()) {
				global $current_blog;
                		wp_clear_scheduled_hook('expirationdate_delete_'.$current_blog->blog_id);
		        } else
                		wp_clear_scheduled_hook('expirationdate_delete');

			update_option('postexpiratorVersion',POSTEXPIRATOR_VERSION);
		}

		if (version_compare($version,'2.1.0') == -1) {
			update_option('postexpiratorVersion',POSTEXPIRATOR_VERSION);
		}

		if (version_compare($version,'2.1.1') == -1) {
			update_option('postexpiratorVersion',POSTEXPIRATOR_VERSION);
		}

		if (version_compare($version,'2.2.0') == -1) {
			update_option('postexpiratorVersion',POSTEXPIRATOR_VERSION);
		}
		if (version_compare($version,'2.2.1') == -1) {
			update_option('postexpiratorVersion',POSTEXPIRATOR_VERSION);
		}
		if (version_compare($version,'2.3.0') == -1) {
			update_option('postexpiratorVersion',POSTEXPIRATOR_VERSION);
		}
		if (version_compare($version,'2.3.1') == -1) {
			update_option('postexpiratorVersion',POSTEXPIRATOR_VERSION);
		}
		if (version_compare($version,'2.3.1.1') == -1) {
			update_option('postexpiratorVersion',POSTEXPIRATOR_VERSION);
		}
		if (version_compare($version,'2.4') == -1) {
			update_option('postexpiratorVersion',POSTEXPIRATOR_VERSION);
		}
		if (version_compare($version,'2.4.1') == -1) {
			update_option('postexpiratorVersion',POSTEXPIRATOR_VERSION);
		}
	}
}
add_action('admin_init','postexpirator_upgrade');

/**
 * Called at plugin activation
 */
function postexpirator_activate () {
	if (get_option('expirationdateDefaultDateFormat') === false)	update_option('expirationdateDefaultDateFormat',POSTEXPIRATOR_DATEFORMAT);
	if (get_option('expirationdateDefaultTimeFormat') === false)	update_option('expirationdateDefaultTimeFormat',POSTEXPIRATOR_TIMEFORMAT);
	if (get_option('expirationdateFooterContents') === false)	update_option('expirationdateFooterContents',POSTEXPIRATOR_FOOTERCONTENTS);
	if (get_option('expirationdateFooterStyle') === false)		update_option('expirationdateFooterStyle',POSTEXPIRATOR_FOOTERSTYLE);
	if (get_option('expirationdateDisplayFooter') === false)	update_option('expirationdateDisplayFooter',POSTEXPIRATOR_FOOTERDISPLAY);
	if (get_option('expirationdateDebug') === false)		update_option('expirationdateDebug',POSTEXPIRATOR_DEBUGDEFAULT);
	if (get_option('expirationdateDefaultDate') === false)		update_option('expirationdateDefaultDate',POSTEXPIRATOR_EXPIREDEFAULT);
}

/**
 * Called at plugin deactivation
 */
function expirationdate_deactivate () {
	global $current_blog;
	delete_option('expirationdateExpiredPostStatus');
	delete_option('expirationdateExpiredPageStatus');
	delete_option('expirationdateDefaultDateFormat');
	delete_option('expirationdateDefaultTimeFormat');
	delete_option('expirationdateDisplayFooter');
	delete_option('expirationdateFooterContents');
	delete_option('expirationdateFooterStyle');
	delete_option('expirationdateCategory');
	delete_option('expirationdateCategoryDefaults');
	delete_option('expirationdateDebug');
	delete_option('postexpiratorVersion');
	delete_option('expirationdateCronSchedule');
	delete_option('expirationdateDefaultDate');
	delete_option('expirationdateDefaultDateCustom');
	delete_option('expirationdateAutoEnabled');
	delete_option('expirationdateDefaultsPage');
	delete_option('expirationdateDefaultsPost');
	## what about custom post types? - how to cleanup?
	if (is_multisite())
		wp_clear_scheduled_hook('expirationdate_delete_'.$current_blog->blog_id);
	else
		wp_clear_scheduled_hook('expirationdate_delete');
	require_once(plugin_dir_path(__FILE__).'post-expirator-debug.php');
	$debug = new postExpiratorDebug();
	$debug->removeDbTable();
}
register_deactivation_hook (__FILE__, 'expirationdate_deactivate');

class Walker_PostExpirator_Category_Checklist extends Walker {
	var $tree_type = 'category';
	var $db_fields = array ('parent' => 'parent', 'id' => 'term_id'); //TODO: decouple this

	var $disabled = '';

	function setDisabled() {
		$this->disabled = 'disabled="disabled"';
	}

	function start_lvl(&$output, $depth = 0, $args = array()) {
		$indent = str_repeat("\t", $depth);
		$output .= "$indent<ul class='children'>\n";
	}

	function end_lvl(&$output, $depth = 0, $args = array()) {
		$indent = str_repeat("\t", $depth);
		$output .= "$indent</ul>\n";
	}

	function start_el(&$output, $category, $depth = 0, $args = array(), $current_object_id = 0) {
		extract($args);
		if ( empty($taxonomy) )
			$taxonomy = 'category';

		$name = 'expirationdate_category';

		$class = in_array( $category->term_id, $popular_cats ) ? ' class="expirator-category"' : '';
		$output .= "\n<li id='expirator-{$taxonomy}-{$category->term_id}'$class>" . '<label class="selectit"><input value="' . $category->term_id . '" type="checkbox" name="'.$name.'[]" id="expirator-in-'.$taxonomy.'-' . $category->term_id . '"' . checked( in_array( $category->term_id, $selected_cats ), true, false ) . disabled( empty( $args['disabled'] ), false, false ) . ' '.$this->disabled.'/> ' . esc_html( apply_filters('the_category', $category->name )) . '</label>';
	}

	function end_el(&$output, $category, $depth = 0, $args = array()) {
		$output .= "</li>\n";
	}
}

function _postExpiratorExpireType($opts) {
	if (empty($opts)) return false;

	extract($opts);
	if (!isset($name)) return false;
	if (!isset($id)) $id = $name;
	if (!isset($disabled)) $disabled = false;
	if (!isset($onchange)) $onchange = '';
	if (!isset($type)) $type = '';

	$rv = array();
	$rv[] = '<select name="'.$name.'" id="'.$id.'"'.($disabled == true ? ' disabled="disabled"' : '').' onchange="'.$onchange.'">';
	$rv[] = '<option value="draft" '. ($selected == 'draft' ? 'selected="selected"' : '') . '>'.__('Draft','post-expirator').'</option>';
	$rv[] = '<option value="delete" '. ($selected == 'delete' ? 'selected="selected"' : '') . '>'.__('Delete','post-expirator').'</option>';
	$rv[] = '<option value="trash" '. ($selected == 'trash' ? 'selected="selected"' : '') . '>'.__('Trash','post-expirator').'</option>';
	$rv[] = '<option value="private" '. ($selected == 'private' ? 'selected="selected"' : '') . '>'.__('Private','post-expirator').'</option>';
	$rv[] = '<option value="stick" '. ($selected == 'stick' ? 'selected="selected"' : '') . '>'.__('Stick','post-expirator').'</option>';
	$rv[] = '<option value="unstick" '. ($selected == 'unstick' ? 'selected="selected"' : '') . '>'.__('Unstick','post-expirator').'</option>';
	if ($type != 'page') {
		$rv[] = '<option value="category" '. ($selected == 'category' ? 'selected="selected"' : '') . '>'.__('Category: Replace','post-expirator').'</option>';
		$rv[] = '<option value="category-add" '. ($selected == 'category-add' ? 'selected="selected"' : '') . '>'.__('Category: Add','post-expirator').'</option>';
		$rv[] = '<option value="category-remove" '. ($selected == 'category-remove' ? 'selected="selected"' : '') . '>'.__('Category: Remove','post-expirator').'</option>';
	}
	$rv[] = '</select>';
	return implode("<br/>\n",$rv);
}

function _postExpiratorTaxonomy($opts) {
	if (empty($opts)) return false;

	extract($opts);
	if (!isset($name)) return false;
	if (!isset($id)) $id = $name;
	if (!isset($disabled)) $disabled = false;
	if (!isset($onchange)) $onchange = '';
	if (!isset($type)) $type = '';

	$taxonomies = get_object_taxonomies($type,'object');
	$taxonomies = wp_filter_object_list($taxonomies, array('hierarchical' => true));

	if (empty($taxonomies)) $disabled = true;

	$rv = array();
	if ($taxonomies) {
        	$rv[] = '<select name="'.$name.'" id="'.$id.'"'.($disabled == true ? ' disabled="disabled"' : '').' onchange="'.$onchange.'">';
		foreach ($taxonomies as $taxonomy) {
			$rv[] = '<option value="'.$taxonomy->name.'" '. ($selected == $taxonomy->name ? 'selected="selected"' : '') . '>'.$taxonomy->name.'</option>';
		}

		$rv[] = '</select>';
		$rv[] = __('Select the hierarchical taxonomy to be used for "category" based expiration.','post-expirator');
	} else {
		$rv[] = 'No taxonomies found for post type.';
	}
	return implode("<br/>\n",$rv);
}

add_action( 'admin_print_scripts-edit.php', 'expirationdate_quickedit_javascript' );
function expirationdate_quickedit_javascript() {
	// if using code as plugin
	wp_enqueue_script( 'manage-wp-posts-using-bulk-quick-edit', trailingslashit( plugin_dir_url( __FILE__ ) ) . 'admin-edit.js', array( 'jquery', 'inline-edit-post' ), '', true );

}

/**
* Receieve AJAX call from bulk edit to process save
*/
add_action( 'wp_ajax_manage_wp_posts_using_bulk_quick_save_bulk_edit', 'expiration_date_save_bulk_edit' );
function expiration_date_save_bulk_edit() {
	// we need the post IDs
	$post_ids = ( isset( $_POST[ 'post_ids' ] ) && !empty( $_POST[ 'post_ids' ] ) ) ? $_POST[ 'post_ids' ] : NULL;

	// if we have post IDs
	if ( ! empty( $post_ids ) && is_array( $post_ids ) ) {

		// if no change, do nothing
		if ($_POST['expirationdate_month'] == "false") return;

		$month   = intval($_POST['expirationdate_month']);
		$day     = intval($_POST['expirationdate_day']);
		$year    = intval($_POST['expirationdate_year']);
		$hour    = intval($_POST['expirationdate_hour']);
		$minute  = intval($_POST['expirationdate_minute']);
		$ts = get_gmt_from_date("$year-$month-$day $hour:$minute:0",'U');

		foreach( $post_ids as $post_id ) {
			// Only update posts that already have expiration date set.  Ignore Others
	                $ed = get_post_meta($post_id,'_expiration-date',true);
			if ($ed) {
				$opts = get_post_meta($post_id, '_expiration-date-options', true);
		                #_scheduleExpiratorEvent($post_id,$ts,$opts);
			}
		}
	}
}
