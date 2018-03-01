const amqp = require('amqplib');

const exchangeName = 'my-delay-exchange';
const pattern = 'jobs';
const queueName = 'messages';

function wait(t) {
    return new Promise(function(resolve) {
        setTimeout(resolve, t)
    });
 }

let i = 0;
const connection = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
};

amqp.connect(connection)
    .then((connection) => {
        console.log('Connected!');

        return connection.createChannel();
    })
    .then((channel) => {
        console.log('Canal criado');

        const queueOptions = {
            exclusive: false,
            durable: true,
            autoDelete: false,
        };

        const queueAssertion = channel.assertQueue(queueName, queueOptions);

        channel.prefetch(30);
        channel.consume(queueName, (message) => {
            // if (message.content.toString().includes('MESSAGE DELAYED')) {
                console.log('%s - Received messages: %s', ++i, message.content.toString());
                console.log('=================================================================');
            // }
            // everything is ok with the message
            channel.ack(message)
        }, { noAck: false, exclusive: false });
    });