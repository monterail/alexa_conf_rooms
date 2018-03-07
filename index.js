'use strict';

const Alexa = require('alexa-sdk');
const moment = require('moment');
const _ = require('lodash');

const handlers = {
    'FreeConfRooms' : function() {
        this.emit(':tell', "Maybe there are...");
    },
    'RoomBooking' : function() {
        let intent = this.event.request.intent;
        let period = _.get(intent.slots, "period.value");
        let room = _.get(intent.slots, "room.value");
        console.log(JSON.stringify(intent.slots));
        if (period && room) {
          let periodMinutes = moment.duration(period).asMinutes()
          this.emit(':tell', `Ok, I will book ${room} room for ${periodMinutes} minutes`);
        } else {
          this.emit(':delegate', intent);
        }
    }
};

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
