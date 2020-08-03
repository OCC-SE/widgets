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
    function($, ko, CCLogger) {

        "use strict";

        return {

            kpiImage: ko.observable(''),

            onLoad: function(widgetModel) {

                var widget = widgetModel;

                if (!widget.site().extensionSiteSettings.CXIntegrationSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - CX Integration Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.CXIntegrationSettings;
                var ss_data = ss_settings.resourceData;
                var ss_images = ss_settings.resourceImages;

                widget.kpiImage(ss_images + "resources/" + widget.image());


                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ") - " + widget.title());
            }
        };
    }
);
