const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");
const contactRoutes = require("./routes/contactRoute");
const errorHandler = require("./middleWare/errorMiddleware");
const cookieParser = require("cookie-parser");
const path = require('path');
const encryption = require("./middleWare/encryptionMiddleware");
const morgan = require("morgan");

     
//
const app = express();                                         
                                  
    
// Middleware          
app.use(morgan("dev"));
app.use(encryption); 
app.use(cookieParser()); 
app.use(express.json());  
//ok              
// app.use(express.urlencoded({ extended: false }));          
// app.use(bodyParser.json());




app.use(cors({
   origin: [process.env.FRONTEND_URL, "https://shelfwise-app.vercel.app"],
   credentials: true,  
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes middleware
app.use("/api/users", userRoutes);  
app.use("/api/products", productRoutes);
app.use("/api/contactus", contactRoutes);

  
// Routes
app.use("/",(req, res) =>{
    res.send("Welcome to ShelfWise App")
})



const PORT = process.env.PORT || 5000;

// Error middleware
app.use(errorHandler);


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
    
  });
        