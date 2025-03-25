export * from './authService';
export * from './userService';
export * from './productService';
export * from './categoryService';
export * from './orderService';
export * from './cartService';

export { default as api } from './axiosConfig';

import authService from './authService';
export default authService;