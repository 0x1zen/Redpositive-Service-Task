require('dotenv').config();
const express=require('express');
const cors=require('cors');
const zod=require('zod');
const validator=require('validator');
const { User } = require('./db');

const app=express();

app.use(cors());
app.use(express.json());

// Routes and Input Validation

const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/

const signupBody = zod.object({
    name: zod.string().max(40),
    phone: zod.string()
        .min(10, { message: 'Phone number must be at least 10 digits long' })
        .max(13, { message: 'Phone number cannot exceed 13 digits' })
        .regex(phoneRegex, { message: 'Invalid Number!' }),
    email: zod.string().email(),
    hobbies: zod.string().max(50)
});

// console.log(
//     signupBody.safeParse({
//       name: "test",
//       phone: "+919999999999",
//       email:"raj@raj.com",
//       hobbies:"game,ball"
//     })
//   ); // Success

// User Signup Request

app.post("/signup", async (req, res) => {
    try {
        const { success, error } = signupBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: "Please Input Valid Details!" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already taken" });
        }

        // Create new user
        const newUser = await User.create({
            uid: Math.floor(1 + Math.random() * 1000),
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            hobbies: req.body.hobbies
        });

        res.json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error occurred during signup:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


const updateBody = zod.object({
	name: zod.string().max(40).optional(),
    phone: zod.string()
    .min(10, { message: 'Phone number must be at least 10 digits long' })
    .max(13, { message: 'Phone number cannot exceed 13 digits' })
    .regex(phoneRegex, { message: 'Invalid Number!' })
    .optional(),
    email: zod.string().email().optional(),
    hobbies: zod.string().max(50).optional()
})



app.put("/update", async (req, res) => {
    try {
        const { success, error } = updateBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: error.message });
        }

        const userId = req.query.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is missing in the request" });
        }

        await User.updateOne(
            { _id: userId }, // Query criteria
            req.body // Update document
        );

        res.json({ message: "Updated successfully" });
    } catch (error) {
        console.error("Error occurred while updating data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete request to delete particular user

app.delete("/delete", async (req, res) => {
    try {
        const userId = req.query.id;
        await User.deleteOne(
            { _id: userId } // Query criteria to match the document
        );
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error occurred while deleting data:", error);
        res.status(500).json({ message: "Error occurred while deleting data" });
    }
});



// Get request for sending bulk users to frontend

app.get("/", async (req, res) => {
    try{
        // retrieveing all users
        const users=await User.find();

        const formattedUsers=users.map(user=>({
            _id:user._id,
            uid:user.uid,
            name:user.name,
            phone:user.phone,
            email:user.email,
            hobbies:user.hobbies
        }));
        res.json({ users: formattedUsers });
    }
    catch(error){
        console.error("Error occurred while fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



app.listen(3000,()=>{
    console.log("Listening On Port 3000");
});
  



