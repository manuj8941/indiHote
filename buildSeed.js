const mongoKey = require( "./mongoKey.js" );
const mongoHostString = `mongodb+srv://manuj8941:${ mongoKey }@joltlink.cjl86ox.mongodb.net/indiHoteDB?retryWrites=true&w=majority`;


const mongoose = require( "mongoose" );
mongoose.set( "strictQuery", false );
mongoose.connect( mongoHostString )
    .then( ( response ) =>
    {
        console.log( `Connected to MongoDB Atlas with response: ${ response }` );

    } )
    .catch( ( error ) =>
    {
        console.log( `Oh No MongoDB Atlas Connection Error: ${ error }` );
    } );

const Hotel = require( "./hotel.js" );


const cityStatesObject = [ { city: "Agra", state: "Uttar Pradesh" }, { city: "Jaipur", state: "Rajasthan" }, { city: "Varanasi", state: "Uttar Pradesh" }, { city: "Mumbai", state: "Maharashtra" }, { city: "Delhi", state: "Delhi" }, { city: "Panaji", state: "Goa" }, { city: "Chennai", state: "Tamil Nadu" }, { city: "Udaipur", state: "Rajasthan" }, { city: "Amritsar", state: "Punjab" }, { city: "Khajuraho", state: "Madhya Pradesh" }, { city: "Darjeeling", state: "West Bengal" }, { city: "Shimla", state: "Himachal Pradesh" }, { city: "Kolkata", state: "West Bengal" }, { city: "Mount Abu", state: "Rajasthan" }, { city: "Mysore", state: "Karnataka" }, { city: "Hyderabad", state: "Telangana" }, { city: "Aurangabad", state: "Maharashtra" }, { city: "Jaisalmer", state: "Rajasthan" }, { city: "Ladakh", state: "Jammu and Kashmir" }, { city: "Manali", state: "Himachal Pradesh" }, { city: "Rishikesh", state: "Uttarakhand" }, { city: "Bangalore", state: "Karnataka" }, { city: "Bhubaneswar", state: "Odisha" }, { city: "Coorg", state: "Karnataka" }, { city: "Guwahati", state: "Assam" }, { city: "Haridwar", state: "Uttarakhand" }, { city: "Kodaikanal", state: "Tamil Nadu" }, { city: "Munnar", state: "Kerala" }, { city: "Ooty", state: "Tamil Nadu" }, { city: "Pune", state: "Maharashtra" }, { city: "Pushkar", state: "Rajasthan" }, { city: "Srinagar", state: "Jammu and Kashmir" }, { city: "Thekkady", state: "Kerala" }, { city: "Vishakhapatnam", state: "Andhra Pradesh" }, { city: "Wayanad", state: "Kerala" }, { city: "Yercaud", state: "Tamil Nadu" } ];
const descNames1 = [ "Enchanting", "Serene", "Exuberant", "Magnificent", "Tranquil", "Splendid", "Grandiose", "Glittering", "Idyllic", "Exquisite", "Glamorous", "Opulent", "Lavish", "Grand", "Luxurious", "Magnificent", "Stunning", "Glittering", "Posh", "Heritage", "Exotic" ]; 
const descNames2 = [ "Palace", "Mansion", "Lodge", "Retreat", "Inn", "Manor", "Villa", "Resort", "Spa", "Club", "Tower", "Grand", "Ritz", "Plaza", "Savoy", "Regency", "Majestic", "Ambassador", "Imperial", "Sheraton", "Park", "Marriott", "Crown", "Hyatt", "Hilton", "Leela", "Oberoi", "Trident", "Taj", "Intercontinental", "Radisson" ];




Hotel.deleteMany( {} )
    .then( () =>
    {
        for ( i = 0; i < 18; i++ )
        {
            
            const title = `${ descNames1[ Math.floor( Math.random() * descNames1.length ) ] } ${ descNames2[ Math.floor( Math.random() * descNames2.length ) ] }`;
            const locationID = Math.floor( Math.random() * cityStatesObject.length );
            const location = `${ cityStatesObject[ locationID ].city }, ${ cityStatesObject[ locationID ].state }`;
            const price = Math.floor( Math.random() * ( 3000 ) + 900 );
            const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan nulla eu urna interdum, eu aliquet elit finibus. Nam malesuada libero id dui laoreet, id iaculis elit lobortis. Duis volutpat, sapien eget luctus finibus, dolor eros rhoncus elit, a varius urna sapien eget nunc. Fusce malesuada tincidunt ipsum, sit amet aliquam ex varius eu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras in tellus vel nisl fermentum vulputate sit amet vel turpis.";
            const imageURL = `/img%20(${ i + 1 }).jpg`;
          
                       
            new Hotel( { title: title, price: price, description: description, location: location, imageURL: imageURL } ).save()
                .then( () =>
                {
                    console.log( "This hotel saved: ", title, location, price );
                } ).catch( ( e ) =>
                {
                    console.log( "there is an error", e );
                } );
        }
    } );

