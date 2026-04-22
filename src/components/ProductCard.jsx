const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}) {
  return (
    <article className="product-card">
      <img className="product-card__image" src={product.image} alt={product.title} />
      <div className="product-card__content">
        <div className="product-card__meta">
          <span className="chip">{product.category}</span>
          <span className="rating">Rate: {product?.rating?.rate ?? 0}</span>
        </div>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
      </div>
      <div className="product-card__footer">
        <strong>{usdFormatter.format(product.price)}</strong>
        <div className="product-card__actions">
          <button
            className="btn btn--ghost"
            onClick={() => onToggleFavorite(product.id)}
            type="button"
          >
            {isFavorite ? 'In Favorites' : 'Add Favorite'}
          </button>
          <button
            className="btn btn--primary"
            onClick={() => onAddToCart(product.id)}
            type="button"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}
