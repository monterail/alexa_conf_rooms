'use strict';

const Alexa = require('alexa-sdk');
const moment = require('moment');
const _ = require('lodash');

const clearSlot = (intent, slotName) => {
  intent.slots = intent.slots || {};
  intent.slots[slotName] = { name: slotName };
}

const getValueId = (intent, slotName) =>
  _.get(intent, `slots.${slotName}.resolutions.resolutionsPerAuthority.0.values.0.value.id`);

const getRoomId = (intent) => {
  const id = getValueId(intent, 'room');
  if (id) {
    return id;
  }
  clearSlot(intent, "room");
  return null;
}

const saveBooking = (data, that) => {
  if (!that.attributes.roomBooking) { that.attributes.roomBooking = [] }
  that.attributes.roomBooking.push(data);
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

    if (period && room) {
      let periodMinutes = moment.duration(period).asMinutes();
      saveBooking({period, room}, this)
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
