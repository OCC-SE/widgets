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

            window.globalWidget = widgetModel;
		    var widget = widgetModel;
		    
            if (!widget.site().extensionSiteSettings.CXIntegrationSettings) {
                CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - CX Integration Settings not found");
                return;
            }

            var ss_settings = widget.site().extensionSiteSettings.CXIntegrationSettings;            
            
            var tag = "<script type='text/javascript' src='"+ss_settings.maxymiserURL+"' async=false></script>";
            $('head').append(tag);
            
            CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
        }
    };
  }
);