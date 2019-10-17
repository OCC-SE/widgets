/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, dataTables) {

        "use strict";
        
        var widget;

        return {

            onLoad: function(widgetModel) {
                widget = widgetModel;

                console.log("-- Loading " + widget.displayName() + "-(" + widget.id() + ")");
            },

            beforeAppear: function(page) {

            }
        };
    }
);