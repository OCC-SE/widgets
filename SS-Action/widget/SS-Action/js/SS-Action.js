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
    
    return {

            thisTitle: ko.observable(''),
            thisLink: ko.observable(''),
            thisImage: ko.observable(''),
            thisHeight: ko.observable(''),

            onLoad: function(widgetModel) {                             
                
                var widget = widgetModel;
                
                if (!widget.site().extensionSiteSettings.SelfServiceSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - Self-Service Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.SelfServiceSettings;
                var ss_images = ss_settings.resourceImages;

                widget.thisTitle(widget.title());
                widget.thisLink(widget.link());
                widget.thisImage(ss_images + "/resources/" + widget.image());
                widget.thisHeight(widget.height() + 'px');

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
            },
        };
    }
);