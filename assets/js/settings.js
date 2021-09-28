(function ($) {
    $(document).ready(function () {
        init();
    });

    function init() {
        $('.pe-custom-date-toggle').on('change', function (e) {
            if ($(this).val() === 'custom') {
                $(this).siblings('.pe-custom-date-container').show();
            } else {
                $(this).siblings('.pe-custom-date-container').hide();
            }
        });
    }
})(jQuery, config);
