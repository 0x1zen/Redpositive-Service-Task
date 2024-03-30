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
//       phone: "+919689480487",
//       email:"raj@raj.com",
//       hobbies:"game,ball"
//     })
//   ); // Success

// User Signup Request

app.post("/signup",async(req,res)=>{
    console.log(req.body);
    // const { success } = signupBody.safeParse(req.body);

    // if(!success){
    //     res.status(411).json({message:"Email Already Taken/Incorrect Inputs"})
    // }
    try{
         const { success } = signupBody.safeParse(req.body);
    }
    catch(error){
        res.status(411).json({message:"Email Already Taken/Incorrect Inputs"})
    }
    
    try {
        const existingUser = await User.findOne({
            email: req.body.email
        });
    
        if (existingUser) {
            return res.status(411).json({
                message: "Email already taken/Incorrect inputs"
            });
        }
    } catch (error) {
        // Handle the error
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
    
    // const existingUser = await User.findOne({
    //     email:req.body.email
    // })
    // if (existingUser) {
    //     return res.status(411).json({
    //         message: "Email already taken/Incorrect inputs"
    //     })
    // }
    
    const user = await User.create({
        id:Math.floor(1 + Math.random() * 1000),
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        hobbies: req.body.hobbies
    })
    res.json({
        message: "User created successfully",
    })

})

// Get request for sending bulk users to frontend

// app.get("/",async(req,res)=>{

// })

app.listen(3000,()=>{
    console.log("Listening On Port 3000");
});
  



