/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'ccLogger', 'https://api.pushio.com/webpush/sdk/wpIndex_min.js'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, CCLogger, webpush) {

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
                            CCLogger.error('Responsys: Not a valid email address');
                            return;
                        } else {
                            //https://demo033z0.rsys5.net/pub/rf?_ri_=X0Gzc2X%3DYQpglLjHJlYQGsLOAT2zfN4rzd40DBzei7oPhkTjfHcNT0RI7TKVwjpnpgHlpgneHmgJoXX0Gzc2X%3DYQpglLjHJlYQGN6gzgzbSzbzazcaf6oaYcvazfwN6TjfHcNT0RI7TK&EMAIL_ADDRESS_='+email+'&EMAIL_PERMISSION_STATUS_=I
                            var url = ss_settings.responsysURL + '?_ri=' + ss_settings.responsysStayTouchRI + '&EMAIL_ADDRESS_=' + email + '&EMAIL_PERMISSION_STATUS_=I';
                            $.ajax({
                                type: "POST",
                                async: true,
                                crossDomain: true,
                                headers: {
                                    "Accept": "*//*"
                                },
                                url: url,
                                success: function(result) {
                                    alert('Welcome! Your email address has been added.');
                                    webPushManagerAPI.setUserId(email);
                                    CCLogger.info('Responsys Stay in Touch success - ' + email);
                                    CCLogger.info(result);
                                },
                                error: function (xhr, status, error) {
                                    //CORS policy error occurs but the submission still works so provide a confirmation message
                                    alert('Welcome! Your email address has been added.');
                                    webPushManagerAPI.setUserId(email);
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
