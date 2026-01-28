
import Express, { NextFunction, response } from "express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { admin, Product, User } from "./db";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { productSchema, userSchema } from "./types/validation";
import { z } from "zod";
import cors from "cors";
import Stripe from "stripe";
import { generateOTP, isOTPExpired } from "./utils/otp";
import { sendOTPEmail } from "./utils/mailer";

const app = Express();
app.use(Express.json());
dotenv.config();

const port = 5000;
const SECRET = process.env.SECRET || "fallback_secret";

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil" as const,
  typescript: true,
});
interface JwtPayload {
  userID: string;
  username: string;
  iat?: number;
  exp?: number;
  avtar?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      admin?: JwtPayload;
      
    }
  }
}

// CORS configuration
app.use(
  cors({
    origin: "https://nexus-777v.vercel.app",
    credentials: true,
  })
);

// Authentication middleware
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing" });
    return;
  }

  const token = authHeader.split(" ")[1];

  Jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }

    const payload = decoded as JwtPayload;
    req.user = payload;

    next();
  });
};

const adminticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const access = authHeader.split(" ")[1];

    Jwt.verify(access, SECRET, (err, admin) => {
      if (err) {
        return res.sendStatus(403);
      }

      const payload = admin as JwtPayload;
      req.admin = payload;
      next();
    });
  }
};

// Stripe Payment Integration
app.post(
  "/api/v1/payment/create-payment-intent",
  authenticateUser,
  async (req: Request, res: Response) => {
    const { productId } = req.body;
    const userId = req.user?.userID;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    try {
      // Get product with proper typing
      const product = await Product.findById(productId).lean();
      console.log("success");
      if (!product || typeof product.price !== "number") {
        res.status(404).json({ message: "Product not found or invalid price" });
        return;
      }

      // Validate price
      const amount = Math.round(product.price * 100);
      if (isNaN(amount)) {
        res.status(400).json({ message: "Invalid product price" });
        return;
      }
      console.log("success");

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        metadata: {
          productId: product._id.toString(),
          userId: userId,
        },
      });

      console.log("control reched here");
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        message: "got success",
      });
      console.log("success");
    } catch (error) {
      console.error("Payment intent error:", error);
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  }
);

// Updated purchase route
app.post(
  "/api/v1/user/purchase/:productId",
  authenticateUser,
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const userId = req.user?.userID;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { purchaseProduct: productId } },
        { new: true }
      ).populate("purchaseProduct");

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Product purchased successfully",
        products: user.purchaseProduct,
      });
    } catch (error) {
      console.error("Purchase error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Admin routes
app.post("/api/v1/admin/signup", async (req: Request, res: Response) => {
  const { username, password } = userSchema.parse(req.body);
  try {
    const hashPassword = await bcrypt.hash(password, 8);
    const user = await admin.create({
      username,
      password: hashPassword,
    });
    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "1h" });
    res
      .status(200)
      .json({ message: "admin register succesfully", token, success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(500).json({ error: error.errors });
    }
    return;
  }
});

app.post("/api/v1/admin/signin", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await admin.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "admin not found" });
      return;
    }
    const passwordValid = await bcrypt.compare(
      password as string,
      user?.password as string
    );
    if (!passwordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { username: user.username, userID: user._id.toString() },
      SECRET,
      { expiresIn: "1hr" }
    );
    res
      .status(200)
      .json({ success: true, token, message: " admin Signin successful" });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User routes
app.post("/api/v1/user/signup", async (req: Request, res: Response) => {
  const { username, password ,email} = req.body;
  console.log(username, password,email)
  try {
    const hashPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
      username,
      password: hashPassword,
      email
    });
    console.log("username")
    const token = jwt.sign(
      {
        userId: user._id,
      },
      SECRET,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .json({ message: "user register succesfully", token, success: true });
  } catch (error) {
    res.status(500).json({ message: "internel server error beause you not get this " });
  }
});

app.post("/api/v1/user/signin", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const passwordValid = await bcrypt.compare(
      password as string,
      user?.password as string
    );
    const token = jwt.sign(
      {
        username: user.username,
        userID: user._id,
        avtar: user.avtar,
      },
      SECRET,
      {
        expiresIn: "1hr",
      }
    );
    res
      .status(200)
      .json({ success: true, token, message: "Signin successful" });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get(
  "/api/v1/user/me",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      // First get fresh user data from database
      const user = await User.findById(req.user?.userID).select('-password');
      
      if (!user) {
         res.status(404).json({ message: "User not found" });return
      }

      res.json({
        username: user.username,
        userId: user._id,  // Consistent field naming
        avtar: user.avtar  // Make sure to include this
      });
    } catch (error) {
      console.error("Error in /me endpoint:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.put(
  "/api/v1/user/update/:userId",
  authenticateUser,
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    console.log(userId)
    // Validate the userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
       res.status(400).json({ message: "Invalid user ID" });return
    }

    const { username, avtar } = req.body;
    try {
      const updateData: { username?: string; avtar?: string } = {};

      if (username) updateData.username = username;
      if (avtar) {
        updateData.avtar = avtar;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!updatedUser) {
         res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User updated successfully", user: updatedUser });return
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Product routes
app.post(
  "/api/v1/product",
  adminticateAdmin,
  async (req: Request, res: Response) => {
    const { title, description, image, price, colour, size } =
      productSchema.parse(req.body);
    try {
      const product = new Product({
        title,
        description,
        price,
        image,
        colour,
        size,
      });
      await product.save();
      res.status(201).json({ message: "product is created", product });
    } catch (error) {
      res.status(500).json({ message: "internel server error" });
    }
  }
);

app.get("/api/v1/product", async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ message: "list", products });
  } catch (error) {
    res.status(500).json({ message: "internel server error" });
  }
});

app.get("/api/v1/product/:productId", async (req: Request, res: Response) => {
  const productid = req.params.productId;
  try {
    if (!productid) {
      res.status(400).json({ message: "post id not found" });
      return;
    }

    const product = await Product.findById(productid);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "internel server error" });
  }
});

app.put("/api/v1/product/:productId", async (req: Request, res: Response) => {
  const productid = req.params.productId;
  const userWantTOupdate = req.body;
  try {
    if (!productid) {
      res.status(400).json({ message: "post id not found" });
      return;
    }

    const updateProduct = await Product.findByIdAndUpdate(productid, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, updateProduct });
  } catch (error) {
    res.status(500).json({ message: "internel server error" });
  }
});

app.delete(
  "/api/v1/product/:productId",
  async (req: Request, res: Response) => {
    try {
      const productId = req.params.productId;
      if (!productId) {
        res.status(404).json({ message: "Porduct not found" });
        return;
      }
      const deleteProduct = await Product.findByIdAndDelete(productId);
      res
        .status(200)
        .json({ message: "product deleted successfully", deleteProduct });
    } catch (error) {
      res.status(500).json({ message: "internel server error" });
    }
  }
);

// Get user's purchased products
app.get(
  "/api/v1/user/purchasedproducts",
  authenticateUser,
  async (req: Request, res: Response) => {
    const userId = req.user?.userID;

    try {
      const user = await User.findById(userId)
        .populate({
          path: "purchaseProduct",
          model: "Product",
        })
        .select("purchaseProduct -_id");

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({
        success: true,
        purchasedProducts: user?.purchaseProduct || [],
      });
    } catch (error) {
      console.error("Error fetching purchased products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//  start otp from here

// Update your backend endpoint
app.post("/api/v1/auth/send-otp", async (req: Request, res: Response) => {
  const { email } = req.body; // Now only expecting email
  
  if (!email) {
     res.status(400).json({ message: "Email is required" });
  return}

  try {
    const otp = generateOTP();
    console.log(otp)
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    
    // Store just the OTP data (no username/password yet)
    await User.findOneAndUpdate(
      { email },
      { email, otp, otpExpiry },
      { upsert: true }
    );
    
    await sendOTPEmail(email, otp);
    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("OTP send error:", error);
    res.status(500).json({ message: "Failed to send OTP direct here" });
  }
});

// 2. Verify OTP & Complete Signup
app.post("/api/v1/auth/verify-signup", async (req: Request, res: Response) => {
  const { username, password, email, otp } = req.body;

  try {
    const user = await User.findOne({ email }) as any;

    if (!user || user.otp !== otp || isOTPExpired(user.otpExpiry)) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    await User.findByIdAndUpdate(user._id, {
      username,
      password: hashedPassword,
      verified: true,
      otp: null,
      otpExpiry: null,
    });

    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "1h" });

    res.json({
      success: true,
      token,
      message: "Account verified and created",
    });
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
});


// Database connection and server start
mongoose
  .connect("mongodb+srv://shivakushwah144:SHan2004@cluster0.gkj9xcy.mongodb.net/test?retryWrites=true&w=majority", { dbName: "courses" })
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });



