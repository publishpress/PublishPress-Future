<?php

defined('ABSPATH') or die('Direct access not allowed.');

use PublishPressFuture\Modules\Settings\HooksAbstract;
?>

<div class="pp-columns-wrapper<?php echo $showSideBar ? ' pp-enable-sidebar' : ''; ?>">
    <div class="pp-column-left">
        <form method="post" id="expirationdate_save_options">
            <?php
            wp_nonce_field('postexpirator_menu_editor', '_postExpiratorMenuEditor_nonce'); ?>

            <h3><?php
                _e('Editor', 'post-expirator'); ?></h3>
            <?php
            $gutenberg = get_option('expirationdateGutenbergSupport', 1);
            ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row"><?php
                        _e('Block Editor Support', 'post-expirator'); ?></th>
                    <td>
                        <input type="radio" name="gutenberg-support" id="gutenberg-support-enabled" value="1" <?php
                        echo intval($gutenberg) === 1 ? 'checked' : ''; ?>/> <label
                                for="gutenberg-support-enabled"><?php
                            _e('Show Gutenberg style box', 'post-expirator'); ?></label>
                        &nbsp;&nbsp;
                        <input type="radio" name="gutenberg-support" id="gutenberg-support-disabled" value="0" <?php
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
            </table>

            <p class="submit">
                <input type="submit" name="expirationdateSaveEditor" class="button-primary" value="<?php
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
<?php
