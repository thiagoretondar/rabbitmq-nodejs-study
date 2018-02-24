const amqp = require('amqplib');

amqp.connect('amqp:localhost')
    .then((connection) => {
        console.log('Connected!');

        return connection.createChannel();
    })
    .then((channel) => {
        console.log('Canal criado');
        let increment = 1;
        setInterval(() => {
            console.log('-> Sending message ');
            channel.sendToQueue(
                'messages',
                new Buffer(`Hello World - ${increment++}`)
            );
        }, 5000);
    });