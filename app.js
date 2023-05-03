const hostPort = process.env.PORT || 3000;
let mongoKey;

try
{
    mongoKey = require( "./mongoKey.js" );
} catch ( error )
{
    if ( typeof mongoKeyEnv !== 'undefined' )
    {
        mongoKey = mongoKeyEnv;
    } else
    {
        mongoKey = process.env.mongoKeyEnv;
    }
}
// const mongoKey = require( "./mongoKey.js" );

let appPassword;
try
{
    appPassword = require( "./appPassword.js" );
} catch ( error )
{
    if ( typeof appPasswordEnv !== 'undefined' )
    {
        appPassword = appPasswordEnv;
    } else
    {
        appPassword = process.env.appPasswordEnv;
    }
}

// const appPassword = require( "./appPassword.js" );




const mongoHostString = `mongodb+srv://manuj8941:${ mongoKey }@joltlink.cjl86ox.mongodb.net/indiHoteDB?retryWrites=true&w=majority`;

const express = require( "express" );
const app = express();
app.use( express.static( __dirname ) );
app.use( express.urlencoded( { extended: true } ) );
app.use( express.json() );
const ejs = require( "ejs" );
const ejsMate = require( "ejs-mate" );
const path = require( "path" );
app.set( "views", __dirname );
app.set( "view engine", "ejs" );
app.engine( "ejs", ejsMate );

let loginFlag = false;

let loginRequestType = "";
let currHotelID;

setInterval( () =>
{
    loginFlag = false;
    console.log( "loginFlag has been reset to false." );
}, 5 * 60 * 1000 );

const mongoose = require( "mongoose" );
mongoose.set( "strictQuery", false );
mongoose.connect( mongoHostString )
    .then( ( response ) =>
    {
        console.log( `Connected to MongoDB Atlas` );

    } )
    .catch( ( error ) =>
    {
        console.log( `Oh No MongoDB Atlas Connection Error: ${ error }` );
    } );

const Hotel = require( "./hotel.js" );


app.get( "/", ( req, res ) =>
{
    res.redirect( "/hotels" );

} );

app.get( "/hotel", ( req, res ) =>
{
    res.redirect( "/hotels" );

} );

app.get( "/login", ( req, res ) =>
{
    res.redirect( "/hotels/login" );

} );

app.get( "/hotels/login", ( req, res ) =>
{
    res.render( "login.ejs", { msg: "" } );
} );


app.get( "/hotels", ( req, res ) =>
{
    Hotel.find()
        .then( ( hotels ) =>
        {
            res.render( "index.ejs", { hotels } );
        } );
} );

app.get( "/hotels/new", ( req, res ) =>
{
    loginRequestType = "ADD";
    if ( loginFlag === true )
    {
        res.render( "new.ejs" );
    } else
    {
        res.redirect( "/hotels/login" );
    }
} );

app.post( "/hotels/login", ( req, res ) =>
{
    let providedPW = req.body.password;
    if ( providedPW === appPassword )
    {
        loginFlag = true;
        if ( loginRequestType === "ADD" )
        {
            res.redirect( "/hotels/new" );
        } else if ( loginRequestType === "EDIT" )
        {
            Hotel.findById( currHotelID )
                .then( ( hotel ) =>
                {
                    res.render( "edit.ejs", { hotel } );
                } );

        } else if ( loginRequestType === "DELETE" )
        {
            Hotel.findByIdAndDelete( currHotelID )
                .then( ( hotel ) =>
                {
                    res.redirect( "/hotels" );
                } );
        }
    } else
    {
        res.render( "login.ejs", { msg: "not a valid password" } );
    }
} );


app.post( "/hotels/new", ( req, res ) =>
{
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const location = req.body.location;
    const imageURL = req.body.imageURL;

    new Hotel( { title: title, price: price, description: description, location: location, imageURL: imageURL } ).save()
        .then( ( hotel ) =>
        {
            res.redirect( `/hotels/${ hotel._id }` );
        } );
} );


app.get( "/hotels/:id", ( req, res ) =>
{
    Hotel.findById( req.params.id )
        .then( ( hotel ) =>
        {
            res.render( "show.ejs", { hotel } );
        } );
} );

app.get( "/hotels/:id/edit", ( req, res ) =>
{
    loginRequestType = "EDIT";
    currHotelID = req.params.id;

    if ( loginFlag === true )
    {
        const id = req.params.id;
        Hotel.findById( id )
            .then( ( hotel ) =>
            {
                res.render( "edit.ejs", { hotel } );
            } );
    } else
    {
        res.redirect( "/hotels/login" );
    }
} );


app.post( "/hotels/:id/edit", ( req, res ) =>
{
    const id = req.params.id;
    const title = req.body.title;
    const location = req.body.location;
    const price = req.body.price;
    const description = req.body.description;
    const imageURL = String( req.body.imageURL );

    Hotel.findByIdAndUpdate( id, { title, location, price, description, imageURL }, { new: true } )
        .then( ( hotel ) =>
        {
            res.redirect( `/hotels/${ hotel._id }` );
        } );
} );

app.get( "/hotels/:id/delete", ( req, res ) =>
{
    loginRequestType = "DELETE";
    currHotelID = req.params.id;
    if ( loginFlag === true )
    {
        const id = req.params.id;
        Hotel.findByIdAndDelete( id )
            .then( ( hotel ) =>
            {
                res.redirect( "/hotels" );
            } );
    } else
    {
        res.redirect( "/login" );
    }
} );



//API ROUTES

app.get( "/api/hotels", ( req, res ) =>
{
    Hotel.find()
        .then( ( hotels ) =>
        {
            res.json( hotels );
        } );
} );

app.get( "/api/hotels/:id", ( req, res ) =>
{
    Hotel.findById( req.params.id )
        .then( ( hotel ) =>
        {
            res.json( hotel );
        } );
} );

app.get( "/api/hotels/:id/delete/:password", ( req, res ) =>
{
    if ( req.params.password === appPassword )
    {
        Hotel.findByIdAndDelete( req.params.id )
            .then( ( hotel ) =>
            {
                res.json( { message: "Hotel deleted successfully" } );
            } );
    } else
    {
        res.status( 401 ).json( { message: "Unauthorized" } );
    }
} );

app.post( "/api/hotels/new/", ( req, res ) =>
{
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const location = req.body.location;
    const imageURL = req.body.imageURL;
    const password = req.body.password;

    if ( password === appPassword )
    {

        new Hotel( { title: title, price: price, description: description, location: location, imageURL: imageURL } ).save()
            .then( ( hotel ) =>
            {
                res.json( { message: "This hotel is saved.", hotel: hotel } );

            } );
    } else
    {
        res.status( 401 ).json( { message: "Unauthorized" } );
    }
} );





app.use( ( req, res, next ) =>
{
    res.status( 404 ).render( "404.ejs", { invalidURL: req.url } );
} );

app.listen( hostPort, () =>
{
    console.log( `SERVER STARTED ON ${ hostPort }` );

} );