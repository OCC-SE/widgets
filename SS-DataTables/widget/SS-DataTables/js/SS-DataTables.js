/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js', 'ccLogger'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, dataTables, CCLogger) {

        "use strict";
        
        return {

            onLoad: function(widgetModel) {
                var widget = widgetModel;
                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
            },

            beforeAppear: function(page) {
                /* //ACTION BAR
                $('#listing').show();
                $('#action_bar').hide();
                $('#asset_form').hide();
                $('#asset_add').on('click', function() {
                    $('#action_bar').hide();
                    $('#asset_form').show();
                    //$('#listing').hide();
                    $('#listing').DataTable().clear().destroy();
                    $('#listing').empty();
                });
                 */
            }
        };
    }
);