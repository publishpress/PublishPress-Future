/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
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
    $(".publishpress-future-log-" + id).dialog("open");
  });
});
/******/ })()
;
//# sourceMappingURL=futureActions.js.map