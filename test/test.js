/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }]*/
/*global describe*/
/*global it*/
/*global beforeEach*/

const limit = 5;
const queue = require('../queue-handler')(limit);
var should = require('should');

describe('Queue handler', function() {

    // Clear queue
    beforeEach(function() {
        queue.queue = [];
    });

    describe('#update()', function() {
        it('should add to the queue queue', function() {

            let message = 'Hello World';
            let channel = '#world';
            let nickname = 'Tory';

            queue.update(message, channel, nickname);

            queue.queue[0].should.deepEqual({
                message,
                channel,
                nickname
            });

        });
    });

    describe('#getRandomMessage()', function() {
        
        it('Get a random message from the queue', function() {

            let message = 'Hello World';
            let channel = '#world';
            let nickname = 'Tory';

            queue.update(message, channel, nickname);

            queue.getRandomMessage(channel).should.eventually.deepEqual({
                message,
                channel,
                nickname
            });

        });
        
        it('Successfully does not locate a message with custom avoidMessagesStartingWith', function() {
            
            let message = 'ra/Hello World';
            let channel = '#world';
            let nickname = 'Tory';

            queue.update(message, channel, nickname);

            queue.getRandomMessage(message, channel, { avoidMessagesStartingWith: 'ra/'}).should.eventually.be.undefined;

        });
    });
    
    describe('#findCorrectable()', function() {
        
        it('Successfully locates a message in the queue based on a search string', function() {
            let message = 'Hello World';
            let channel = '#world';
            let nickname = 'Tory';

            queue.update(message, channel, nickname);

            // Snag random substring of message
            queue.findCorrectable(message.substr((2,5)), channel).should.eventually.deepEqual({
                message,
                channel,
                nickname
            });

        });
        
        it('Successfully does not locate a message with avoidMessagesStartingWith', function() {
            let message = 's/Hello World';
            let channel = '#world';
            let nickname = 'Tory';

            queue.update(message, channel, nickname);

            queue.findCorrectable(message, channel).should.eventually.should.eventually.be.undefined;

        });
        
        it('Successfully does not locate a message with custom avoidMessagesStartingWith', function() {
            let message = 'r/Hello World';
            let channel = '#world';
            let nickname = 'Tory';

            queue.update(message, channel, nickname);

            queue.findCorrectable(message, channel, { avoidMessagesStartingWith: 'r/'}).should.eventually.be.undefined;

        });
        
        it('Successfully locates FIRST message in the queue based on a search string (update adds to the front (LIFO))', function() {

            let message = 's/Hello World';
            let channel = '#world';
            let nickname = 'Tory';

            queue.update(message + ' 1', channel, nickname);
            queue.update(message + ' 2', channel, nickname);

            queue.findCorrectable('s/Hello World', channel, { avoidMessagesStartingWith: 'r/'}).should.eventually.have.property('message').which.endWith('2');
        });
        
        it('Fails to locate a message in the queue based on a search string for the wrong channel', function() {
            let message = 'Hello World';
            let channel = '#world';
            let nickname = 'Tory';

            queue.update(message + ' 1', channel, nickname);
            queue.update(message + ' 2', channel, nickname);

            queue.findCorrectable(message, '#mars', { avoidMessagesStartingWith: 'r/'}).should.eventually.be.undefined;

        });
    });

});
