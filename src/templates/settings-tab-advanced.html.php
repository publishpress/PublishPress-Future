<tr valign="top">
    <th scope="row"><?php
        esc_html_e('Base Date for Action', 'publishpress-future-pro'); ?></th>
    <td>
        <?php
        $baseDate = $this->settingsModel->getBaseDate() ?: 'current';
        ?>
        <input type="radio" name="future-action-base-date"
                id="future-action-base-date-current"
                value="current" <?php
        echo $baseDate === 'current' ? 'checked' : ''; ?>/>
        <label for="future-action-base-date-current"><?php
            esc_html_e('Current date', 'publishpress-future-pro'); ?></label>
        &nbsp;&nbsp;
        <input type="radio" name="future-action-base-date"
                id="future-action-base-date-publishing"
                value="publishing" <?php
        echo $baseDate === 'publishing' ? 'checked' : ''; ?>/>
        <label for="future-action-base-date-publishing"><?php
            esc_html_e('Publishing date', 'publishpress-future-pro'); ?></label>
        <p class="description"><?php
            esc_html_e(
                '"Current date" will use the current date as the base for calculating the date offset when enabling a future action. "Publishing date" will use the current post\'s publishing date as the base for that',
                'publishpress-future-pro'
            ); ?></p>
    </td>
</tr>
