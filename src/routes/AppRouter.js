import React from "react";
import { Route, Routes } from "react-router";
import AdminOrderPage from "../page/AdminOrderPage/AdminOrderPage";
import AdminProduct from "../page/AdminProductPage/AdminProductPage";
import CartPage from "../page/CartPage/CartPage";
import Login from "../page/LoginPage/LoginPage";
import MyPage from "../page/MyPage/MyPage";
import OrderCompletePage from "../page/OrderCompletePage/OrderCompletePage";
import PaymentPage from "../page/PaymentPage/PaymentPage";
import ProductAll from "../page/LandingPage/ProductAll";
import ProductDetail from "../page/ProductDetailPage/ProductDetailPage";
import RegisterPage from "../page/RegisterPage/RegisterPage";
import PrivateRoute from "./PrivateRoute";
import KakaoCallback from "../page/LoginPage/KakaoCllback";
import R3FPage from "../page/R3FPage/R3FPage"


const AppRouter = () => {
  return (
    <Routes>

      <Route path="/" element={<ProductAll />} />
      <Route path="/r3f" element={<R3FPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />

      <Route element={<PrivateRoute permissionLevel="customer" />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<OrderCompletePage />} />
        <Route path="/account/purchase" element={<MyPage />} />
      </Route>

      <Route element={<PrivateRoute permissionLevel="admin" />}>
        <Route path="/admin/product" element={<AdminProduct />} />
        <Route path="/admin/order" element={<AdminOrderPage />} />
      </Route>

    </Routes>
  );
};

export default AppRouter;
