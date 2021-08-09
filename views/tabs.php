<div class="wrap">
	<h2><?php __( 'Post Expirator Options', 'post-expirator' ); ?></h2>
	<div id="pe-settings-tabs">
		<ul>
			<li data-href="<?php echo admin_url( 'options-general.php?page=post-expirator.php&tab=general' ); ?>"><a href="#tab-general" class="pe-tab"><?php _e( 'General Settings', 'post-expirator' ); ?></a></li>
			<li data-href="<?php echo admin_url( 'options-general.php?page=post-expirator.php&tab=defaults' ); ?>"><a href="#tab-defaults" class="pe-tab"><?php _e( 'Post Types', 'post-expirator' ); ?></a></li>
			<li data-href="<?php echo admin_url( 'options-general.php?page=post-expirator.php&tab=diagnostics' ); ?>"><a href="#tab-diagnostics" class="pe-tab"><?php _e( 'Diagnostics', 'post-expirator' ); ?></a></li>
<?php if ( POSTEXPIRATOR_DEBUG ) { ?>
			<li data-href="<?php echo admin_url( 'options-general.php?page=post-expirator.php&tab=viewdebug' ); ?>"><a href="#tab-viewdebug" class="pe-tab"><?php _e( 'View Debug Logs', 'post-expirator' ); ?></a></li>
<?php } ?>
		</ul>

<?php
foreach ( $tabs as $t ) {
	echo '<div id="tab-' . $t . '">' . ( $t === $tab ? $html : ( __( 'Loading', 'post-expirator' ) . '...' ) ) . '</div>';
}
?>

	</div>
	
	<input type="hidden" id="pe-current-tab" value="<?php echo $tab_index; ?>">

</div>
