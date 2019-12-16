/**
 * @fileoverview
 *
 * @author
 */
define( 
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'ccLogger'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function ($, ko, CCLogger) {

    "use strict";
    
    var widgetRepositor;// = "https://raw.githubusercontent.com/OCC-SE/";

    return {

            thisTitle: ko.observable(''),
            thisLink: ko.observable(''),
            thisImage: ko.observable(''),
            thisHeight: ko.observable(''),

            onLoad: function(widgetModel) {                             
                
                var widget = widgetModel;

                var ss_settings = widget.site().extensionSiteSettings.SelfServiceSettings;
                widgetRepository = ss_settings.resources;

                widget.thisTitle(widget.title());
                widget.thisLink(widget.link());
                widget.thisImage(widget.image());
                widget.thisHeight(widget.height() + 'px');

                CCLogger.info("Loading " + widget.displayName() + "-(" + widget.id() + ")");
            },
        };
    }
);