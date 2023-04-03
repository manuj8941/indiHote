const axios = require( "axios" );
const fs = require( "fs" );

const mongoose = require( "mongoose" );
mongoose.set( "strictQuery", false );
mongoose.connect( "mongodb://0.0.0.0:27017/indiHoteDB" )
    .then( ( response ) =>
    {
        console.log( `Connected to MongoDB with response: ${ response }` );

    } )
    .catch( ( error ) =>
    {
        console.log( `Oh No MongoDB Connection Error: ${ error }` );
    } );

const Hotel = require( "../models/hotel.js" );
const cities = require( "./cities.js" );
const seedHelpers = require( "./seedHelpers.js" );


Hotel.deleteMany( {} )
    .then( () =>
    {
        for ( i = 0; i < 18; i++ )
        {
            const randomCityIndex = Math.floor( Math.random() * cities.length );
            const randDescriptors = Math.floor( Math.random() * seedHelpers.descriptors.length );
            const randPlaces = Math.floor( Math.random() * seedHelpers.places.length );
            const title = `${ seedHelpers.descriptors[ randDescriptors ] } ${ seedHelpers.places[ randPlaces ] }`;
            const price = Math.floor( Math.random() * ( 3000 ) + 900 );
            const description = "Lorem ipsum dolor, sit amet consectetur adipisicing elit.";
            const location = `${ cities[ randomCityIndex ].city }, ${ cities[ randomCityIndex ].state }`;
            const imageURL = `/img%20(${ i + 1 }).jpeg`;
            
            new Hotel( { title: title, price: price, description: description, location: location, imageURL: imageURL } ).save()
                .then( () =>
                {
                    console.log( "hotel saved" );
                } ).catch( ( e ) =>
                {
                    console.log( "there is an error", e );
                } );
        }
    } );






 // const imageURL = `https://source.unsplash.com/collection/483251`;

            // const imageURL = `img%20(${ i + 1 }).jpeg`;
