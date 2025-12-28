import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaEye, FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  return (
    <div className="card fade-in">
      <div className="relative">
        <img 
          src={product.image || '/placeholder-product.jpg'} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {!product.onStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
            אזל מהמלאי
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <span className="text-blue-600 font-bold">{product.cost} ₪</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{product.specification}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
            {product.category}
          </span>
          <div className="flex items-center">
            <FaStar className="text-yellow-400" />
            <span className="text-gray-600 text-sm mr-1">4.5</span>
          </div>
        </div>
        
        <div className="flex space-x-2 space-x-reverse">
          <button className="btn btn-primary flex-1 flex items-center justify-center space-x-1 space-x-reverse">
            <FaShoppingCart />
            <span>הוספה לעגלה</span>
          </button>
          <Link 
            to={`/product/${product._id}`}
            className="btn btn-outline flex items-center justify-center px-4"
          >
            <FaEye />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;