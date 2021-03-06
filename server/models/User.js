
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    username: {
        type: String,
        required: [true, "please enter a username"],
        minlength: 3,
        unique: true,
    },
    bio: {
        type: String

    },
    email: {
        type: String,
        required: [true, "please provide an email "],
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },
    password: {
        type: String,
        required: [true, "please add password"],
        minlength: 6,

    },
    avatar: {
        type: String,
    },
    cloudinary_id: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    DateCreated: {
        type: Date,
        default: Date.now
    }


});

userSchema.pre('save', async function (next) {
    try {

        // hash password before saving to database
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    } catch (error) {
        console.log(error)
        next()
    }

});
userSchema.pre('save', async function () {
    if (this.isNew) {
        try {
            const document = await User.findOne({ email: this.email });
            if (document) {
                throw new Error('user alredy exists')
            }
            await mongoose.model('Followers').create({ _user: this._id })
            await mongoose.model('Following').create({ _user: this._id })

        } catch (error) {
            console.log(error)
        }

    }
})

userSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);

};

userSchema.methods.generateToken = async function () {
    try {
        const payload = {
            user: {
                id: this._id
            }
        };
        const token = await jwt.sign(payload, process.env.JwtSecret, { expiresIn: 360000 });
        return token;
    } catch (error) {
        console.log(error)
    }
};

userSchema.methods.getPasswordResetToken = function () {

    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // set the token expiry date 
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // 10 minuites
    return resetToken;
};

module.exports = User = mongoose.model('Users', userSchema);