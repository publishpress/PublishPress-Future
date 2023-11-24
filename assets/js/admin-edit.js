(function ($, config) {
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
