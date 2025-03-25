import React from 'react';
import { Link } from 'react-router-dom';

const CategoryList = ({ categories = [] }) => {
  const defaultCategories = [
    { _id: '1', name: 'Smartphone', image: 'https://placehold.co/300x200/0066cc/white?text=Smartphones', slug: 'smartphones' },
    { _id: '2', name: 'Tablet', image: 'https://placehold.co/300x200/0066cc/white?text=Tablets', slug: 'tablets' },
    { _id: '3', name: 'Phụ kiện', image: 'https://placehold.co/300x200/0066cc/white?text=Accessories', slug: 'accessories' },
    { _id: '4', name: 'Smartwatch', image: 'https://placehold.co/300x200/0066cc/white?text=Smartwatches', slug: 'smartwatches' },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {displayCategories.map((category) => (
        <Link 
          to={`/products?category=${category.slug}`} 
          key={category._id} 
          className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105"
        >
          <div className="h-40 overflow-hidden">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/300x200/0066cc/white?text=${category.name}`;
              }}
            />
          </div>
          <div className="p-4 bg-white">
            <h3 className="text-lg font-medium text-center text-primary">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;