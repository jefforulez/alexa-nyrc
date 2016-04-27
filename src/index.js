
var APP_ID = undefined ;

var AlexaSkill = require( './AlexaSkill' ) ;

var NYRCApp = function () {
    AlexaSkill.call( this, APP_ID ) ;
};

var KEY_RACE_INDEX = 'race_index' ;

//
//
//

NYRCApp.prototype = Object.create( AlexaSkill.prototype ) ;
NYRCApp.prototype.constructor = NYRCApp ;

NYRCApp.prototype.eventHandlers.onSessionStarted = function ( sessionStartedRequest, session )
{
    console.log( 'NYRCApp onSessionStarted requestId: ' + sessionStartedRequest.requestId
        + ', sessionId: ' + session.sessionId ) ;
};

NYRCApp.prototype.eventHandlers.onLaunch = function ( launchRequest, session, response )
{
    console.log( 'NYRCApp onLaunch requestId: ' + launchRequest.requestId + ', sessionId: ' + session.sessionId ) ;
    response.ask(
        'Welcome to the New York Running Calendar app. You can ask me when the next race is.',
        'Please ask me when the next race is.'
    ) ;
};

NYRCApp.prototype.eventHandlers.onSessionEnded = function ( sessionEndedRequest, session )
{
    console.log( 'NYRCApp onSessionEnded requestId: ' + sessionEndedRequest.requestId
        + ', sessionId: ' + session.sessionId ) ;
};

NYRCApp.prototype.intentHandlers = {

    'NYRCWhenIsTheNextRace' : function ( intent, session, response ) {
        handleNextRaceRequest( intent, session, response ) ;
    },

    'HearMore': function ( intent, session, response ) {
        handleNextRaceRequest( intent, session, response ) ;
    },

    'DontHearMore': function ( intent, session, response ) {
        response.tell( '' ) ;
    },

    'AMAZON.HelpIntent' : function ( intent, session, response ) {
        response.ask(
            'You can ask me: When is the next race?, or, What is the next race?'
                + ' Then you can say Yes, to hear more future races.',
            'You can ask me: When is the next race?'
        ) ;
    },

    'AMAZON.StopIntent' : function ( intent, session, response ) {
        var speechOutput = 'Goodbye' ;
        response.tell( speechOutput ) ;
    },

    'AMAZON.CancelIntent' : function ( intent, session, response ) {
        var speechOutput = 'Goodbye' ;
        response.tell( speechOutput ) ;
    }

};


//
//
//

var ical = require('ical') ;
var df = require('dateformat') ;

function handleNextRaceRequest( intent, session, response )
{
    console.log( 'handleNextRaceRequest.intent.name : ' + intent.name ) ;

    // reset the session race index when the intent is NYRCWhenIsTheNextRace
    if (
        intent.name == 'NYRCWhenIsTheNextRace'
        && session.hasOwnProperty( 'attributes' )
        && session.attributes[ KEY_RACE_INDEX ]
    )
    {

        session.attributes[ KEY_RACE_INDEX ] = 0 ;
    }

    console.log( 'handleNextRaceRequest.KEY_RACE_INDEX : ' + session.attributes[ KEY_RACE_INDEX ] ) ;

    var ical_handler = function ( err, data )
    {
        var speechOutput = "I'm sorry. I'm unable to find the next race." ;

        var race_index = 0 ;

        for ( var k in data )
        {
            if ( data.hasOwnProperty( k ) )
            {
                var ev = data[k] ;

                if ( ! ev.hasOwnProperty( 'start' ) ) {
                    continue ;
                }

                ++race_index ;

                if ( session.hasOwnProperty( 'attributes' ) && session.attributes[ KEY_RACE_INDEX ] )
                {
                    if ( race_index <= session.attributes[ KEY_RACE_INDEX ] )
                    {
                        continue ;
                    }
                }
                else if ( ev.start.getTime() < Date.now() )
                {
                    continue ;
                }

                session.attributes[ KEY_RACE_INDEX ] = race_index ;

                speechOutput =
                      'The ' + ev.summary
                    + ' is in ' + ev.location.replace( /Bronx/, 'The Bronx' )
                    + ' on ' + df( ev.start, 'dddd mmmm dS' )
                    + ' starting at ' + df( ev.start, 'h:MM TT' )
                    ;

                // clean up the response
                speechOutput = speechOutput.replace( /NYRR/, 'New York Road Runners' ) ;
                speechOutput = speechOutput.replace( /\(4M\)/, '4 Miler' ) ;
                speechOutput = speechOutput.replace( /\(5M\)/, '5 Miler' ) ;
                speechOutput = speechOutput.replace( /\(18M\)/, '18 Miler' ) ;

                speechOutput = speechOutput + '.  Would you like to hear more?' ;

                break ;
            }
        }

        response.askWithCard( speechOutput, 'New York Race Calendar', speechOutput ) ;

    }

    ical.fromURL(
        'http://www.nyrr.org/races-and-events/download-ical/2016/',
        {},
        ical_handler
    ) ;

}

//
//
//

exports.handler = function ( event, context )
{
    var skill = new NYRCApp() ;
    skill.execute( event, context );
} ;
