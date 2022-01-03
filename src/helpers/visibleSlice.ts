import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
interface visibleState {
  value: (number | boolean)[][]
}

// Define the initial state using that type
const initialState: visibleState = {
  value: []
}

export const slice = createSlice({
  name: 'visible',
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<(number | boolean)[][]>) => {
      state.value = action.payload
    },
    makeTrueToFalse: (state, action) => {
        const tmp = state.value
        tmp[action.payload as number] = [action.payload as number, false]
        state.value = tmp
    },
  },
});

export const { initialize, makeTrueToFalse } = slice.actions;


export const selectCount = (state: RootState) => state.visible.value;

export default slice.reducer;
