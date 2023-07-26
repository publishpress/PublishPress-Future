(function ($) {
    $(document).ready(function () {
        if (isBlockEditorPage()) {
            return;
        }

        init();
    });

    function isBlockEditorPage() {
        return $('body').hasClass('block-editor-page');
    }

    function toggleCategorySelection(element)
    {
        if ($(element).val().indexOf('category') !== -1) {
            $('#expired-category-selection').show();
            $('#expired-category-wrapper').show();
        } else {
            $('#expired-category-selection').hide();
            $('#expired-category-wrapper').hide();
        }
    }

    function init() {
        let $selector = $('.pe-howtoexpire');
        toggleCategorySelection($selector);

        $('#enable-expirationdate').on('click', function (e) {
            if ($(this).is(':checked')) {
                $('.pe-classic-fields').show();
            } else {
                $('.pe-classic-fields').hide();
            }
        });

        $selector.on('change', function (e) {
            toggleCategorySelection(this);
        });
    }
})(jQuery);
