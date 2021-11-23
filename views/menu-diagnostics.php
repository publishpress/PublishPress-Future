<form method="post" id="postExpiratorMenuUpgrade">
    <?php
    wp_nonce_field('postexpirator_menu_diagnostics', '_postExpiratorMenuDiagnostics_nonce'); ?>
    <h3><?php
        _e('Advanced Diagnostics', 'post-expirator'); ?></h3>
    <table class="form-table">
        <tr valign="top">
            <th scope="row"><label for="postexpirator-log"><?php
                    _e('Debug Logging', 'post-expirator'); ?></label></th>
            <td>
                <?php
                if (POSTEXPIRATOR_DEBUG) {
                    echo '
								<input type="submit" class="button" name="debugging-disable" id="debugging-disable" value="(' . __(
                            'Status: Enabled',
                            'post-expirator'
                        ) . ') ' . __('Disable Debugging', 'post-expirator') . '" />
								<br/><a href="' . admin_url(
                            'options-general.php?page=post-expirator.php&tab=viewdebug'
                        ) . '">' . __('View Debug Logs', 'post-expirator') . '</a>';
                } else {
                    echo '<input type="submit" class="button" name="debugging-enable" id="debugging-enable" value="(' . __(
                            'Status: Disabled',
                            'post-expirator'
                        ) . ') ' . __('Enable Debugging', 'post-expirator') . '" />';
                }
                ?>
            </td>
        </tr>
        <tr valign="top">
            <th scope="row"><?php
                _e('Purge Debug Log', 'post-expirator'); ?></th>
            <td>
                <input type="submit" class="button" name="purge-debug" id="purge-debug" value="<?php
                _e('Purge Debug Log', 'post-expirator'); ?>"/>
            </td>
        </tr/>
        <tr valign="top">
            <th scope="row"><?php
                _e('WP-Cron Status', 'post-expirator'); ?></th>
            <td>
                <?php
                if (defined('DISABLE_WP_CRON') && DISABLE_WP_CRON === true) {
                    _e('DISABLED', 'post-expirator');
                } else {
                    _e('ENABLED - OK', 'post-expirator');
                }
                ?>
            </td>
        </tr/>
        <tr valign="top">
            <th scope="row"><label for="cron-schedule"><?php
                    _e('Current Cron Schedule', 'post-expirator'); ?></label></th>
            <td>
                <p><?php
                    _e(
                        'The below table will show all currently scheduled cron events with the next run time.',
                        'post-expirator'
                    ); ?></p>

                <div class="pe-scroll">
                    <table cellspacing="0" class="striped">
                        <tr>
                            <th style="width: 30%"><?php
                                _e('Date', 'post-expirator'); ?></th>
                            <th style="width: 30%;"><?php
                                _e('Event', 'post-expirator'); ?></th>
                            <th style="width: 30%;"><?php
                                _e('Arguments / Schedule', 'post-expirator'); ?></th>
                        </tr>
                        <?php
                        $cron = _get_cron_array();
                        foreach ($cron as $key => $value) {
                            foreach ($value as $eventkey => $eventvalue) {
                                $class = $eventkey === 'postExpiratorExpire' ? 'pe-event' : '';
                                print '<tr class="' . $class . '">';
                                print '<td>' . date_i18n('r', $key) . '</td>';
                                print '<td>' . $eventkey . '</td>';
                                $arrkey = array_keys($eventvalue);
                                print '<td>';
                                foreach ($arrkey as $eventguid) {
                                    print '<table><tr>';
                                    if (empty($eventvalue[$eventguid]['args'])) {
                                        print '<td>' . __('No Arguments', 'post-expirator') . '</td>';
                                    } else {
                                        print '<td>';
                                        $args = array();
                                        foreach ($eventvalue[$eventguid]['args'] as $key => $value) {
                                            $args[] = "$key => $value";
                                        }
                                        print implode("<br/>\n", $args);
                                        print '</td>';
                                    }
                                    if (empty($eventvalue[$eventguid]['schedule'])) {
                                        print '<td>' . __('Single Event', 'post-expirator') . '</td>';
                                    } else {
                                        print '<td>' . $eventvalue[$eventguid]['schedule'] . ' (' . $eventvalue[$eventguid]['interval'] . ')</td>';
                                    }
                                    print '</tr></table>';
                                }
                                print '</td>';
                                print '</tr>';
                            }
                        }
                        ?>
                    </table>
                </div>
            </td>
        </tr>
    </table>
</form>
