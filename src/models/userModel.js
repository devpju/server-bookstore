import mongoose, { Schema } from 'mongoose';
import {
  ACCOUNT_STATUS,
  EXPIRATION_TIME,
  REGEX,
  ROLE,
  SALT_BCRYPT_PASSWORD
} from '~/utils/constants';
import bcrypt from 'bcrypt';
import { toJSON } from './plugin';
import { generateSlug } from '~/utils/helpers';
const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required.']
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    match: [REGEX.EMAIL, 'Please provide a valid email address.']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required.'],
    unique: true,
    match: [REGEX.PHONE_NUMBER, 'Please provide a valid phone number.']
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    private: true
  },
  urlAvatar: {
    type: String
  },
  status: {
    type: String,
    enum: {
      values: Object.values(ACCOUNT_STATUS),
      message: 'Status must be one of the following: ' + Object.values(ACCOUNT_STATUS).join(', ')
    },
    required: [true, 'Account status is required.'],
    default: ACCOUNT_STATUS.UNVERIFIED,
    private: true
  },
  roles: {
    type: [String],
    enum: {
      values: Object.values(ROLE),
      message: 'Role must be one of the following: ' + Object.values(ROLE).join(', ')
    },
    required: [true, 'Role is required.'],
    default: [ROLE.CUSTOMER]
  },
  slug: {
    type: String,
    required: false
  },
  otp: {
    value: {
      type: String,
      minlength: [6, 'OTP must be exactly 6 characters.'],
      maxlength: [6, 'OTP must be exactly 6 characters.']
    },
    expiredAt: {
      type: Date
    }
  },
  resetPasswordToken: {
    value: {
      type: String
    },
    expiredAt: {
      type: Date
    }
  },
  deletedAt: {
    type: Date
  }
});

userSchema.plugin(toJSON);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  return await this.findOne({
    email,
    _id: { $ne: excludeUserId }
  });
};

userSchema.statics.isPhoneNumberTaken = async function (phoneNumber, excludeUserId) {
  return await this.findOne({
    phoneNumber,
    _id: { $ne: excludeUserId }
  });
};

userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function save(next) {
  try {
    if (this.isModified('password')) {
      if (!REGEX.PASSWORD.test(this.password)) {
        throw new Error('Password must meet the complexity requirements.');
      }
      const salt = await bcrypt.genSalt(SALT_BCRYPT_PASSWORD);
      this.password = await bcrypt.hash(this.password, salt);
    }
    if (this.isModified('otp.value') && this.otp.value) {
      this.otp.expiredAt = Date.now() + EXPIRATION_TIME.OTP;
    }

    if (this.isModified('resetPasswordToken.value')) {
      this.otp.expiredAt = Date.now() + EXPIRATION_TIME.RESET_PASSWORD_TOKEN;
    }
    if (this.isModified('fullName') || !this.slug) {
      let slug = await generateSlug({
        Model: this.constructor,
        id: this._id.toString(),
        value: this.fullName
      });
      this.slug = slug;
    }
    next();
  } catch (err) {
    next(err);
  }
});

export const User = mongoose.model('User', userSchema);
