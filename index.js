import express from 'express';
import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';

const app = express();
app.use(express.json());

const uri = "mongodb+srv://gz8a5:ggmangg0@cluster0.58lxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

mongoose.connect(uri);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Define the User schema with the required attributes
const userSchema = new mongoose.Schema({
  name: String,
  dateOfBirth: Date,
  address: String
});

const User = mongoose.model('User', userSchema);

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.patch('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Alter John Doe's date of birth
const alterJohnDoeDOB = async () => {
  try {
    const user = await User.findOneAndUpdate(
      { name: 'Alice Johnson' },
      { dateOfBirth: new Date('1991-03-03') },
      { new: true, runValidators: true }
    );
    if (user) {
      console.log('John Doe\'s date of birth updated:', user);
    } else {
      console.log('John Doe not found');
    }
  } catch (error) {
    console.error('Error updating John Doe\'s date of birth:', error);
  }
};

// Add a new user
const addNewUser = async () => {
  try {
    const newUser = new User({
      name: 'Alice Johnson',
      dateOfBirth: new Date('2000-07-20'),
      address: '789 Oak St'
    });
    await newUser.save();
    console.log('New user added:', newUser);
  } catch (error) {
    console.error('Error adding new user:', error);
  }
};

// Call the function to add a new user
alterJohnDoeDOB();
