# tennu-queue-handler

A very basic in-memory queue of tennu IRC messages. Can probably be used for other stuff too.

## Usage

- See `test/test.js` for more.
- Full JSDoc, see code for more.

```
const queue = require('../queue-handler')(limit);

queue.update(message, channel, nickname);
queue.getRandomMessage(message, channel); // Optional ops
queue.findCorrectable(message, channel); // Optional ops
```