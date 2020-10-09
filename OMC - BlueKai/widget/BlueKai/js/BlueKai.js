/**
 *  @fileoverview
 *  @author 
 */

define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------

    ['knockout', 'jquery', 'ccLogger'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function (ko, $, CCLogger) {
    
        "use strict";

        return {
        
            onLoad: function (widgetModel) {
                
                window.globalWidget = widgetModel;
                var widget = widgetModel;
                
                if (!widget.site().extensionSiteSettings.CXIntegrationSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - CX Integration Settings not found");
                    return;
                }
    
                var ss_settings = widget.site().extensionSiteSettings.CXIntegrationSettings;
                var bluekaiURL = ss_settings.bluekaiURL;

                var arr = document.URL.match(/e_id_s=([a-z0-9]+)/);
                if (arr !== null) {
                    var imgSrc = bluekaiURL + "?e_id_s=" + arr[1];
                    //var imgSrc = "https://stags.bluekai.com/site/30151?e_id_s=" + arr[1];
                    var img = $("<img/>", { width:1, height:1, src: imgSrc, hidden:true });
                    $("body").append(img); 
                }

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");                
            }

        };
    }
);