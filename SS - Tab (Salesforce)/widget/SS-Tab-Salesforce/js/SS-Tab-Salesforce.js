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
        
        function getConfig(tab) {
            var table;
            if (tab == 'Leads') {
                table = $('#listing').DataTable( {
                            "processing": true,
                            "data": widget.leadsDataset,
                            "columns": [
                                {"title": "Name"}, 
                                {"title": "Company"},
                                {"title": "Title"},
                                {"title": "Product Interest"},
                                {"title": "Status"},
                                {"title": "Email"},
                                {"title": "Phone"},
                                {"title": "Last Modified"},
                                {"title": ""}
                            ],
                            "columnDefs": [{
                                "targets": 8,
                                "orderable": false,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<a href="' + widget.sfURL() + row[8] + '"><u>Details</u></a>';}
                                },
                                {"targets": 7, 
                                "type": "date", 
                                "render": function (value) {
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
                                {
                                "targets": [3,4,5,6,8],
                                "orderable": false
                                },
                            ],
                            "language": {
                                "emptyTable": "No " + tab.toLowerCase() + " found"
                            },                            
                            destroy: true,
                            scrollX: true,
                            scrollCollapse: true                                 
                        });  
            } else if (tab == 'Contacts') {
                //Name,Title,Account.Name,Phone,Email
                table = $('#listing').DataTable( {
                            "processing": true,
                            "data": widget.contactsDataset,
                            "columns": [
                                {"title": "Name"}, 
                                {"title": "Title"},
                                {"title": "Account"},
                                {"title": "Phone"},
                                {"title": "Email"},
                                {"title": ""}
                            ],
                            "columnDefs": [{
                                "targets": 5,
                                "orderable": false,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<a href="' + widget.sfURL() + row[5] + '"><u>Details</u></a>';}
                                },
                                {
                                "targets": [3,4],
                                "orderable": false
                                },
                            ],
                            "language": {
                                "emptyTable": "No " + tab.toLowerCase() + " found"
                            },                            
                            destroy: true
                        });                  
            } else {
                table = $('#listing').DataTable( {
                            "processing": true,
                            "data": widget.oppsDataset,
                            "columns": [
                                {"title": "Name"}, 
                                {"title": "Account"},
                                {"title": "Amount"},
                                {"title": "Stage"},
                                {"title": "Close Date"},
                                {"title": ""}
                            ],
                            "columnDefs": [{
                                "targets": 5,
                                "orderable": false,
                                "data": "download_link",
                                "render": function(data, type, row, meta) {return '<a href="' + widget.sfURL() + row[5] + '"><u>Details</u></a>';}
                                },
                                {"type": "num-fmt", "targets": 2, "render": $.fn.dataTable.render.number( ',', '.', 2, '$' )},
                                {"targets": 4, 
                                "type": "date", 
                                "render": function (value) {
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
                            ],                            
                            "language": {
                                "emptyTable": "No " + tab.toLowerCase() + " found"
                            },                            
                            destroy: true
                        });    
            }   
            return table;                
        }

        var widget;
        var widgetRepository = "https://raw.githubusercontent.com/OCC-SE/";
        var tabTypes = ['Invoices','Orders','Repeat','Subscriptions','Leads','Contacts','Opportunities','Install Base','Quotes'];
        var tabUsed = [];
        var queryRun = [];

        return {

            tabClicked: ko.observable(''),
            leadsDataset: ko.observable(),
            oppsDataset: ko.observable(),
            contactsDataset: ko.observable(),

            onLoad: function(widgetModel) {
                widget = widgetModel;
                
                widget.tabImage = widgetRepository + "images/master/" + widget.tabName().toLowerCase() + ".png";
                
                var t = widget.tabName();
                if (!queryRun.includes(t)) {
                    
                    var q;
                    if (t == 'Leads') {
                        q = "q=SELECT+Name,Company,Title,ProductInterest__c,Status,Email,Phone,LastModifiedDate+FROM+Lead";
                    } else if (t == 'Contacts') {
                        q = "q=SELECT+Name,Title,Account.Name,Phone,Email+FROM+Contact";
                    } else {
                        q = "q=SELECT+Name,Account.Name,Amount,StageName,CloseDate+FROM+Opportunity";
                    }
    
                    var sfdcToken = widget.sfToken();
                    var settings = {
                      "async": true,
                      "crossDomain": true,
                      "url": widget.sfURL() + "/services/data/v46.0/query/?"+q,
                      "method": "GET",
                      "headers": {
                        "Authorization": "Bearer " + sfdcToken,
                        "User-Agent": "PostmanRuntime/7.17.1",
                        "Accept": "*/*",
                        "Cache-Control": "no-cache",
                        "Postman-Token": "1c13b9c5-1b60-48e9-85fc-b41ed18a65aa,2c8b3bdc-5a91-45d3-bb04-25faf009e9e5",
                        "Host": "na114.salesforce.com",
                        "Accept-Encoding": "gzip, deflate",
                        "Cookie": "BrowserId=5s80n3peSYeu7MrOU8Ed1w",
                        "Connection": "keep-alive",
                        "cache-control": "no-cache"
                      }
                    }
         
                    $.ajax(settings).done(function (response) {
                      var dataSet = [];
                      if (t == 'Leads') {
                          dataSet = [];
                          for (var i=0; i<response.totalSize; i++) {
                              dataSet[i] = [
                                response.records[i].Name,
                                response.records[i].Company,
                                response.records[i].Title,
                                response.records[i].ProductInterest__c,
                                response.records[i].Status,
                                response.records[i].Email,
                                response.records[i].Phone,
                                response.records[i].LastModifiedDate,
                                response.records[i].attributes.url
                                ];
                          }
                          widget.leadsDataset=dataSet;
                      } else if (t == 'Contacts') {
                          dataSet = [];
                          for (var c=0; c<response.totalSize; c++) {
                              dataSet[c] = [
                                response.records[c].Name,
                                response.records[c].Title,
                                response.records[c].Account.Name,
                                response.records[c].Phone,
                                response.records[c].Email,
                                response.records[c].attributes.url
                                ];
                          }  
                          widget.contactsDataset=dataSet;
                      } else {
                          dataSet = [];
                          for (var g=0; g<response.totalSize; g++) {
                              dataSet[g] = [
                                response.records[g].Name,
                                response.records[g].Account.Name,
                                response.records[g].Amount,
                                response.records[g].StageName,
                                response.records[g].CloseDate,
                                response.records[g].attributes.url
                                ];
                          }  
                          widget.oppsDataset=dataSet;    
                      }
                    });    
                
                    queryRun.push(widget.tabName());
                }
                
                console.log("-- Loading " + widget.displayName() + "-(" + widget.id() + ")");
            },

            beforeAppear: function(page) {

                $(document).ready(function() {
                    var tab = widget.tabName();
                    if (!tabUsed.includes(tab)) {
                        $('#tab-'+ tab).on('click', function() {
                            if (!widget.useImages()) {
                                $("#tab-"+tab).attr('class', 'tablink-selected');
                                for (var b=0; b<tabTypes.length; b++) {
                                    if (tabTypes[b]!=tab) {
                                        $("#tab-"+tabTypes[b]).attr('class', 'tablink');
                                    }
                                }
                            } else {
                                $("#tab-"+tab).attr('class', 'imglink-selected');
                                for (var i=0; i<tabTypes.length; i++) {
                                    if (tabTypes[i]!=tab) {
                                        $("#tab-"+tabTypes[i]).attr('class', 'imglink');
                                    }
                                }
                            }
                            if ($.fn.DataTable.isDataTable('#listing')) {
                                $('#listing').DataTable().clear().destroy();
                                $('#listing').empty();
                            }                            
                            var table = getConfig(tab);
                        });
                        tabUsed.push(tab);
                    }
                });
            }
            
        };
    }
);