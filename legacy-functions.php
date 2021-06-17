<?php
/**
 * This file provides access to all legacy functions that are now deprecated.
 */

if ( ! function_exists( '_scheduleExpiratorEvent' ) ) {

	/**
	 * Schedules the single event.
	 *
	 * @deprecated 2.4.2
	 */
	function _scheduleExpiratorEvent( $id, $ts, $opts ) {
		postexpirator_schedule_event( $id, $ts, $opts );
	}
}


if ( ! function_exists( '_unscheduleExpiratorEvent' ) ) {

	/**
	 * Unschedules the single event.
	 *
	 * @deprecated 2.4.2
	 */
	function _unscheduleExpiratorEvent( $id ) {
		postexpirator_unschedule_event( $id );
	}
}


if ( ! function_exists( 'postExpiratorExpire' ) ) {

	/**
	 * Expires the post.
	 *
	 * @deprecated 2.4.2
	 */
	function postExpiratorExpire( $id ) {
		postexpirator_expire_post( $id );
	}
}


