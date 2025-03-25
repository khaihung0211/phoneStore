const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Category = require('./models/Category');
const categories = require('./data/categories');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    await Category.deleteMany();
    await Category.insertMany(categories);
    console.log('Dữ liệu đã được import thành công!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Category.deleteMany();
    console.log('Dữ liệu đã được xóa thành công!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}