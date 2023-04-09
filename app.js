const hostPort = process.env.PORT || 3000;
const mongoKey = require( "./mongoKey.js" );
const appPassword = require("./appPassword.js")
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


// //
// const multer = require( "multer" );

// // Set up multer middleware to store uploaded files in the "uploads" directory
// const storage = multer.diskStorage( {
//     destination: function ( req, file, cb )
//     {
//         cb( null, "uploads/" );
//     },
//     filename: function ( req, file, cb )
//     {
//         cb( null, file.originalname );
//     }
// } );
// const upload = multer( { storage: storage } );

// //



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
        res.render( "login.ejs", { msg: "" } );
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
            res.render( "new.ejs" );
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
        res.render( "login.ejs", { msg: "" } );
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
        res.render( "login.ejs", { msg: "" } );
    }
} );

// app.get( "/check", ( req, res ) =>
// {
//     res.render( "check.ejs" );
// } );

// app.post( "/check", upload.single( "image" ), ( req, res ) =>
// {
//     const title = req.body.title;
//     const price = req.body.price;
//     const description = req.body.description;
//     const location = req.body.location;
//     // const imageURL = req.body.imageURL;
//     const imageURL =  req.file.path; 

//     const hotel = new Hotel( {
//         title: title,
//         price: price,
//         description: description,
//         location: location,
//         imageURL: imageURL
//     } );

//     hotel.save( ( err ) =>
//     {
//         if ( err )
//         {
//             console.error( err );
//             res.send( "An error occurred while saving the hotel information." );
//         } else
//         {
//             res.send( "Hotel information saved successfully." );
//         }
//     } );
// } );



app.listen( hostPort, () =>
{
    console.log( "listenig to port 3000!!" );;

} );