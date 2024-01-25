<?php
use PublishPress\FuturePro\Models\SettingsModel;
?>
<tr valign="top">
    <th scope="row">
        <?php esc_html_e('Action Date Calculation Base', 'publishpress-future-pro'); ?>
    </th>
    <td>
        <?php $baseDate = $this->settingsModel->getBaseDate() ?: SettingsModel::BASE_DATE_CURRENT; ?>
        <div class="pp-settings-field-row">
            <input type="radio" name="future-action-base-date"
                id="future-action-base-date-current"
                value="current"
                <?php echo $baseDate === SettingsModel::BASE_DATE_CURRENT ? 'checked' : ''; ?>
                />
            <label for="future-action-base-date-current"><?php
                esc_html_e('Use Current Date', 'publishpress-future-pro'); ?></label>

            <p class="description offset"><?php esc_html_e('Calculates the future action date based on today\'s date.',
                'publishpress-future-pro'); ?></p>
        </div>

        <div class="pp-settings-field-row">
            <input type="radio" name="future-action-base-date"
                    id="future-action-base-date-publishing"
                    value="publishing"
                    <?php echo $baseDate === SettingsModel::BASE_DATE_PUBLISHING ? 'checked' : ''; ?> />
            <label for="future-action-base-date-publishing"><?php
                esc_html_e('Use Post\'s Publish Date', 'publishpress-future-pro'); ?></label>
            <p class="description offset">
                <?php esc_html_e('Calculates the future action date from the post\'s original publish date.',
                    'publishpress-future-pro'); ?>
            </p>
        </div>
    </td>
</tr>
