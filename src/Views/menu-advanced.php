<?php

use PublishPressFuture\Modules\Settings\HooksAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

// Get Option
$preserveData = (bool)get_option('expirationdatePreserveData', true);

$user_roles = wp_roles()->get_names();
$plugin_facade = PostExpirator_Facade::getInstance();
?>
<div class="pp-columns-wrapper<?php echo $showSideBar ? ' pp-enable-sidebar' : ''; ?>">
    <div class="pp-column-left">
        <form method="post" id="expirationdate_save_options">
            <?php
            wp_nonce_field('postexpirator_menu_advanced', '_postExpiratorMenuAdvanced_nonce'); ?>

            <h3><?php
                _e('Advanced Options', 'post-expirator'); ?></h3>
            <p class="description"><?php
                _e(
                    'Please do not update anything here unless you know what it entails. For advanced users only.',
                    'post-expirator'
                ); ?></p>
            <?php
            $gutenberg = get_option('expirationdateGutenbergSupport', 1);
            ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row"><?php
                        _e('Block Editor Support', 'post-expirator'); ?></th>
                    <td>
                        <input type="radio" name="gutenberg-support" id="gutenberg-support-enabled"
                               value="1" <?php
                        echo intval($gutenberg) === 1 ? 'checked' : ''; ?>/> <label
                                for="gutenberg-support-enabled"><?php
                            _e('Show Gutenberg style box', 'post-expirator'); ?></label>
                        &nbsp;&nbsp;
                        <input type="radio" name="gutenberg-support" id="gutenberg-support-disabled"
                               value="0" <?php
                        echo intval($gutenberg) === 0 ? 'checked' : ''; ?>/> <label
                                for="gutenberg-support-disabled"><?php
                            _e('Show Classic Editor style box', 'post-expirator'); ?></label>
                        <p class="description"><?php
                            _e(
                                'Toggle between native support for the Block Editor or the backward compatible Classic Editor style metabox.',
                                'post-expirator'
                            ); ?></p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">
                        <?php
                        _e('Choose which user roles can use PublishPress Future', 'post-expirator'); ?>
                    </th>
                    <td class="pe-checklist">
                        <?php
                        foreach ($user_roles as $role_name => $role_label) : ?>
                            <label for="allow-user-role-<?php
                            echo esc_attr($role_name); ?>">
                                <input type="checkbox"
                                       id="allow-user-role-<?php
                                       echo esc_attr($role_name); ?>"
                                       name="allow-user-roles[]"
                                    <?php
                                    if ('administrator' === $role_name) : echo 'disabled="disabled"'; endif; ?>
                                       value="<?php
                                       echo esc_attr($role_name); ?>"
                                       <?php
                                       if ($plugin_facade->user_role_can_expire_posts(
                                           $role_name
                                       )) : ?>checked="checked"<?php
                                endif; ?>
                                />
                                <?php
                                echo esc_html($role_label); ?>
                            </label>
                        <?php
                        endforeach; ?>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">
                        <?php
                        _e('Preserve data after deactivating the plugin', 'post-expirator'); ?>
                    </th>
                    <td>
                        <input type="radio" name="expired-preserve-data-deactivating"
                               id="expired-preserve-data-deactivating-true"
                               value="1" <?php
                        echo $preserveData ? ' checked="checked"' : ''; ?>/>
                        <label for="expired-preserve-data-deactivating-true">
                            <?php
                            _e('Preserve data', 'post-expirator'); ?>
                        </label>
                        &nbsp;&nbsp;
                        <input type="radio" name="expired-preserve-data-deactivating"
                               id="expired-preserve-data-deactivating-false"
                               value="0" <?php
                        echo ! $preserveData ? ' checked="checked"' : ''; ?>/>
                        <label for="expired-preserve-data-deactivating-false">
                            <?php
                            _e('Delete data', 'post-expirator'); ?>
                        </label>
                        <p class="description">
                            <?php
                            _e(
                                'Toggle between preserving or deleting data after the plugin is deactivated.',
                                'post-expirator'
                            ); ?>
                        </p>
                    </td>
                </tr>
            </table>

            <p class="submit">
                <input type="submit" name="expirationdateSave" class="button-primary"
                       value="<?php
                       _e('Save Changes', 'post-expirator'); ?>"/>
            </p>
        </form>
    </div>

    <?php
    if ($showSideBar) {
        include __DIR__ . '/ad-banner-right-sidebar.php';
    }
    ?>
</div>
