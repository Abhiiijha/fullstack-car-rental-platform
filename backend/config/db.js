import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://abhiijha9088_db_user:gcz9yu72h4PUMcPF@cluster0.bvjpmmo.mongodb.net/?appName=Cluster0')
  .then(() => console.log('DB Connected'))
}