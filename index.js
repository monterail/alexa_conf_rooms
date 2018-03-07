'use strict';

const Alexa = require('alexa-sdk');

const SPEECH_OUTPUT = 'Hi Karolinka!';

const handlers = {
    'FreeConfRooms' : function() {
        this.emit(':tell', SPEECH_OUTPUT);
    }
};

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
