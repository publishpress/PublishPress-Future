<?php

use PublishPress\FuturePro\Models\SettingsModel;

?>
<tr valign="top">
    <th scope="row">
        <?php esc_html_e('Action Date Calculation Base', 'publishpress-future-pro'); ?>
    </th>
    <td>
        <?php
            // @phpstan-ignore variable.undefined
            $baseDate = $this->settingsModel->getBaseDate() ?: SettingsModel::BASE_DATE_CURRENT;
        ?>
        <div class="pp-settings-field-row">
            <input type="radio" name="future-action-base-date"
                id="future-action-base-date-current"
                value="current"
                <?php echo $baseDate === SettingsModel::BASE_DATE_CURRENT ? 'checked' : ''; ?>
                />
            <label for="future-action-base-date-current"><?php
                esc_html_e('Use Current Date', 'publishpress-future-pro'); ?></label>

            <p class="description offset"><?php esc_html_e(
                'Calculates the future action date based on today\'s date.',
                'publishpress-future-pro'
            ); ?></p>
        </div>

        <div class="pp-settings-field-row">
            <input type="radio" name="future-action-base-date"
                    id="future-action-base-date-publishing"
                    value="publishing"
                    <?php echo $baseDate === SettingsModel::BASE_DATE_PUBLISHING ? 'checked' : ''; ?> />
            <label for="future-action-base-date-publishing"><?php
                                        esc_html_e('Use Post\'s Publish Date', 'publishpress-future-pro'); ?></label>
            <p class="description offset">
                <?php esc_html_e(
                    'Calculates the future action date from the post\'s original publish date.',
                    'publishpress-future-pro'
                ); ?>
            </p>
        </div>
    </td>
</tr>
<!-- Enable experimental features -->
<?php if (PUBLISHPRESS_FUTURE_WORKFLOW_EXPERIMENTAL) : ?>
    <tr valign="top">
        <th scope="row">
            <?php esc_html_e('Experimental Features', 'publishpress-future-pro'); ?>
        </th>
        <td>
            <div class="pp-settings-field-row">
                <input type="radio" name="future-experimental-features"
                        id="future-experimental-features-enabled"
                        value="1"
                        <?php echo $this->settingsModel->getExperimentalFeaturesStatus() ? 'checked' : ''; ?> />
                <label for="future-experimental-features-enabled"><?php
                    esc_html_e('Enabled', 'publishpress-future-pro'); ?></label>
                <p class="description offset">
                    <?php esc_html_e(
                        'Enable experimental features that are still in development and may not be fully functional.',
                        'publishpress-future-pro'
                    ); ?>
                </p>
            </div>
            <div class="pp-settings-field-row">
                <input type="radio" name="future-experimental-features"
                        id="future-experimental-features-disabled"
                        value="0"
                        <?php echo !$this->settingsModel->getExperimentalFeaturesStatus() ? 'checked' : ''; ?> />
                <label for="future-experimental-features-disabled"><?php
                    esc_html_e('Disabled', 'publishpress-future-pro'); ?></label>
                <p class="description offset">
                    <?php esc_html_e(
                        'Disable all experimental features.',
                        'publishpress-future-pro'
                    ); ?>
                </p>
            </div>
        </td>
    </tr>
<?php endif; ?>
<!-- Enable step schedule's compressed args -->
<tr valign="top">
    <th scope="row">
        <?php esc_html_e('Workfllow Step Schedule\'s Arguments Compression', 'publishpress-future-pro'); ?>
    </th>
    <td>
        <div class="pp-settings-field-row">
            <input type="radio" name="future-step-schedule-compressed-args"
                id="future-step-schedule-compressed-args-enabled"
                value="1"
                <?php echo $this->settingsModel->getStepScheduleCompressedArgsStatus() ? 'checked' : ''; ?> />
            <label for="future-step-schedule-compressed-args-enabled"><?php
                esc_html_e('Compress the arguments', 'publishpress-future-pro'); ?></label>
            <p class="description offset">
                <?php esc_html_e(
                    'Compress the arguments of the step schedule to save memory in the database, saving them as binary data.', // phpcs:ignore Generic.Files.LineLength.TooLong
                    'publishpress-future-pro'
                ); ?>
            </p>
        </div>
        <div class="pp-settings-field-row">
            <input type="radio" name="future-step-schedule-compressed-args"
                id="future-step-schedule-compressed-args-disabled"
                value="0"
                <?php echo !$this->settingsModel->getStepScheduleCompressedArgsStatus() ? 'checked' : ''; ?> />
            <label for="future-step-schedule-compressed-args-disabled"><?php
                esc_html_e('Do not compress the arguments', 'publishpress-future-pro'); ?></label>
            <p class="description offset">
                <?php esc_html_e(
                    'Do not compress the arguments of the step schedule, storing them as plain text.',
                    'publishpress-future-pro'
                ); ?>
            </p>
        </div>
    </td>
</tr>
