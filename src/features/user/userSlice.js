import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try{
      const response = await api.post('/auth/login', {email, password})
      sessionStorage.setItem("token", response.data.token);
      return response.data
    }catch(error){
      return rejectWithValue(error.error)
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try{
      const response = await api.post("/auth/google", {token})
            sessionStorage.setItem("token", response.data.token);
      return response.data.user
    }catch(error){
      return rejectWithValue(error.error)
    }
  }
);

export const logoutUser = () => (dispatch) => {
  dispatch(logout());      // user 초기화
  dispatch(initialCart());
};


export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },{ dispatch, rejectWithValue }
  ) => {
    try{
      const response = await api.post("/user",{email, name, password} )
      //1. 성공 토스트 메세지 보여주기
      dispatch(showToastMessage({message:"회원가입 성공!", status:"success"}))
      //2. 로그인 페이지로 리다이렉트
      navigate('/login')

      return response.data //axios는 기본적으로  data에 넣어서줌 . 여기서 우리가 또 데이터에 넣었음
    }catch(error){
      console.log("에러를 찾아봅시다. axios에서 뭘받아왔나요?",error)
      dispatch(showToastMessage({message:"회원가입 실패ㅠㅠ", status:"error"}))
      return rejectWithValue(error.error)
      
    }

  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try{
      const response = await api.get("/user/me")
      return response.data
    }catch(error){
      return rejectWithValue(error.error)
    }

  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    logout: (state) => {
      state.user = null; // 상태 초기화
      sessionStorage.removeItem("token"); // 저장된 토큰 삭제
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state)=>{
      state.loading = true
    })
    .addCase(registerUser.fulfilled, (state)=>{
      state.loading=false
      state.registrationError=null
    })
    .addCase(registerUser.rejected, (state, action)=>{
      state.registrationError = action.payload
    })
    .addCase(loginWithEmail.pending, (state)=>{
      state.loading = true
    })
    .addCase(loginWithEmail.fulfilled, (state, action)=>{
      state.loading = false
      state.user = action.payload.user //이거때문에 바로 리다이렉트 되는거임 LoginPage에 보면!
      state.loginError = null
    })
    .addCase(loginWithEmail.rejected, (state, action)=>{
      state.loading = false
      state.loginError = action.payload
    })
    .addCase(loginWithToken.fulfilled, (state, action)=>{
      state.user = action.payload.user
      state.loginError = null
    })
    .addCase(loginWithGoogle.pending, (state)=>{
      state.loading = true
    })
    .addCase(loginWithGoogle.fulfilled, (state, action)=>{
      state.loading = false
      state.user = action.payload //이거때문에 바로 리다이렉트 되는거임 LoginPage에 보면!
      state.loginError = null
    })
    .addCase(loginWithGoogle.rejected, (state, action)=>{
      state.loading = false
      state.loginError = action.payload
    })
  },
});
export const { clearErrors, logout } = userSlice.actions;
export default userSlice.reducer;
