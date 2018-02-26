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

        channel.assertExchange(exchangeName, 'x-delayed-message', {
            autoDelete: false,
            durable: true,
            passive: true,
            arguments: { 'x-delayed-type':  'direct' },
        });

        channel.bindQueue(queueName, exchangeName , pattern);

        let increment = 1;
        setInterval(() => {
            console.log('-> Publishing message ');
            let messageString = `Hello World - ${++increment}`;
            let delay = 0;
            if (increment % 10 === 0) {
                const currentDatetime = new Date();
                console.log(`${currentDatetime} - ADDING DELAY FOR MESSAGE '${messageString}'`);
                delay = 2000;
                messageString += ` - MESSAGE DELAYED BY ${delay} ms IN ${currentDatetime}`;
            }

            channel.publish(exchangeName, pattern, new Buffer(messageString), { headers: { 'x-delay': delay } });
        }, 500);
    });
