const Product = require("../models/Product");
// nhận dc request của client ở route sau đó sẽ gọi getallproducts
exports.searchProducts = async (req, res) => {
  const { query } = req.query;

  try {//
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.getAllProducts = async (req, res) => { ///
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case "price-asc":
          sortOptions.price = 1;
          break;
        case "price-desc":
          sortOptions.price = -1;
          break;
        case "newest":
          sortOptions.createdAt = -1;
          break;
        default:
          sortOptions.createdAt = -1;
      }
    } else {
      sortOptions.createdAt = -1;
    }

    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const totalProducts = await Product.countDocuments(filter);
    res.status(200).json({
      success: true,
      count: products.length,
      totalPages: Math.ceil(totalProducts / Number(limit)),
      currentPage: Number(page),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {//sau đó sẽ truyền data đó đến createProduct (hiển thị)
  try {
    console.log("Body nhận được:", req.body);
    console.log("File nhận được:", req.file);

    const product = new Product(req.body);

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {//Product route sẽ xác minh user như quyền truy cập rule và token, sau đó sẽ truyền data vào updateProduct controller để xử lý
  try {
    const updateData = req.body;

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    console.log("🚀 ~ exports.updateProduct= ~ product:", product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {//sẽ nhận dữ liệu là id của product sau đó truyền vào controller để xác minh dữ liệu đầu vào đây
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sản phẩm đã được xóa",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};//
