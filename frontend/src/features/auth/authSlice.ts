import { SetUserActionPayload } from '@/features/auth/actionTypes';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IAuthSliceInitialState {
  user: null;
}

const initialState: IAuthSliceInitialState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUserActionPayload>) => {
      state.user = action.payload.user;
    },
  },
});

export default authSlice.reducer;
