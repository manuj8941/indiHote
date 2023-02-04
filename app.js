const express = require( "express" );
const app = express();
app.use( express.urlencoded( { extended: true } ) );
app.use( express.json() );
const ejs = require( "ejs" );
const ejsMate = require( "ejs-mate" );
const path = require( "path" );
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );
app.engine( "ejs", ejsMate );
let loginFlag = false;

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
const Hotel = require( "./models/hotel.js" );


app.get( "/", ( req, res ) =>
{
    res.redirect("/hotels")

} );

app.post( "/", ( req, res ) =>
{
    const providedPW = req.body.providedPW;
    if ( providedPW === "indiaisgreat" )
    {
        loginFlag = true;
        
        console.log(loginFlag);
        res.redirect( "/hotels" );
    } else{
        res.send( "Invalid Password" );
        
    }

} );







app.get( "/hotels", ( req, res ) =>
{

    Hotel.find()
        .then( ( hotels ) =>
        {
            res.render( "hotels/index.ejs", { hotels } );

        } );

} );

app.get( "/hotels/new", ( req, res ) =>
{
    res.render( "hotels/new.ejs" );

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
            res.render( "hotels/show.ejs", { hotel } );
        } );



} );

app.get( "/hotels/:id/edit", ( req, res ) =>
{
    const id = req.params.id;
    Hotel.findById( id )
        .then( ( hotel ) =>
        {
            res.render( "hotels/edit.ejs", { hotel } );

        } );
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
    const id = req.params.id;
    Hotel.findByIdAndDelete( id )
        .then( ( hotel ) =>
        {
            res.redirect( "/hotels" );
        } );
} );


app.listen( 3000, () =>
{
    console.log( "listenig to port 3000!!" );;

} );