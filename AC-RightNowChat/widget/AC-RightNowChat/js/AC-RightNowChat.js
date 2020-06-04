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

            onLoad: function(widgetModel) {

                var widget = widgetModel;

                //if (!widget.site().extensionSiteSettings.CXIntegrationSettings) {
                //    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - CX Integration Settings not found");
                //    return;
                //}

                //var ss_settings = widget.site().extensionSiteSettings.CXIntegrationSettings;

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
            },

            beforeAppear: function(page) {

                var widget = this;

                var inlayHtml = '<inlay-oracle-chat-embedded id="chatInlay" class="inlay" site-url="' + widget.siteURL() + '"></inlay-oracle-chat-embedded>';
                //var inlayHtml = '<inlay-oracle-chat-embedded id="chatInlay" class="inlay" site-url="rnowgse11039.widget.rightnowdemo.com"></inlay-oracle-chat-embedded>';
                var div = document.createElement("div");
                div.innerHTML = inlayHtml;
                $("body").append(div);

                var inlayScript = document.createElement("script");
                inlayScript.src =  widget.siteScript(); //"https://rnowgse11039.widget.rightnowdemo.com/s/oit/latest/common/v0/libs/oit/loader.js";
                inlayScript.id = "oit-loader";
                inlayScript.async = true;
                inlayScript.setAttribute("data-oit-theme", "midnight");
                $("body").append(inlayScript);
            }
        };
    }
);