(function ($, config) {
    // show/hide the date fields when the user chooses the intent in bulk edit
    $('body').on('change', 'select[name="expirationdate_status"]', function (e) {
        var $show = $(this).find('option:selected').attr('data-show-fields');
        if ($show === 'true') {
            $(this).parents('.pe-qe-fields').find('.post-expirator-date-fields').show();
        } else {
            $(this).parents('.pe-qe-fields').find('.post-expirator-date-fields').hide();
        }
    });

    // show/hide the date fields when the user chooses the intent in quick edit
    $('body').on('click', 'input[name="enable-expirationdate"]', function (e) {
        if ($(this).is(':checked')) {
            $(this).parents('.post-expirator-quickedit').find('.pe-qe-fields').show();
        } else {
            $(this).parents('.post-expirator-quickedit').find('.pe-qe-fields').hide();
        }
    });

    // hide/show the categories selection checkbox list in bulk/quick edit
    $('body').on('change', 'select[name="expirationdate_expiretype"]', function (e) {
        var $show = $(this).val().indexOf('category') !== -1;
        if ($show) {
            $(this).parents('.pe-qe-fields').find('.pe-category-list').show();
        } else {
            $(this).parents('.pe-qe-fields').find('.pe-category-list').hide();
        }
    });

    // we create a copy of the WP bulk edit post function
    var $wp_bulk_edit = inlineEditPost.setBulk;

    // and then we overwrite the function with our own code
    inlineEditPost.setBulk = function (id) {
        // "call" the original WP edit function
        // we don't want to leave WordPress hanging
        $wp_bulk_edit.apply(this, arguments);

        var $bulk_row = $('#bulk-edit');

        // hide the fields for bulk edit till action is taken by the user
        $bulk_row.find('.pe-qe-fields select[name="expirationdate_status"]').prop('selectedIndex', 0);
        $bulk_row.find('.pe-qe-fields .post-expirator-date-fields').hide();
        $bulk_row.find('.pe-qe-fields .pe-category-list').hide();
        $bulk_row.find('.pe-qe-fields input').removeClass('invalid');
    };

    // we create a copy of the WP inline edit post function
    var $wp_inline_edit = inlineEditPost.edit;

    // and then we overwrite the function with our own code
    inlineEditPost.edit = function (id) {

        // "call" the original WP edit function
        // we don't want to leave WordPress hanging
        $wp_inline_edit.apply(this, arguments);

        // now we take care of our business

        // get the post ID
        var $post_id = 0;
        if (typeof (id) == 'object') {
            $post_id = parseInt(this.getId(id));
        }

        if ($post_id > 0) {
            // define the edit row
            var $edit_row = $('#edit-' + $post_id);

            // get / set year
            var $year = $('#expirationdate_year-' + $post_id).val();
            $edit_row.find('input[name="expirationdate_year"]').val($year);

            // get / set month
            var $month = $('#expirationdate_month-' + $post_id).val();
            $edit_row.find('select[name="expirationdate_month"]').val($month);

            // get / set day
            var $day = $('#expirationdate_day-' + $post_id).val();
            $edit_row.find('input[name="expirationdate_day"]').val($day);

            // get / set hour
            var $hour = $('#expirationdate_hour-' + $post_id).val();
            $edit_row.find('input[name="expirationdate_hour"]').val($hour);

            // get / set minute
            var $minute = $('#expirationdate_minute-' + $post_id).val();
            $edit_row.find('input[name="expirationdate_minute"]').val($minute);

            // expire type
            var $type = $('#expirationdate_expireType-' + $post_id).val();
            $edit_row.find('select[name="expirationdate_expiretype"]').val($type);

            // enabled or not
            var $enabled = $('#expirationdate_enabled-' + $post_id).val();
            if ($enabled == "true") {
                $edit_row.find('input[name="enable-expirationdate"]').prop('checked', true);
                $edit_row.find('.pe-qe-fields').show();
            }

            // categories
            $edit_row.find('input[name="expirationdate_category[]"]').prop('checked', false);
            var $categories = $('#expirationdate_categories-' + $post_id).val();
            if ($categories !== '') {
                $.each($categories.split(','), function (index, value) {
                    $edit_row.find('input[name="expirationdate_category[]"][value="' + value + '"]').prop('checked', true);
                });
            }

            // show or hide categories
            if ($type.indexOf('category') !== -1) {
                $edit_row.find('.pe-category-list').show();
            } else {
                $edit_row.find('.pe-category-list').hide();
            }
        }
    };

    function validateBulkFields()
    {
        const $statusField = $('#bulk-edit').find('.pe-qe-fields select[name="expirationdate_status"]');

        if ($statusField.val() === 'no-change' || $statusField.val() === 'remove-only') {
            return true;
        }

        const fields = [
            'expirationdate_day',
            'expirationdate_year',
            'expirationdate_hour',
            'expirationdate_minute'
        ];

        let isValid = true;

        let $field;
        let value;
        for (let i = 0; i < fields.length; i++) {
            $field = $('#bulk-edit').find('.pe-qe-fields input[name="' + fields[i] + '"]');

            $field.removeClass('invalid');

            value = parseInt($field.val());
            if (['expirationdate_hour', 'expirationdate_minute'].includes($field.prop('name'))) {
                if (isNaN(value) || value < 0) {
                    $field.addClass('invalid');
                    isValid = false;
                }
            } else if (isNaN(value) || value <= 0) {
                $field.addClass('invalid');
                isValid = false;
            }
        }

        return isValid;
    }

    $('.pe-qe-fields input[name="expirationdate_day"]').on('blur', validateBulkFields);
    $('.pe-qe-fields input[name="expirationdate_year"]').on('blur', validateBulkFields);
    $('.pe-qe-fields input[name="expirationdate_hour"]').on('blur', validateBulkFields);
    $('.pe-qe-fields input[name="expirationdate_minute"]').on('blur', validateBulkFields);

    if ($('.post-expirator-quickedit').length > 0) {
        $('#bulk_edit').on('click', function(e) {
            const isValid = validateBulkFields();
            if (! isValid) {
                e.preventDefault();

                return false;
            }
        });
    }
})(jQuery, postexpiratorConfig);
