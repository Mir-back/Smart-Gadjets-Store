import { useStore } from '../context/StoreContext.jsx'

export function CartPage() {
  const { cartItems, cartTotal, clearCart, removeFromCart, updateCartItem } =
    useStore()

  const handleBuy = () => {
    clearCart()
    localStorage.setItem('sgs_cart', JSON.stringify([]))
    window.location.reload()
  }

  return (
    <section className="page fade-up">
      <h1>Cart</h1>
      <p className="page-subtitle">Separate cart page with quantity controls.</p>

      {cartItems.length === 0 ? (
        <div className="card">
          <p>Your cart is empty. Add something from Home page.</p>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <article className="card cart-item" key={item.id}>
                <img alt={item.title} src={item.image} />
                <div className="cart-item__content">
                  <h3>{item.title}</h3>
                  <p>{item.category}</p>
                  <strong>${Number(item.price).toFixed(2)}</strong>
                </div>
                <div className="cart-item__actions">
                  <label htmlFor={`qty-${item.id}`}>Qty</label>
                  <input
                    id={`qty-${item.id}`}
                    min="1"
                    onChange={(event) =>
                      updateCartItem(item.id, Number(event.target.value))
                    }
                    type="number"
                    value={item.quantity}
                  />
                  <button
                    className="btn btn--danger"
                    onClick={() => removeFromCart(item.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
                <strong className="cart-item__line">
                  ${Number(item.lineTotal).toFixed(2)}
                </strong>
              </article>
            ))}
          </div>

          <div className="card cart-summary">
            <h2>Total: ${Number(cartTotal).toFixed(2)}</h2>
            <div className="admin-form__actions">
              <button
                className="btn btn--primary"
                onClick={handleBuy}
                type="button"
              >
                Buy
              </button>
              <button
                className="btn btn--outline"
                onClick={clearCart}
                type="button"
              >
                Clear cart
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
