'use strict';

const Alexa = require('alexa-sdk');

const handlers = {
    'FreeConfRooms' : function() {
        this.emit(':tell', "Maybe there are...");
    },
    'RoomBooking' : function() {
        this.emit(':tell', "Ok, I will...");
    }
};

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
