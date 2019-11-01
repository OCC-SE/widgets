/**
 * @fileoverview
 *
 * @author
 */
define( 
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function ($, ko) {

    "use strict";
    
    var widgetRepository = "https://raw.githubusercontent.com/OCC-SE/";

    return {

            thisTitle: ko.observable(''),
            thisLink: ko.observable(''),
            thisImage: ko.observable(''),
            thisHeight: ko.observable(''),

            onLoad: function(widgetModel) {                             
                var widget = widgetModel;

                widget.thisTitle(widget.title());
                widget.thisLink(widget.link());
                widget.thisImage(widget.image());
                widget.thisHeight(widget.height() + 'px');

                console.log("-- Loading " + widget.displayName() + "-(" + widget.id() + ")");
            },
        };
    }
);