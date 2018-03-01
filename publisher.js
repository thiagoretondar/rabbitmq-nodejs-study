const amqp = require('amqplib');

const exchangeName = 'my-delay-exchange';
const pattern = 'jobs';
const queueName = 'messages';

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

        const exchange = channel.assertExchange(exchangeName, 'x-delayed-message', {
            autoDelete: false,
            durable: true,
            passive: true,
            arguments: { 'x-delayed-type':  'direct' },
        });

        return exchange.then((res, err) => {
            channel.bindQueue(queueName, exchangeName , pattern);

            let increment = 1, total = 0;
            setInterval(() => {
                console.log(`-> ${++total} Publishing message`);
                let messageString = `Hello World - ${++increment}`;
                let delay = 0;
                // if (increment % 10 === 0) {
                //     const currentDatetime = new Date();
                //     console.log(`${currentDatetime} - ADDING DELAY FOR MESSAGE '${messageString}'`);
                //     delay = 2000;
                //     messageString += ` - MESSAGE DELAYED BY ${delay} ms IN ${currentDatetime}`;
                // }

                return channel.publish(exchangeName, pattern, new Buffer(messageString), { headers: { 'x-delay': delay } });
            }, 10);
        });
    });
