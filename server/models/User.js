import mongoose from "mongoose";    

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            trim: true,
        },
        role: {
            type: String,
            enum: ['customer', 'restaurant', 'delivery'],
            default: 'customer',
        },
        addresses: [
            {
                label: String,
                street: String,
                city: String,
                pincode: String,
            },
        ],
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

export default User;
