/******/ (() => { // webpackBootstrap
/*!***************************************!*\
  !*** ./assets/jsx/future-actions.jsx ***!
  \***************************************/
jQuery(document).ready(function ($) {
  $(".publishpress-future-log-entries-popup").dialog({
    autoOpen: false,
    modal: true,
    width: 800,
    title: publishpressFutureActionsConfig.dialogTitle,
    buttons: {
      "Close": function Close() {
        $(this).dialog("close");
      }
    }
  });
  $("a.publishpres-future-view-log").on('click', function (e) {
    e.preventDefault();
    var id = $(this).data('id');
    var logElement = $.find(".publishpress-future-log-".concat(id));
    $(logElement).dialog("open");
  });
});
/******/ })()
;
//# sourceMappingURL=futureActions.js.map