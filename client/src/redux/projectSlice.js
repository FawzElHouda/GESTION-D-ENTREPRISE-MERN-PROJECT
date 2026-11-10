import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    setProjects: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addProject: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.items.findIndex(
        (p) => (p._id || p.id) === (action.payload._id || action.payload.id)
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeProject: (state, action) => {
      state.items = state.items.filter(
        (p) => (p._id || p.id) !== action.payload
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
  setProjects,
  addProject,
  updateProject,
  removeProject,
  setLoading,
  setError
} = projectSlice.actions;

export default projectSlice.reducer;
