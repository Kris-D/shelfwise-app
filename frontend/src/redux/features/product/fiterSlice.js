import { createSlice } from '@reduxjs/toolkit'

const initialState = {
 filteredProducts: []
}

const fiterSlice = createSlice({
  name: 'fiter',
  initialState,
  reducers: {
    FILTER_PRODUCTS: (state, action) => {
      const { products, search } = action.payload
      const tempProducts = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase())|| product.category.toLowerCase().includes(search.toLowerCase())  )
      state.filteredProducts = tempProducts
    }
  }
});

export const {FILTER_PRODUCTS} = fiterSlice.actions
export const selectFilteredProducts = (state) => state.fiter.filteredProducts

export default fiterSlice.reducer