var _ = require('lodash');
var Promise = require('bluebird');

const queue = [];

/**
 * @description
 * Add a message to the queue.
 * CTCP nickname is ignored.
 * If the queue count is at limit, a message is popped off the queue.
 *
 * @param {string} message - A message, usually from IRC.
 * @param {string} channel - An IRC channel, with or without the #.
 * @param {string} nickname - An irc nickname.
 *
 * @example
 *
 * update('hello world', '#world', 'tory');
 */
function update(message, channel, nickname) {
    var self = this;
    if (nickname === 'CTCP') {
        return;
    }
    if (self.queue.length === self.limit) {
        self.queue.pop();
    }
    self.queue.unshift({
        'message': message,
        'nickname': nickname,
        'channel': channel
    });
}

/**
 * An options object for use when searching the queue.
 * @typedef {Object} QueueSearchOption
 * @property {string} avoidMessagesStartingWith - Ignore messages in the queue that start with this string.
 */

/**
 * A queue message.
 * @typedef {Object} QueueMessage
 * @property {string} message - A message, usually from IRC.
 * @property {string} nickname -  An irc nickname.
 * @property {string} channel - An IRC channel, with or without the #.
 */

/**
 * @description Gets a random message from the queue.
 *
 * @param {string} channel - An IRC channel, with or without the #.
 * @param {QueueSearchOption} options - An options object for use when searching the queue.
 * @returns {QueueMessage} - The object found from the queue search.
 *
 * @example
 *
 * getRandomMessage('#world', { avoidMessagesStartingWith: 'random/' });
 */
function getRandomMessage(channel, options) {
    var self = this;

    var mergedOpts = _.defaults(options, {
        avoidMessagesStartingWith: 'ra/'
    });
    
    return Promise.try(function() {
        var currentChannelQueue = _.filter(self.queue, function(IRCMessage) {
            return IRCMessage.channel === channel && !_.startsWith(IRCMessage.message, mergedOpts.avoidMessagesStartingWith);
        });
        return currentChannelQueue[Math.floor(Math.random()*currentChannelQueue.length)];
    });
}

/**
 * @description Tries to find the first message message from the queue.
 *
 * @param {string} target - A search string.
 * @param {string} channel - An IRC channel, with or without the #.
 * @param {QueueSearchOption} options - An options object for use when searching the queue.
 * @returns {QueueMessage} - The object found from the queue search.
 *
 * @example
 *
 * findCorrectable('Hello', '#world', { avoidMessagesStartingWith: 's/' });
 */
function findCorrectable(target, channel, options) {
    var self = this;

    var mergedOpts = _.defaults(options, {
        avoidMessagesStartingWith: 's/'
    });
    
    return Promise.try(function() {
        var maybeMatches = _.filter(self.queue, function(IRCMessage) {
            if (IRCMessage.channel === channel) {
                if (!_.startsWith(IRCMessage.message, mergedOpts.avoidMessagesStartingWith)) {
                    return IRCMessage.message.indexOf(target) > -1;
                }
            }
        });
        return _.first(maybeMatches);
    });
}

module.exports = function(limit) {
    return {
        queue: queue,
        limit: limit,
        update: update,
        findCorrectable: findCorrectable,
        getRandomMessage: getRandomMessage
    };
};