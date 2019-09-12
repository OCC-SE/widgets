define(
    ['knockout', 'CCi18n'],

    function (ko, CCi18n) {

        "use strict";

        return {

            resourcesLoaded: function (widget) {
            },

            onLoad: function (widget) {
                var user = widget.user();

                //widget.toddProp = ko.observable('Todd');

                // console.log('user first name is: ', user.firstName());


                // console.log('onLoad, setting initial values');
                widget.chartData = ko.observableArray([
                    { title: 'New Orders', value: '7' },
                    { title: 'In Progress', value: '28' },
                    { title: 'Shipped', value: '13' },
                    { title: 'Delivered', value: '9' },
                    { title: 'Returns', value: '5' },
                    { title: 'Total Spent', value: '$9,871.00' },
                ]);

               if(user.firstName() === 'Wendy') {
                    // console.log('Onload, setting Wendy Values');
                    widget.chartData = ko.observableArray([
                        { title: 'New Orders', value: '2' },
                        { title: 'In Progress', value: '26' },
                        { title: 'Shipped', value: '3' },
                        { title: 'Delivered', value: '4' },
                        { title: 'Returns', value: '1' },
                        { title: 'Total Spent', value: '$675.42' },
                    ]);
                }
            },

            beforeAppear: function (page) {
            }
        }
    }
);
