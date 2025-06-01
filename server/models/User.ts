import mongoose, { Document } from 'mongoose'; // Correct import: import mongoose as default, and Document as named if it's there

// The 'Document' type is typically exported as a named export by Mongoose,
// so importing it directly like this is generally fine.
// If you encounter issues with 'Document' later, you can also access it via `mongoose.Document`.


// Interface for User document (optional, but good for TypeScript)
export interface IUser extends Document {
    username: string;
    email: string;
    password: string; // Hashed password
    role: 'user' | 'admin';
    isVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Access Schema from the default `mongoose` import
const UserSchema: mongoose.Schema<IUser> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false, // Don't return password by default on queries
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save hook to update `updatedAt` field
UserSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Access models and model from the default `mongoose` import
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;