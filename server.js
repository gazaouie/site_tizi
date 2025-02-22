import express from 'express';
import mongoose from 'mongoose';
// MongoDB Atlas connection URI (Replace this with your actual URI)
const mongoURI = "mongodb+srv://gz8a5:ggmangg0@cluster0.58lxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Initialize Express
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoURI,{}).then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  address: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Function to add a user
export async function addUser(name, dateOfBirth, address) {
  try {
    const newUser = new User({
        name: name,
        dateOfBirth: dateOfBirth,
        address: address,
    });

    await newUser.save();
    console.log(name + " added successfully!");
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

// Start Express server (not really needed, but added for completeness)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

