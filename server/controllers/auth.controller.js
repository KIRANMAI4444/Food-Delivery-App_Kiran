
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

// @desc Register a new user
// @route POST /api/auth/register
// @access Pubilc

export const register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        //1. Validate required fields
        if( !name || !email || !password || !phone ){
            return res.status(400).json({message: 'All fields are required!!!'});
        }

        //2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        } 

        //3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //4. Create the user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || 'customer',
        });

        //5. Generate JWT
        const token = generateToken(user._id, user.role);

        //6. Return user (WITHOUT password) + token
        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
            token,
        });

    }catch (err){
        console.error('Register error:', err.message);
        res.status(500).json({message: 'Server Error', error: err.message});
    }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        //1. Validate
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        //2. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        //3. Compare password with hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        //4. Generate JWT
        const token = generateToken(user._id, user.role);
        //5. Return user (without password) + token
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
            token,
        });
    }catch(err) {
        console.error('Login error:', err.message);
        res.status(500).json({message: 'Server Error', error: err.message});
    }
};
