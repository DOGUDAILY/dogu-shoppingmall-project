import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";
import { initialCart } from "../cart/cartSlice";


// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.post("/order",payload)
      dispatch(initialCart())
      return response.data.orderNum
    }catch(error){
      dispatch(showToastMessage({message:error.error, status:'error'}))
      return rejectWithValue(error.error)
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/order"); // 여기가 맞는지
      return response.data.data; // 응답 구조에 따라 다름
    } catch (error) {
      return rejectWithValue(error.response.data);
    }


  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/order/admin", { params: query });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue, getState }) => {
    try {
      const response = await api.put(`/order/${id}`, { status });
      dispatch(showToastMessage({ message:"주문 상태 변경 완료", status:"success"}));
      
      const { searchQuery } = getState().order; // 현재 검색쿼리 가져오기 (없다면 AdminOrderPage에서 prop으로 전달 필요)
      dispatch(getOrderList(searchQuery));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending,(state,action)=>{
      state.loading = true
    })
    .addCase(createOrder.fulfilled,(state,action)=>{
      state.loading = false
      state.error=""
      state.orderNum = action.payload
    })
    .addCase(createOrder.rejected,(state,action)=>{
      state.loading = false
      state.error = action.payload
    })
     .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload;
        state.error = "";
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload.data;
      })
        },
      });

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
