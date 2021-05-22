(function($) {

	// we create a copy of the WP inline edit post function
	var $wp_inline_edit = inlineEditPost.edit;

	// and then we overwrite the function with our own code
	inlineEditPost.edit = function( id ) {

		// "call" the original WP edit function
		// we don't want to leave WordPress hanging
		$wp_inline_edit.apply( this, arguments );

		// now we take care of our business

		// get the post ID
		var $post_id = 0;
		if ( typeof( id ) == 'object' ) {
			$post_id = parseInt( this.getId( id ) );
		}

		if ( $post_id > 0 ) {
			// define the edit row
			var $edit_row = $( '#edit-' + $post_id );

			// get / set year
			var $year = $( '#expirationdate_year-' + $post_id ).text();
			$edit_row.find( 'input[name="expirationdate_year"]' ).val( $year );

			// get / set month
			var $month = $( '#expirationdate_month-' + $post_id ).text();
			$edit_row.find( 'select[name="expirationdate_month"]' ).val( $month );

			// get / set day
			var $day = $( '#expirationdate_day-' + $post_id ).text();
			$edit_row.find( 'input[name="expirationdate_day"]' ).val( $day );

			// get / set hour
			var $hour = $( '#expirationdate_hour-' + $post_id ).text();
			$edit_row.find( 'input[name="expirationdate_hour"]' ).val( $hour );

			// get / set minute
			var $minute = $( '#expirationdate_minute-' + $post_id ).text();
			$edit_row.find( 'input[name="expirationdate_minute"]' ).val( $minute );

			var $enabled = $( '#expirationdate_enabled-' + $post_id ).text();
			if ($enabled == "true") {
				$edit_row.find( 'input[name="enable-expirationdate"]' ).prop( 'checked', true );
			}
		}
	};

	$( '#bulk_edit' ).on( 'click', function() {
	
		// define the bulk edit row
		var $bulk_row = $( '#bulk-edit' );
		
		// get the selected post ids that are being edited
		var $post_ids = new Array();
		$bulk_row.find( '#bulk-titles' ).children().each( function() {
			$post_ids.push( $( this ).attr( 'id' ).replace( /^(ttle)/i, '' ) );
		});
		
		// get the custom fields
		var $expirationdate_month = $bulk_row.find( 'select[name="expirationdate_month"]' ).val();
		var $expirationdate_day = $bulk_row.find( 'input[name="expirationdate_day"]' ).val();
		var $expirationdate_year = $bulk_row.find( 'input[name="expirationdate_year"]' ).val();
		var $expirationdate_hour = $bulk_row.find( 'input[name="expirationdate_hour"]' ).val();
		var $expirationdate_minute = $bulk_row.find( 'input[name="expirationdate_minute"]' ).val();
		
		// save the data
		$.ajax({
			url: ajaxurl, // this is a variable that WordPress has already defined for us
			type: 'POST',
			async: false,
			cache: false,
			data: {
				action: 'manage_wp_posts_using_bulk_quick_save_bulk_edit', // this is the name of our WP AJAX function that we'll set up next
				post_ids: $post_ids, // and these are the 2 parameters we're passing to our function
				expirationdate_month: $expirationdate_month,
				expirationdate_day: $expirationdate_day,
				expirationdate_year: $expirationdate_year,
				expirationdate_hour: $expirationdate_hour,
				expirationdate_minute: $expirationdate_minute
			}
		});
		
	});

})(jQuery);
