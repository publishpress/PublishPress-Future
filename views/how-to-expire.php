<?php
	// @TODO remove extract
	// phpcs:ignore WordPress.PHP.DontExtract.extract_extract
	extract( $opts );

if ( ! isset( $name ) ) {
	return false;
}
if ( ! isset( $id ) ) {
	$id = $name;
}
if ( ! isset( $disabled ) ) {
	$disabled = false;
}
if ( ! isset( $onchange ) ) {
	$onchange = '';
}
if ( ! isset( $type ) ) {
	$type = '';
}

	// maybe settings have not been configured
if ( empty( $type ) && isset( $opts['post_type'] ) ) {
	$type = $opts['post_type'];
}

	$rv = array();
	// phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
	$rv[] = '<select name="' . $name . '" id="' . $id . '"' . ( $disabled == true ? ' disabled="disabled"' : '' ) . ' onchange="' . $onchange . '">';
	$rv[] = '<option value="draft" ' . ( $selected === 'draft' ? 'selected="selected"' : '' ) . '>' . __( 'Draft', 'post-expirator' ) . '</option>';
	$rv[] = '<option value="delete" ' . ( $selected === 'delete' ? 'selected="selected"' : '' ) . '>' . __( 'Delete', 'post-expirator' ) . '</option>';
	$rv[] = '<option value="trash" ' . ( $selected === 'trash' ? 'selected="selected"' : '' ) . '>' . __( 'Trash', 'post-expirator' ) . '</option>';
	$rv[] = '<option value="private" ' . ( $selected === 'private' ? 'selected="selected"' : '' ) . '>' . __( 'Private', 'post-expirator' ) . '</option>';
	$rv[] = '<option value="stick" ' . ( $selected === 'stick' ? 'selected="selected"' : '' ) . '>' . __( 'Stick', 'post-expirator' ) . '</option>';
	$rv[] = '<option value="unstick" ' . ( $selected === 'unstick' ? 'selected="selected"' : '' ) . '>' . __( 'Unstick', 'post-expirator' ) . '</option>';
if ( $type !== 'page' ) {
	$rv[] = '<option value="category" ' . ( $selected === 'category' ? 'selected="selected"' : '' ) . '>' . __( 'Category: Replace', 'post-expirator' ) . '</option>';
	$rv[] = '<option value="category-add" ' . ( $selected === 'category-add' ? 'selected="selected"' : '' ) . '>' . __( 'Category: Add', 'post-expirator' ) . '</option>';
	$rv[] = '<option value="category-remove" ' . ( $selected === 'category-remove' ? 'selected="selected"' : '' ) . '>' . __( 'Category: Remove', 'post-expirator' ) . '</option>';
}
	$rv[] = '</select>';
	echo implode( "<br/>\n", $rv );
