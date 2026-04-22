import { useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'

const emptyForm = {
  title: '',
  price: '',
  category: '',
  description: '',
  image: '',
}

export function AdminPage() {
  const { addProduct, deleteProduct, products } = useStore()
  const [formState, setFormState] = useState(emptyForm)
  const [message, setMessage] = useState('')

  const onFieldChange = (event) => {
    const { name, value } = event.target
    setFormState((previous) => ({ ...previous, [name]: value }))
  }

  const resetForm = () => {
    setFormState(emptyForm)
  }

  const submitForm = (event) => {
    event.preventDefault()

    if (!formState.title.trim() || !formState.price || !formState.category.trim()) {
      setMessage('Title, price and category are required.')
      return
    }

    addProduct(formState)
    setMessage('Product added successfully.')
    resetForm()
  }

  const onDelete = (productId) => {
    deleteProduct(productId)
    setMessage('Product deleted.')
  }

  return (
    <section className="page fade-up">
      <h1>Admin Panel</h1>
      <p className="page-subtitle">
        Add new products and delete unused items.
      </p>

      <form className="card admin-form" onSubmit={submitForm}>
        <h2>Add Product</h2>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          onChange={onFieldChange}
          placeholder="Product title"
          type="text"
          value={formState.title}
        />

        <label htmlFor="price">Price (USD)</label>
        <input
          id="price"
          min="0"
          name="price"
          onChange={onFieldChange}
          placeholder="29.99"
          step="0.01"
          type="number"
          value={formState.price}
        />

        <label htmlFor="category">Category</label>
        <input
          id="category"
          name="category"
          onChange={onFieldChange}
          placeholder="mouse, keyboard, charger..."
          type="text"
          value={formState.category}
        />

        <label htmlFor="image">Image URL (optional)</label>
        <input
          id="image"
          name="image"
          onChange={onFieldChange}
          placeholder="https://..."
          type="url"
          value={formState.image}
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          onChange={onFieldChange}
          placeholder="Short product details"
          rows="4"
          value={formState.description}
        />

        <div className="admin-form__actions">
          <button className="btn btn--primary" type="submit">
            Add product
          </button>
        </div>
        {message && <p className="form-message">{message}</p>}
      </form>

      <div className="admin-list">
        {products.map((product) => (
          <article className="card admin-item" key={product.id}>
            <img alt={product.title} src={product.image} />
            <div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p className="admin-item__meta">
                ${Number(product.price).toFixed(2)} | {product.category}
              </p>
            </div>
            <div className="admin-item__actions">
              <button
                className="btn btn--danger"
                onClick={() => onDelete(product.id)}
                type="button"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
