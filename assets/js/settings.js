(function($) {
    $(document).ready(function(){
        init();
    });

    function init() {
        $('#pe-settings-tabs').tabs({
            active: $('#pe-current-tab').val(),
            activate: function( event, ui ) {
                var href = $(ui.newTab).attr('data-href');
                if(typeof href !== 'undefined'){
                    location.href = href;
                }
            }
        });
    }
})(jQuery, config);
