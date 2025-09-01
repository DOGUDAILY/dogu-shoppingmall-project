import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";



// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    console.log("보낼 데이터", { productId: id, size, qty: 1 });
    try{
      await api.post("/cart", {productId:id,size,qty:1})
      dispatch(getCartList());
      dispatch(showToastMessage({message:"카트 아이템 추가 성공!", status:"success"}))
      return true
    }catch(error){
      dispatch(showToastMessage({message:"카트 아이템 추가 실패!", status:"error"}))
    return rejectWithValue(error.error)
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.get("/cart")
      return response.data.data
    }catch(error){
      return rejectWithValue(error.error)
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/cart/${id}`); // 서버에 DELETE 요청
      dispatch(showToastMessage({ message: "카트 아이템 삭제 완료", status: "success" }));
      dispatch(getCartList());

    } catch (error) {
      dispatch(showToastMessage({ message: "카트 아이템 삭제 실패", status: "error" }));
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/cart/${id}`, { qty: value });
      dispatch(showToastMessage({ message: "수량 변경 완료", status: "success" }));
      dispatch(getCartList())

      return response.data.data;
    } catch (error) {
      dispatch(showToastMessage({ message: "수량 변경 실패", status: "error" }));
      return rejectWithValue(error.message);
    }
  
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState:{
        loading: false,
        error: "",
        cartList: [],
        selectedItem: {},
        cartItemCount: 0,
        totalPrice: 0,
      },
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
      state.cartList = [];
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
    .addCase(addToCart.pending, (state,action)=>{
      state.loading=true
    })
    .addCase(addToCart.fulfilled, (state,action)=>{
      state.loading=false
      state.error = ""
    })
    .addCase(addToCart.rejected, (state,action)=>{
      state.loading=false
      state.error = action.payload
    })

    .addCase(getCartList.pending, (state,action)=>{
      state.loading=true
    })
    .addCase(getCartList.fulfilled, (state,action)=>{
      state.loading=false
      state.error = ""
      state.cartList=action.payload
      state.cartItemCount = action.payload.length
      state.totalPrice=action.payload.reduce(
        (total,item)=>total+item.productId.price*item.qty,0)
    })
    .addCase(getCartList.rejected, (state,action)=>{
      state.loading=false
      state.error = action.payload
    })

     .addCase(deleteCartItem.fulfilled, (state, action) => {
      state.loading=false
      state.error = ""
    })
    .addCase(updateQty.fulfilled, (state, action) => {
      state.loading=false
      state.error = ""
  })
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
