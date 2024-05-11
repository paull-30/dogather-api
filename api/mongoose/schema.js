import mongoose from 'mongoose';

const RoleType = {
  VOLUNTEER: 'VOLUNTEER',
  ORGANIZER: 'ORGANIZER',
  ADMIN: 'ADMIN',
};

const PostStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  bio: String,
  role: { type: String, enum: Object.values(RoleType) },
  skills: [String],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  applicated: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Post', accepted: false },
  ],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

const PostSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  lookedUpSkills: [String],
  status: { type: String, enum: Object.values(PostStatus) },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  accepted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

const TaskSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  postID: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  deadline: { type: Date },
  assignedUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export const User = mongoose.model('User', UserSchema);
export const Post = mongoose.model('Post', PostSchema);
export const Task = mongoose.model('Task', TaskSchema);
