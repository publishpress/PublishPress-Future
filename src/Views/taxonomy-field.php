<?php

echo '<select name="' . esc_attr($name) . '" id="' . esc_attr($id) . '"' . ($disabled === true ? ' disabled="disabled"' : '') . ' onchange="' . esc_attr($onchange) . '">';

foreach ($taxonomies as $taxonomy) {
    echo '<option value="' . esc_attr($taxonomy->name) . '" ' . ($selected === esc_attr($taxonomy->name) ? 'selected="selected"' : '') . '>' . esc_html($taxonomy->label) . '</option>';
}

echo '</select>';
echo '<p class="description">' . esc_html__(
        'Select the hierarchical taxonomy to be used for "category" based expiration.',
        'post-expirator'
    ) . '</p>';
