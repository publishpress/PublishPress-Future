	<div style="clear:both"></div>
	<fieldset class="inline-edit-col-left post-expirator-quickedit">
		<div class="inline-edit-col">
		<div class="inline-edit-group">
		<span class="title"><?php _e( 'Post Expirator', 'post-expirator' ); ?></span>
			<p><input name="enable-expirationdate" type="checkbox" /><span class="title"><?php _e( 'Enable Post Expiration', 'post-expirator' ); ?></span></p>
			<fieldset class="inline-edit-date">
				<legend><span class="title"><?php _e( 'Expires', 'post-expirator' ); ?></span></legend>
				<div class="timestamp-wrap">
					<label>
						<span class="screen-reader-text"><?php _e( 'Month', 'post-expirator' ); ?></span>
						<select name="expirationdate_month">
					<?php
					for ( $x = 1; $x <= 12; $x++ ) {
						$now = mktime( 0, 0, 0, $x, 1, date_i18n( 'Y' ) );
						$monthNumeric = date_i18n( 'm', $now );
						$monthStr = date_i18n( 'M', $now );
						?>
						<option value="<?php echo $monthNumeric; ?>" data-text="<?php echo $monthStr; ?>"><?php echo $monthNumeric; ?>-<?php echo $monthStr; ?></option>
					<?php } ?>

						</select>
					</label>
					<label>
						<span class="screen-reader-text"><?php _e( 'Day', 'post-expirator' ); ?></span>
						<input name="expirationdate_day" value="" size="2" maxlength="2" autocomplete="off" type="text" placeholder="<?php echo date( 'd' ); ?>">
					</label>, 
					<label>
						<span class="screen-reader-text"><?php _e( 'Year', 'post-expirator' ); ?></span>
						<input name="expirationdate_year" value="" size="4" maxlength="4" autocomplete="off" type="text" placeholder="<?php echo date( 'Y' ); ?>">
					</label> @ 
					<label>
						<span class="screen-reader-text"><?php _e( 'Hour', 'post-expirator' ); ?></span>
						<input name="expirationdate_hour" value="" size="2" maxlength="2" autocomplete="off" type="text" placeholder="00">
					</label> :
					<label>
						<span class="screen-reader-text"><?php _e( 'Minute', 'post-expirator' ); ?></span>
						<input name="expirationdate_minute" value="" size="2" maxlength="2" autocomplete="off" type="text" placeholder="00">
					</label>
					<label>
						<span class="screen-reader-text"><?php _e( 'How to expire', 'post-expirator' ); ?></span>
						<?php
							$defaults = get_option( 'expirationdateDefaults' . ucfirst( $post_type ) );
							_postexpirator_expire_type( array('name' => 'expirationdate_expiretype', 'selected' => $defaults['expireType']) );
						?>
					</label>
				</div>
				<input name="expirationdate_quickedit" value="true" type="hidden"/>
			</fieldset>
		</div>
		</div>
	</fieldset>
