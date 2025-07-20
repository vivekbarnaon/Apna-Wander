const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: String,
    description: String,
    image: {
        filename: String,
        url: String
    },
    price: {
        type: Number,
        default: 0,
        required: true
    },
    location: String,
    country: String,
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.review}});
    }
});


const listing = mongoose.model("Listing",listingSchema);

module.exports = listing;

