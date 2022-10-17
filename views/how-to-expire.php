<?php
defined('ABSPATH') or die('Direct access not allowed.');

if (! isset($opts['name'])) {
    return false;
}
if (! isset($opts['id'])) {
    $opts['id'] = $opts['name'];
}
if (! isset($opts['type'])) {
    $opts['type'] = '';
}

// Maybe settings have not been configured.
if (empty($opts['type']) && isset($opts['post_type'])) {
    $opts['type'] = $opts['post_type'];
}

?>
<select name="<?php echo esc_attr($opts['name']); ?>" id="<?php echo esc_attr($opts['id']); ?>" class="pe-howtoexpire">
    <option value="draft" <?php selected($opts['selected'], 'draft', true); ?>>
        <?php esc_html_e('Draft', 'post-expirator'); ?>
    </option>

    <option value="delete" <?php selected($opts['selected'], 'delete', true); ?>>
        <?php esc_html_e('Delete', 'post-expirator'); ?>
    </option>

    <option value="trash" <?php selected($opts['selected'], 'trash', true); ?>>
        <?php esc_html_e('Trash', 'post-expirator'); ?>
    </option>

    <option value="private" <?php selected($opts['selected'], 'private', true); ?>>
        <?php esc_html_e('Private', 'post-expirator'); ?>
    </option>

    <option value="stick" <?php selected($opts['selected'], 'stick', true); ?>>
        <?php esc_html_e('Stick', 'post-expirator'); ?>
    </option>

    <option value="unstick" <?php selected($opts['selected'], 'unstick', true); ?>>
        <?php esc_html_e('Unstick', 'post-expirator'); ?>
    </option>

    <option value="category" <?php selected($opts['selected'], 'category', true); ?>>
        <?php esc_html_e('Taxonomy: Replace', 'post-expirator'); ?>
    </option>

    <option value="category-add" <?php selected($opts['selected'], 'category-add', true); ?>>
        <?php esc_html_e('Taxonomy: Add', 'post-expirator'); ?>
    </option>

    <option value="category-remove" <?php selected($opts['selected'], 'category-remove', true); ?>>
        <?php esc_html_e('Taxonomy: Remove', 'post-expirator'); ?>
    </option>
</select>
