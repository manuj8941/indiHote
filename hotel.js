const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;



const HotelSchema = new Schema(
    {
        title: { type: String },
        price: { type: Number },
        description: { type: String },
        location: { type: String },
        imageURL: { type: String }


    } );




module.exports = mongoose.model( "Hotel", HotelSchema );