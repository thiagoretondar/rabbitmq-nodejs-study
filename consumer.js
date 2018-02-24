const amqp = require('amqplib');

const exchangeName = 'my-delay-exchange';

amqp.connect('amqp:localhost')
    .then((connection) => {
        console.log('Connected!');

        return connection.createChannel();
    })
    .then((channel) => {
        console.log('Canal criado');

        channel.prefetch(5);
        channel.consume('messages', (message) => {
            console.log('%s - Received %s messages: %s', new Date(), message.content.toString());
            console.log('=================================================================');
            // everything is ok with the message
            channel.ack(message);
        });
    });