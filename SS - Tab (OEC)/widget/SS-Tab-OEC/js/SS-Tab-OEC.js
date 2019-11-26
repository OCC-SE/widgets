/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, dataTables) {

        "use strict";
        
        function buildTable(tab,widget) {
            var table;
            if (tab == 'Service') {
                table = $('#listing').DataTable( {
                            processing: true,
                            data: widget.dataTable,
                            columns: [
                                {"title": "Critical"}, 
                                {"title": "Severity"},
                                {"title": "Reference Number"},
                                {"title": "Title"},
                                {"title": "Channel Type"},
                                {"title": "Last Updated Date"},
                                {"title": "Account"},
                                {"title": "Status"}
                            ],
                            order: [[ 5, "desc" ]],                            
                            columnDefs: [
                                {targets: 0,orderable: false,data: "download_link",
                                render: function(data, type, row, meta) {
                                                var image = '';
                                                if (row[0] == true) {image = '<img alt="Critical" src="' + widgetRepository + 'images/master/tables/qual_alert_16.png">';} 
                                                return image;}
                                },   
                                {targets: 4,
                                orderable: false,
                                data: "download_link",
                                render: function(data, type, row, meta) {
                                                var image = '';
                                                var alt = row[4];
                                                if (alt == 'Chat') {
                                                    image = '<img alt="'+alt+'" src="' + widgetRepository + 'images/master/tables/qual_personchat_16.png">&nbsp;' + alt;
                                                } else if (alt == 'E-Mail') {
                                                    image = '<img alt="'+alt+'" src="' + widgetRepository + 'images/master/tables/qual_envelope_16.png">&nbsp;' + alt;
                                                } else if (alt == 'Web') {
                                                    image = '<img alt="'+alt+'" src="' + widgetRepository + 'images/master/tables/qual_globe_16.png">&nbsp;' + alt;
                                                } else if (alt == 'Phone') {
                                                    image = '<img alt="'+alt+'" src="' + widgetRepository + 'images/master/tables/qual_phone_16.png">&nbsp;' + alt;
                                                } else {
                                                    image = '<img alt="'+alt+'" src="' + widgetRepository + 'images/master/tables/qual_people_16.png">&nbsp;' + alt;
                                                }
                                                return image;
                                            }
                                },{targets: [5], type: "date", 
                                render: function (value) {
                                                            if (value === null) return "";
                                                            var mydate = new Date(value);
                                                            var yyyy = mydate.getFullYear().toString();
                                                            var mm = (mydate.getMonth() + 1).toString(); // getMonth() is zero-based   
                                                            var dd = mydate.getDate().toString();
                                                            var parts = (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]) + '/' + yyyy;
                                                            var mydatestr = new Date(parts);                                                                        
                                                            return mydatestr.toLocaleDateString();             
                                            }
                                },{targets:[1,3,4],orderable: false}
                            ],
                            language: {emptyTable: "No " + tab.toLowerCase() + " found"},                            
                            destroy: true
                        });         
            } else if (tab == 'Subscriptions') {
                table = $('#listing').DataTable( {
                            processing: true,
                            data: widget.dataTable,
                            columns: [
                                {"title": "Subscription Number"}, 
                                {"title": "Customer"},
                                {"title": "Total Contract Value"},
                                {"title": "Start Date"},
                                {"title": "End Date"},
                                {"title": "Status"},
                                {"title": "Term"}
                            ],
                            order: [[ 4, "desc" ]],
                            columnDefs: [
                                {targets: [3,4], type: "date", 
                                render: function (value) {
                                                            if (value === null) return "";
                                                            var mydate = new Date(value);
                                                            var yyyy = mydate.getFullYear().toString();
                                                            var mm = (mydate.getMonth() + 1).toString(); // getMonth() is zero-based   
                                                            var dd = mydate.getDate().toString();
                                                            var parts = (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]) + '/' + yyyy;
                                                            var mydatestr = new Date(parts);                                                                        
                                                            return mydatestr.toLocaleDateString();             
                                            }
                                },                                 
                                {type: "num-fmt", targets: 2, render: $.fn.dataTable.render.number( ',', '.', 2, '$' ) },
                                {targets: 5,orderable: false,data: "download_link",
                                render: function(data, type, row, meta) {
                                            var image;
                                            var alt = row[5];
                                            if (row[5] == 'ORA_ACTIVE') {
                                                image = widgetRepository + "images/master/tables/green_check.png";
                                            } else if (row[5] == 'ORA_CLOSED') {
                                                image = widgetRepository + "images/master/tables/red_x.png";
                                            } else {
                                                image = widgetRepository + "images/master/tables/warning.png";
                                            }
                                        return '<img alt="' + alt + '" src="' + image + '" height="20px" widgth="20px"> ' + alt;
                                    }
                                },
                                {targets: 7,orderable: false,data: "download_link",
                                render: function(data, type, row, meta) {
                                            var dispValue;
                                            if (row[5] == 'ORA_ACTIVE') {
                                                return '';
                                            } else  {
                                                dispValue = '<input class="cc-button-primary" type="button" value="Renew">';
                                            }                                 
                                            return dispValue;
                                    }                                    
                                }                                  
                            ],
                            language: {emptyTable: "No " + tab.toLowerCase() + " found"},                            
                            destroy: true
                        });                         
            } else if (tab == 'Contacts') {
                table = $('#listing').DataTable( {
                            processing: true,
                            data: widget.dataTable,
                            columns: [
                                {"title": "Favorite"}, 
                                {"title": "Name"},
                                {"title": "Account"},
                                {"title": "Job Title"},
                                {"title": "Phone"},
                                {"title": "Email"}
                            ],
                            //order: [[ 5, "desc" ]],                            
                            columnDefs: [
                                {targets: 0,orderable: false,data: "download_link",
                                render: function(data, type, row, meta) {
                                                var image = '';
                                                if (row[0] == 'true') {
                                                    image = '<img alt="Favorite" src="' + widgetRepository + 'images/master/tables/star.png" height="20px" width="20px">';
                                                    
                                                } 
                                                return image;
                                        }
                                },
                                {targets:[4],orderable: false}
                            ],
                            language: {emptyTable: "No " + tab.toLowerCase() + " found"},                            
                            destroy: true
                        }); 
            }
            return table;                
        }

        var widgetRepository = "https://raw.githubusercontent.com/OCC-SE/";
        var tabTypes = ['Invoices','Orders','Repeat','Subscriptions','Leads','Contacts','Opportunities','Installed','Quotes','Service'];
        var tabUsed = [];
        var queryRun = [];

        return {

            tabTotal: ko.observable(),
            tabDisplay: ko.observable(''),
            dataTable: ko.observable(),

            onLoad: function(widgetModel) {
                var widget = widgetModel;
                
                var tab = widget.tabName();

                widget.tabImage = widgetRepository + "images/master/tabs/" + widget.tabName().toLowerCase() + ".png";
                
                var qAuth = widget.authType(); //"Basic bmF0YWxpZS50aG9tcHNvbjpUV0M3ODY3Mw==";
                
                var qUrl;
                var qOwner;
                var qFields;
                if (tab == 'Service') {
                    qUrl = widget.serverURL() + '/crmRestApi/resources/latest/serviceRequests/';
                    qOwner = '?q=' + widget.owner(); //PrimaryContactPartyName=Lisa Lauber';
                    qFields = '&fields=CriticalFlag,SeverityCdMeaning,SeverityRank,SrNumber,Title,ChannelTypeCdMeaning,LastUpdateDate,AccountPartyName,StatusCdMeaning';
                } else if (tab == 'Subscriptions') {
                    qUrl = widget.serverURL() + '/crmRestApi/resources/latest/subscriptions/';
                    qOwner = '?q=' + widget.owner(); //PrimaryPartyId=300000177639444';
                    qFields = '';
                } else if (tab == 'Contacts') {
                    qUrl = widget.serverURL() + '/crmRestApi/resources/latest/contacts/';
                    qOwner = '?q=' + widget.owner(); //PrimaryPartyId=300000177639444';
                    qFields = '';
                }
                
                $.ajax({
                    type: "GET",
                    async: true,
                    crossDomain: true,
                    headers: {
                        "Authorization": qAuth,
                        "Accept": "*/*"
                    },                        
                    url: qUrl + qOwner + qFields,
                    success: function(response) {
                        var dataSet = [];
                        if (tab == 'Service') {
                            for (var i=0; i<response.items.length; i++) {
                              var cf = response.items[i].CriticalFlag;
                              var sc = response.items[i].SeverityCdMeaning;
                              var sr = response.items[i].SeverityRank;
                              var sn = response.items[i].SrNumber;
                              var t = response.items[i].Title;
                              var ct = response.items[i].ChannelTypeCdMeaning;
                              var ld = response.items[i].LastUpdateDate;
                              var ap = response.items[i].AccountPartyName;
                              var st = response.items[i].StatusCdMeaning;
                              dataSet[i] = [cf, sr + ' - ' + sc, sn, t, ct, ld, ap, st];
                            }
                        } else if (tab == 'Subscriptions') {
                            for (var j=0; j<response.items.length; j++) {
                                var aj = response.items[j].SubscriptionNumber;
                                var bj = response.items[j].PrimaryPartyName;
                                var cj = response.items[j].TotalContractValue;
                                var dj = response.items[j].StartDate;
                                var ej = response.items[j].EndDate;
                                var fj = response.items[j].Status;
                                var gj = response.items[j].Duration;
                                if (gj === null) {
                                    gj = '';
                                }
                                var hj = response.items[j].Period;
                                if (hj === null) {
                                    hj = '';
                                }
                                dataSet[j] = [aj,bj,cj,dj,ej,fj,gj + ' ' + hj];
                            }  
                        } else if (tab == 'Contacts') {
                            for (var k=0; k<response.items.length; k++) {
                                var ak = response.items[k].FavoriteContactFlag;
                                var bk = response.items[k].ContactName;
                                var ck = response.items[k].JobTitle;
                                var dk = response.items[k].EmailAddress;
                                var ek = response.items[k].AccountName;
                                var fk = response.items[k].OverallPrimaryFormattedPhoneNumber;
                                dataSet[k] = [ak,bk,ek,ck,fk,dk];
                            }
                        }
                        widget.dataTable = dataSet;
                        widget.tabTotal(response.items.length);
                        widget.tabDisplay(tab + ' (' + response.items.length + ')');                       
                    },
                    error: function(jqXHR, textStatus, error) {
                        console.log('ERROR: ' + widget.displayName() + "-(" + widget.id() + ")-" + textStatus + "-" + error);
                        widget.tabTotal(0);
                        widget.tabDisplay(tab + ' (0)');
                    }
                });
                
                console.log("-- Loading " + widget.displayName() + "-(" + widget.id() + ")");
            },

            beforeAppear: function(page) {
                var widget = this;
                $(document).ready(function() {
                    var tab = widget.tabName();
                    //var tabTrim = widget.tabName().replace(' ','');
                    if (!tabUsed.includes(tab)) {
                        //$('#tab-'+ tabTrim).on('click', function() {
                        $('#tab-'+ tab).on('click', function() {                            
                            //$("#tab-"+tabTrim).attr('class', 'imglink-selected');
                            $("#tab-"+tab).attr('class', 'imglink-selected');                            
                            for (var i=0; i<tabTypes.length; i++) {
                                if (tabTypes[i]!=tab) {
                                    $("#tab-"+tabTypes[i]).attr('class', 'imglink');
                                }
                            }
                            if ($.fn.DataTable.isDataTable('#listing')) {
                                $('#listing').DataTable().clear().destroy();
                                $('#listing').empty();
                            }                            
                            buildTable(tab,widget);
                        });
                        tabUsed.push(tab);
                    }
                });
            }            
        };
    }
);