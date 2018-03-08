'use strict';

const Alexa = require('alexa-sdk');
const moment = require('moment');
const _ = require('lodash');

const allConfRooms = ["red", "green", "blue"]

const freeConfRooms = () => _.sampleSize(allConfRooms, 2);

const getRoomId = (intent) => {
  const id = _.get(intent.slots, "room.resolutions.resolutionsPerAuthority.0.values.0.value.id");
  if (id) {
    return id;
  }
  intent.slots.room = {
    name: "room"
  };
  return null;
}

const handlers = {
  'LaunchRequest': function() {
    console.log("attributes: " + JSON.stringify(this.attributes));
    const startedSessionCount = this.attributes['startedSessionCount'] || 0;
    this.attributes['startedSessionCount'] = startedSessionCount + 1;
    this.emit(':saveState', true);
    this.emit(':ask', 'What would you like to do?', 'Please say that again?');
  },
  'SessionEndedRequest': function() {
    console.log('session ended. saving...');
    const endedSessionCount = this.attributes['endedSessionCount'] || 0;
    this.attributes['endedSessionCount'] = endedSessionCount + 1;
    this.emit(':saveState', true);
  },
  'Unhandled': function() {
    this.emit(':ask', 'What would you like to do?', 'Please say that again?');
  },
  'FreeConfRooms': function() {
    this.emit(':tell', "Maybe there are...");
  },
  'DeleteSession': function() {
    this.emit(':tell', "Deleting...");
  },
  'RestoreSession': function() {
    this.emit(':tell', "Restoring...");
  },
  'RoomBooking': function() {
    let intent = this.event.request.intent;
    let period = _.get(intent.slots, "period.value");
    let room = getRoomId(intent);
    console.log("slots: " + JSON.stringify(intent.slots));
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
  alexa.dynamoDBTableName = process.env.DB_TABLE_NAME;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
