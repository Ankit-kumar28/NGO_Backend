import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';


dotenv.config();

const startServer = async () => {
  try {
    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });

  } catch (error) {
    console.error(" Server start failed:", error.message);
    process.exit(1);
  }
};

startServer();