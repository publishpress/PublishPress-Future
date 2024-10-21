jQuery(document).ready(function ($) {
    $(".publishpress-future-log-entries-popup").dialog(
        {
            autoOpen: false,
            modal: true,
            width: 800,
            title: publishpressFutureActionsConfig.dialogTitle,
            buttons: {
                "Close": function () {
                    $(this).dialog("close");
                }
            }
        }
    );

    $("a.publishpres-future-view-log").on('click', function (e) {
        e.preventDefault();
        const id = $(this).data('id');

        $(".publishpress-future-log-" + id).dialog("open");
    });
});
