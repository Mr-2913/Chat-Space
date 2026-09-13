import app from './app.js';
import "dotenv/config";
import connectDB from './config/db.js';

const port=process.env.PORT || 3000;

connectDB();  //db connect call


app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});