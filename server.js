import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
const uri = "mongodb+srv://gz8a5:ggmangg0@cluster0.58lxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Define User Schema
const userSchema = new mongoose.Schema({
  name: String,
  dateOfBirth: Date,
  address: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/users', async (req, res) => {
  try {
    const { name, dateOfBirth, address } = req.body;
    if (!name || !dateOfBirth || !address) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
