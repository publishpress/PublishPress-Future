<?php

// @TODO remove extract
extract($opts);

if (! isset($name)) {
    return false;
}
if (! isset($id)) {
    $id = $name;
}
if (! isset($type)) {
    $type = '';
}

// maybe settings have not been configured
if (empty($type) && isset($opts['post_type'])) {
    $type = $opts['post_type'];
}

?>
<select name="<?php
echo $name; ?>" id="<?php
echo $id; ?>" class="pe-howtoexpire">
    <option value="draft" <?php
    echo $selected === 'draft' ? 'selected="selected"' : ''; ?>><?php
        _e('Draft', 'post-expirator'); ?></option>
    <option value="delete" <?php
    echo $selected === 'delete' ? 'selected="selected"' : ''; ?>><?php
        _e('Delete', 'post-expirator'); ?></option>
    <option value="trash" <?php
    echo $selected === 'trash' ? 'selected="selected"' : ''; ?>><?php
        _e('Trash', 'post-expirator'); ?></option>
    <option value="private" <?php
    echo $selected === 'private' ? 'selected="selected"' : ''; ?>><?php
        _e('Private', 'post-expirator'); ?></option>
    <option value="stick" <?php
    echo $selected === 'stick' ? 'selected="selected"' : ''; ?>><?php
        _e('Stick', 'post-expirator'); ?></option>
    <option value="unstick" <?php
    echo $selected === 'unstick' ? 'selected="selected"' : ''; ?>><?php
        _e('Unstick', 'post-expirator'); ?></option>
    <?php
    if ($type !== 'page') { ?>
        <option value="category" <?php
        echo $selected === 'category' ? 'selected="selected"' : ''; ?>><?php
            _e('Category: Replace', 'post-expirator'); ?></option>
        <option value="category-add" <?php
        echo $selected === 'category-add' ? 'selected="selected"' : ''; ?>><?php
            _e('Category: Add', 'post-expirator'); ?></option>
        <option value="category-remove" <?php
        echo $selected === 'category-remove' ? 'selected="selected"' : ''; ?>><?php
            _e('Category: Remove', 'post-expirator'); ?></option>
        <?php
    } ?>
</select>
