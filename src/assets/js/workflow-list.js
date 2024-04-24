jQuery(document).ready(function ($) {
    $('a').on('click', function (e) {
        e.preventDefault();

        const url = $(this).attr('href');

        var height = $(window).height();
        height = height * 0.80;

        $('<div>').dialog({
            title: 'Screenshot',
            height: "auto",
            maxHeight: height,
            resizable: false,
            width: "80%",
            modal: true,
            position: { my: "top", at: "top", of: window },
            open: function () {
                $(this).html('<img src="' + url + '" alt="Screenshot" style="max-width: 100%; height: auto;">');
                $(this).css('overflow', 'auto');
                $(this).closest('.ui-dialog').css('top', '30px');
            }
        });
    });
});
