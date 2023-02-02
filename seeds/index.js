const mongoose = require( "mongoose" );
mongoose.set( "strictQuery", false );
mongoose.connect( "mongodb://localhost:27017/indiHoteDB" )
    .then( ( response ) =>
    {
        console.log( `Connected to MongoDB with response: ${ response }` );

    } )
    .catch( ( error ) =>
    {
        console.log( `Oh No MongoDB Connection Error: ${ error }` );
    } );

const Hotel = require( "../models/hotel" );
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
            const description = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta odit soluta magni officia, cum laudantium minus modi consectetur dolorum repellat vitae quas necessitatibus nisi? Excepturi quidem voluptatum repellendus laboriosam ea.Tenetur vel quisquam sequi nostrum, dignissimos ipsa minus illo nam animi assumenda possimus laborum aut cumque, voluptatem quo dolorum deleniti, rerum est sed doloribus molestiae quia commodi vitae! Quaerat, laboriosam.";
            const location = `${ cities[ randomCityIndex ].city }, ${ cities[ randomCityIndex ].state }`;
            const imageURL = "https://source.unsplash.com/collection/483251";

            new Hotel( { title: title, price: price, description: description, location: location, imageURL: imageURL } ).save()
                .then().catch();
        }
    } );

// an alternative solution for finding a random image

// const image= "https://source.unsplash.com/random/400x200"
//const image = "https://source.unsplash.com/collection/483251";


//A BETTER WAY

// async function seedDb ()
// {
//     try
//     {
//         await Hotel.deleteMany( {} );
//         for ( i = 0; i < 100; i++ )
//         {
//             const random1000 = Math.floor( Math.random() * 1000 );
//             const randDescriptors = Math.floor( Math.random() * seedHelpers.descriptors.length );
//             const randPlaces = Math.floor( Math.random() * seedHelpers.places.length );
//             const title = `${ seedHelpers.descriptors[ randDescriptors ] } ${ seedHelpers.places[ randPlaces ] }`;
//             const location = `${ cities[ random1000 ].city }, ${ cities[ random1000 ].state }`;
//             const price = Math.floor( Math.random() * ( 5000 - 500 + 1 ) + 500 );
//             await new Hotel( { title, price, location } ).save();
//         }
//         mongoose.connection.close();
//         console.log("records seeded and connection closed");


//     }

//     catch ( error )
//     {
//         console.log( error );
//     }
// }
// seedDb();






