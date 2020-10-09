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

            beforeAppear: function(page) {
                var widget = this;

                if (!widget.site().extensionSiteSettings.CXIntegrationSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - CX Integration Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.CXIntegrationSettings;

                $(function(){
                    $("#stayInTouchButton").click(function(){
                        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                        var email = $('#stayInTouchValue').val();
                        if (!regex.test(email)) {
                            alert('Please enter a valid email address.');
                            CCLogger.error('Eloqua: Not a valid email address');
                            return;
                        } else {
                            //var url = "https://s1650439596.t.eloqua.com/e/f2";
                            var url = ss_settings.eloquaURL;
                            $.ajax({
                                url: url,
                                type: "POST",
                                async: true,
                                crossDomain: true,
                                headers: {
                                    "Accept": "*//*",
                                    "Content-Type": "application/x-www-form-urlencoded",
                                },
                                data: {
                                    "elqFormName": ss_settings.eloquaForm, //UntitledForm-1586289965283,
                                    "elqSiteId": ss_settings.eloquaSiteID,//1650439596,
                                    "emailAddress": email
                                },
                                success: function(result) {
                                    alert('Welcome! Your email address has been added.');
                                    CCLogger.info('Eloqua Stay in Touch success - ' + email);
                                    CCLogger.info(result);
                                },
                                error: function (xhr, status, error) {
                                    CCLogger.error(xhr.statusText);
                                }
                            });
                        }
                    });
                });
                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
            }
        };
    }
);
