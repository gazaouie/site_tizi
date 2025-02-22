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

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
    const { name, dateOfBirth, address } = req.body;

    // Check if all fields are filled
    if (!name || !dateOfBirth || !address) {
      return res.status(400).send({ message: 'All fields are required!' });
    }

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

// Client-side code to handle form submission
document.getElementById('registerButton').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const dateOfBirth = document.getElementById('dateOfBirth').value;
  const address = document.getElementById('address').value;

  if (!name || !dateOfBirth || !address) {
    alert('All fields are required!');
    return;
  }

  const user = {
    name,
    dateOfBirth,
    address
  };

  try {
    const response = await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      alert('User registered successfully!');
      document.getElementById('registerForm').reset();
    } else {
      const errorData = await response.json();
      alert('Error: ' + errorData.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});
