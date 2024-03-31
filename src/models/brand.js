import mongoose from "./index.js";

let brandSchema = new mongoose.Schema({
    brandImage: {
        type : String,
        trim : true
    },
    brandName: {
        type: String,
        required: [true, "Brand name is required"],
        trim: true, 
        maxlength: 20
    },
    categories: {
        type: [{
            type: String,
        }],
        trim: true,
    }
});

const BrandModel = mongoose.model('brand', brandSchema);
export default BrandModel;
