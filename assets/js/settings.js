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

        $('.pe-custom-date-toggle').on('change', function(e){
            if($(this).val() === 'custom') {
                $(this).siblings('.pe-custom-date-container').show();
            }else{
                $(this).siblings('.pe-custom-date-container').hide();
            }
        });
    }
})(jQuery, config);
