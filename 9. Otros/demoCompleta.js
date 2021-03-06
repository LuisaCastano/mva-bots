var restify = require('restify');
var builder = require('botbuilder');

// Levantar restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// No te preocupes por estas credenciales por ahora, luego las usaremos para conectar los canales.
var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

// Ahora utilizamos un UniversalBot
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Dialogos
bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, '¿Cómo te llamas?');
    },
    function (session, results) {
        let msj = results.response;
        session.send(`Hola ${msj}!`);
    }
]).beginDialogAction('preguntarEdadDialogAction', 'preguntarEdad', { matches: /^edad$/i })
  .beginDialogAction('preguntarMenuDialogAction', 'preguntarMenu', { matches: /^menu$/i })
  .beginDialogAction('preguntarBotonDialogAction', 'preguntarBoton', { matches: /^boton$/i })
  .beginDialogAction('tarjetaDialogAction', 'tarjeta', { matches: /^tarjeta$/i })
  .beginDialogAction('carouselDialogAction', 'carousel', { matches: /^carousel$/i });

// Ejemplo: número
bot.dialog('preguntarEdad', [
    function (session) {
        builder.Prompts.number(session, '¿Cuántos años tienes?');
    },
    function (session, results) {
        session.endDialog('Interesante!');
    }
]);

// Ejemplo: menú
bot.dialog('preguntarMenu', [
    function (session) {
        builder.Prompts.choice(session, '¿Cuál es tu comida favorita?', 'Pizza|Pizza|Pizza');
    },
    function (session, results) {
        session.endDialog('Obvio!');
    }
]);

// Ejemplo: botón
bot.dialog('preguntarBoton', [
    function (session) {
        builder.Prompts.choice(session, '¿Cuál es tu comida favorita?', 'Pizza|Pizza|Pizza', { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.endDialog('Obvio!');
    }
]);

// Ejemplo: tarjeta
bot.dialog('tarjeta', [
    function (session) {
        var heroCard = new builder.HeroCard(session)
            .title('Esta es una tarjeta de tipo Hero Card')
            .subtitle('Este es su correspondente subtítulo')
            .text('Sigan a Marcelo Felman en Twitter: @mfelman')
            .images([
                builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://docs.botframework.com/en-us/', 'Aprende')
            ]);

        // Adjuntamos la tarjeta al mensaje
        var msj = new builder.Message(session).addAttachment(heroCard);
        session.send(msj);
    }
]);

// Ejemplo: carousel
bot.dialog('carousel', [
    function (session) {
        var heroCard1 = new builder.HeroCard(session)
            .title('Esta es una tarjeta de tipo Hero Card')
            .subtitle('Este es su correspondente subtítulo')
            .text('Sigan a Marcelo Felman en Twitter: @mfelman')
            .images([
                builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://docs.botframework.com/en-us/', 'Aprende')
            ]);

        var heroCard2 = new builder.HeroCard(session)
            .title('Esta es una OTRA de tipo Hero Card')
            .subtitle('Este es su correspondente subtítulo')
            .text('Sigan (si no lo hicieron) a Marcelo Felman en Twitter: @mfelman')
            .images([
                builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://docs.botframework.com/en-us/', 'Aprende')
            ]);

        // Creamos un array de tarjetas
        var tarjetas = [heroCard1, heroCard2];

        // Adjuntamos la tarjeta al mensaje
        var msj = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(tarjetas);
        session.send(msj);
    }
]);