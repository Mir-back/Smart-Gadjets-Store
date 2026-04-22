import { useMemo, useState } from 'react'
import { ProductCard } from '../components/ProductCard.jsx'
import { useStore } from '../context/StoreContext.jsx'

export function HomePage() {
  const {
    products,
    categories,
    favorites,
    addToCart,
    toggleFavorite,
    isLoadingProducts,
    productsError,
  } = useStore()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [maxPrice, setMaxPrice] = useState('')

  const highestPrice = useMemo(() => {
    if (products.length === 0) {
      return 0
    }
    return Math.ceil(Math.max(...products.map((product) => Number(product.price) || 0)))
  }, [products])

  const activeMaxPrice = maxPrice === '' ? highestPrice : Number(maxPrice)

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productMatchesCategory =
        category === 'all' || product.category === category
      const productMatchesPrice =
        highestPrice === 0 || Number(product.price) <= activeMaxPrice
      const normalizedSearch = search.trim().toLowerCase()
      const productMatchesSearch =
        normalizedSearch.length === 0 ||
        product.title.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch)

      return (
        productMatchesCategory && productMatchesPrice && productMatchesSearch
      )
    })
  }, [activeMaxPrice, category, highestPrice, products, search])

  const resetFilters = () => {
    setSearch('')
    setCategory('all')
    setMaxPrice('')
  }

  return (
    <section className="page fade-up">
      <div className="hero">
        <div className="hero__text">
          <p className="hero__tag">Affordable tech for every day</p>
          <h1>Smart Gadgets Store</h1>
          <p>
            Budget-friendly headphones, keyboards, mice, chargers and power banks.
            Add to cart, save favorites and control your catalog from admin panel.
          </p>
        </div>
        <div className="hero__stats">
          <div>
            <span>Total products</span>
            <strong>{products.length}</strong>
          </div>
          <div>
            <span>Favorites</span>
            <strong>{favorites.length}</strong>
          </div>
          <div>
            <span>Visible now</span>
            <strong>{filteredProducts.length}</strong>
          </div>
        </div>
      </div>

      <section className="filter-panel fade-up">
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or description"
            type="search"
            value={search}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            onChange={(event) => setCategory(event.target.value)}
            value={category}
          >
            <option value="all">All categories</option>
            {categories.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="price">
            Max price: ${Number(activeMaxPrice || 0).toFixed(2)}
          </label>
          <input
            id="price"
            max={highestPrice || 1000}
            min="0"
            onChange={(event) => setMaxPrice(Number(event.target.value))}
            type="range"
            value={
              highestPrice === 0
                ? 0
                : Math.min(activeMaxPrice, highestPrice || 1000)
            }
          />
        </div>

        <button className="btn btn--outline" onClick={resetFilters} type="button">
          Reset filters
        </button>
      </section>

      {isLoadingProducts && <p className="alert">Loading products from API...</p>}
      {productsError && <p className="alert alert--warning">{productsError}</p>}

      <section className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            isFavorite={favorites.includes(product.id)}
            key={product.id}
            onAddToCart={addToCart}
            onToggleFavorite={toggleFavorite}
            product={product}
          />
        ))}
      </section>
    </section>
  )
}
