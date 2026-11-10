import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    setTasks: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addTask: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.items.findIndex(
        (t) => (t._id || t.id) === (action.payload._id || action.payload.id)
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeTask: (state, action) => {
      state.items = state.items.filter(
        (t) => (t._id || t.id) !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const {
  setTasks,
  addTask,
  updateTask,
  removeTask,
  setLoading,
  setError
} = taskSlice.actions;

export default taskSlice.reducer;
