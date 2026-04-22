import { useStore } from '../context/StoreContext.jsx'

export function FavoritesPage() {
  const { addToCart, favoriteProducts, toggleFavorite } = useStore()

  return (
    <section className="page fade-up">
      <h1>Favorites</h1>
      <p className="page-subtitle">Items that you saved for later.</p>

      {favoriteProducts.length === 0 ? (
        <div className="card">
          <p>No favorites yet. Use "Add Favorite" on the Home page.</p>
        </div>
      ) : (
        <div className="products-grid">
          {favoriteProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <img
                className="product-card__image"
                src={product.image}
                alt={product.title}
              />
              <div className="product-card__content">
                <span className="chip">{product.category}</span>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
              </div>
              <div className="product-card__footer">
                <strong>${Number(product.price).toFixed(2)}</strong>
                <div className="product-card__actions">
                  <button
                    className="btn btn--ghost"
                    onClick={() => toggleFavorite(product.id)}
                    type="button"
                  >
                    Remove favorite
                  </button>
                  <button
                    className="btn btn--primary"
                    onClick={() => addToCart(product.id)}
                    type="button"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
