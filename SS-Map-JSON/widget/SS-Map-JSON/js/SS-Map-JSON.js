/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'ccLogger', 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, CCLogger, mapbox) {

        "use strict";

        return {

            onLoad: function(widgetModel) {

                var widget = widgetModel;

                if (!widget.site().extensionSiteSettings.CXIntegrationSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - CX Integration Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.CXIntegrationSettings;
                var ss_data = ss_settings.resourceData;
                var ss_images = ss_settings.resourceImages;
                var ss_token = ss_settings.leafletToken;

                var mapTitle = widget.mapTitle(); //change to mapTitle

                $.ajax({
                    url: ss_data + widget.jsonURL(),
                    dataType: 'json',
                    success: function(result) {
                        //var map = L.map("map").fitBounds([
                        //    [51.5, 10],
                        //    [55.5, 13]
                        //]);
                        var mymap = L.map('mapid').setView([result.centerLat, result.centerLng], 12);

                        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                            maxZoom: 18,
                            id: 'mapbox/streets-v11',
                            tileSize: 512,
                            zoomOffset: -1,
                            accessToken: ss_token
                        }).addTo(mymap);

                        var i;
                        for (i = 0; i < result.items.length; i++) {
                            var lat = result.items[i].Lat;
                            var lng = result.items[i].Lng;
                            var icon = L.divIcon({
                                className: 'custom-div-icon',
                                html: "<div style='background-color:" + result.items[i].Color + "' class='marker-pin'></div><i class='material-icons'>local_shipping</i>",
                                iconSize: [30, 42],
                                iconAnchor: [15, 42]
                            });
                            L.marker([lat, lng], {icon:icon}).addTo(mymap).bindPopup("<b>" + result.items[i].Name + "</b><br>Oil Life:&nbsp;" + result.items[i].OilLife + "<br>Mileage:&nbsp;" + result.items[i].Mileage);
                            /*
                               var circle = L.circle([lat, lng], {
                                   color: 'red',
                                   fillColor: '#f03',
                                   fillOpacity: 0.5,
                                   radius: 170
                               }).addTo(mymap).bindPopup("<b>" + result.items[i].Name + "</b><br>Oil Life:&nbsp;" + result.items[i].OilLife + "<br>Mileage:&nbsp;" + result.items[i].Mileage);
                           */
                        }
                        var popup = L.popup();

                        function onMapClick(e) {
                            popup
                                .setLatLng(e.latlng)
                                .setContent(e.latlng.toString())
                                .openOn(mymap);
                        }

                        mymap.on('click', onMapClick);
                    },
                    error: function(jqXHR, textStatus, error) {
                        CCLogger.error(widget.displayName() + "-(" + widget.id() + ")-" + textStatus + "-" + error);
                    }
                });

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
            },

            beforeAppear: function(page) {

            }

        };
    }
);
