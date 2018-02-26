const amqp = require('amqplib');

const exchangeName = 'my-delay-exchange';
const pattern = 'jobs';
const queueName = 'messages';

amqp.connect('amqp:localhost')
    .then((connection) => {
        console.log('Connected!');

        return connection.createChannel();
    })
    .then((channel) => {
        console.log('Canal criado');

        channel.prefetch(10);
        channel.consume(queueName, (message) => {
            // if (message.content.toString().includes('MESSAGE DELAYED')) {
                console.log('%s - Received messages: %s', new Date(), message.content.toString());
                console.log('=================================================================');
            // }
            // everything is ok with the message
            channel.ack(message);
        }, { noAck: false });
    });