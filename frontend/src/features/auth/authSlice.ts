import { SetUserActionPayload } from '@/features/auth/actionTypes';
import { RootState } from '@/store';
import { IUser } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IAuthSliceInitialState {
  user: IUser | null;
}

const getUserFromStorage = () => {
  return JSON.parse(localStorage.getItem('user') as string) as IUser;
};

const storeUserToStorage = (user: IUser | null) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const initialState: IAuthSliceInitialState = {
  user: getUserFromStorage() || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUserActionPayload>) => {
      state.user = action.payload.user;
      storeUserToStorage(state.user);
    },
    logOutUser: (state) => {
      state.user = null;
      storeUserToStorage(null);
    },
  },
});

export const { setUser, logOutUser } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
