'use strict';

const Alexa = require('alexa-sdk');
const moment = require('moment');
const _ = require('lodash');

const getRoomId = (intent) => {
  const id = _.get(intent, "slots.room.resolutions.resolutionsPerAuthority.0.values.0.value.id");
  if (id) {
    return id;
  }
  intent.slots = intent.slots || {};
  intent.slots.room = {
    name: "room"
  };
  return null;
}

const handlers = {
  'LaunchRequest': function() {
    this.emit(':ask', 'What would you like to do?', 'Please say that again?');
  },
  'SessionEndedRequest': function() {
    console.log('session ended. saving...');
    this.emit(':saveState', true);
  },
  'Unhandled': function() {
    this.emit(':ask', 'What would you like to do?', 'Please say that again?');
  },
  'FreeConfRooms': function() {
    this.emit(':tell', "Maybe there are...");
  },
  'RoomBooking': function() {
    let intent = this.event.request.intent;
    const period = _.get(intent.slots, "period.value");
    const room = getRoomId(intent);

    // this.attributes.roomBooking = this.attributes.roomBooking || {};
    // this.attributes.roomBooking.period = _.get(intent.slots, "period.value") || this.attributes.roomBooking.period;
    // this.attributes.roomBooking.room = getRoomId(intent) || this.attributes.roomBooking.room;

    // const { period, room } = this.attributes.roomBooking;
    console.log("slots: " + JSON.stringify(intent.slots));
    if (period && room) {
      let periodMinutes = moment.duration(period).asMinutes();
      // this.attributes.roomBooking = {};
      this.emit(':tell', `Ok, I will book ${room} room for ${periodMinutes} minutes`);
    } else {
      this.emit(':delegate', intent);
    }
  }
};

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.appId = process.env.APP_ID;
  alexa.dynamoDBTableName = process.env.DB_TABLE_NAME;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
