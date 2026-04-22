/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { seedProducts } from '../data/seedProducts.js'

const STORAGE_KEYS = {
  products: 'sgs_products',
  productsVersion: 'sgs_products_version',
  cart: 'sgs_cart',
  favorites: 'sgs_favorites',
  users: 'sgs_users',
  currentUser: 'sgs_current_user',
  theme: 'sgs_theme',
}

const StoreContext = createContext(null)
const PRODUCTS_SOURCE_VERSION = 'dummyjson-gadgets-v1'
const GADGET_SEARCH_TERMS = [
  'headphones',
  'earbuds',
  'keyboard',
  'mouse',
  'charger',
  'power bank',
  'usb cable',
]
const GADGET_KEYWORDS = [
  'headphone',
  'earbud',
  'keyboard',
  'mouse',
  'charger',
  'power bank',
  'powerbank',
  'cable',
  'adapter',
  'usb',
  'bluetooth',
]
const EXCLUDED_KEYWORDS = [
  'monitor',
  'ssd',
  'ring',
  'dress',
  'shirt',
  'jacket',
  'shoe',
  'lipstick',
  'fragrance',
  'sofa',
  'furniture',
]

const readStorage = (key, fallback) => {
  try {
    const savedValue = localStorage.getItem(key)
    return savedValue ? JSON.parse(savedValue) : fallback
  } catch {
    return fallback
  }
}

const mapCategory = (text) => {
  const value = text.toLowerCase()

  if (value.includes('headphone') || value.includes('earbud')) {
    return 'audio'
  }
  if (value.includes('keyboard')) {
    return 'keyboard'
  }
  if (value.includes('mouse')) {
    return 'mouse'
  }
  if (
    value.includes('charger') ||
    value.includes('adapter') ||
    value.includes('usb')
  ) {
    return 'charger'
  }
  if (value.includes('power bank') || value.includes('powerbank')) {
    return 'powerbank'
  }

  return 'accessories'
}

const isRelevantGadget = (product) => {
  const mergedText = `${product.title ?? ''} ${product.description ?? ''} ${product.category ?? ''}`.toLowerCase()

  const hasExcludedKeyword = EXCLUDED_KEYWORDS.some((keyword) =>
    mergedText.includes(keyword),
  )
  if (hasExcludedKeyword) {
    return false
  }

  return GADGET_KEYWORDS.some((keyword) => mergedText.includes(keyword))
}

const normalizeApiProduct = (product) => {
  const combinedText = `${product.title ?? ''} ${product.category ?? ''}`

  return {
    id: Number(product.id),
    title: product.title ?? 'Unnamed gadget',
    price: Number(product.price ?? 0),
    category: mapCategory(combinedText),
    description: product.description ?? 'No description',
    image:
      product.thumbnail ??
      product.images?.[0] ??
      'https://picsum.photos/seed/gadget/480/360',
    rating: {
      rate: Number(product.rating ?? 0),
      count: Number(product.stock ?? 0),
    },
  }
}

const fetchGadgetProducts = async () => {
  const requestUrls = GADGET_SEARCH_TERMS.map(
    (term) =>
      `https://dummyjson.com/products/search?q=${encodeURIComponent(term)}&limit=20`,
  )

  const responses = await Promise.all(requestUrls.map((url) => fetch(url)))
  const hasError = responses.some((response) => !response.ok)
  if (hasError) {
    throw new Error('Failed to fetch gadget products')
  }

  const payloads = await Promise.all(
    responses.map((response) => response.json()),
  )

  const uniqueProducts = new Map()
  payloads.forEach((payload) => {
    ;(payload.products ?? []).forEach((product) => {
      if (!uniqueProducts.has(product.id)) {
        uniqueProducts.set(product.id, product)
      }
    })
  })

  return [...uniqueProducts.values()]
    .filter(isRelevantGadget)
    .map(normalizeApiProduct)
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() =>
    readStorage(STORAGE_KEYS.products, []),
  )
  const [productsVersion, setProductsVersion] = useState(() =>
    readStorage(STORAGE_KEYS.productsVersion, ''),
  )
  const [cart, setCart] = useState(() => readStorage(STORAGE_KEYS.cart, []))
  const [favorites, setFavorites] = useState(() =>
    readStorage(STORAGE_KEYS.favorites, []),
  )
  const [users, setUsers] = useState(() => readStorage(STORAGE_KEYS.users, []))
  const [currentUser, setCurrentUser] = useState(() =>
    readStorage(STORAGE_KEYS.currentUser, null),
  )
  const [theme, setTheme] = useState(() =>
    readStorage(STORAGE_KEYS.theme, 'light'),
  )
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [productsError, setProductsError] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.productsVersion,
      JSON.stringify(productsVersion),
    )
  }, [productsVersion])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser))
  }, [currentUser])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme))
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const bootstrapProducts = async () => {
      const storedProducts = readStorage(STORAGE_KEYS.products, [])
      const hasCurrentApiProducts =
        storedProducts.length > 0 &&
        productsVersion === PRODUCTS_SOURCE_VERSION

      if (hasCurrentApiProducts) {
        return
      }

      setIsLoadingProducts(true)
      setProductsError('')

      try {
        const normalizedProducts = await fetchGadgetProducts()
        const nextProducts =
          normalizedProducts.length > 0 ? normalizedProducts : seedProducts
        const validIds = new Set(nextProducts.map((product) => product.id))

        setProducts(nextProducts)
        setProductsVersion(PRODUCTS_SOURCE_VERSION)
        setCart((previousCart) =>
          previousCart.filter((item) => validIds.has(item.productId)),
        )
        setFavorites((previousFavorites) =>
          previousFavorites.filter((id) => validIds.has(id)),
        )
      } catch {
        const validIds = new Set(seedProducts.map((product) => product.id))

        setProducts(seedProducts)
        setProductsVersion(PRODUCTS_SOURCE_VERSION)
        setCart((previousCart) =>
          previousCart.filter((item) => validIds.has(item.productId)),
        )
        setFavorites((previousFavorites) =>
          previousFavorites.filter((id) => validIds.has(id)),
        )
        setProductsError(
          'Could not load gadgets from API. Local fallback products are shown.',
        )
      } finally {
        setIsLoadingProducts(false)
      }
    }

    void bootstrapProducts()
  }, [productsVersion])

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart],
  )

  const cartItems = useMemo(() => {
    return cart
      .map((cartItem) => {
        const product = products.find((item) => item.id === cartItem.productId)
        if (!product) {
          return null
        }

        return {
          ...product,
          quantity: cartItem.quantity,
          lineTotal: cartItem.quantity * product.price,
        }
      })
      .filter(Boolean)
  }, [cart, products])

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.lineTotal, 0),
    [cartItems],
  )

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  )

  const favoriteProducts = useMemo(
    () => products.filter((product) => favorites.includes(product.id)),
    [favorites, products],
  )

  const addToCart = (productId) => {
    setCart((previousCart) => {
      const existing = previousCart.find((item) => item.productId === productId)
      if (existing) {
        return previousCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...previousCart, { productId, quantity: 1 }]
    })
  }

  const updateCartItem = (productId, quantity) => {
    const normalizedQuantity = Math.max(0, Number(quantity))
    if (normalizedQuantity <= 0) {
      setCart((previousCart) =>
        previousCart.filter((item) => item.productId !== productId),
      )
      return
    }

    setCart((previousCart) =>
      previousCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: normalizedQuantity }
          : item,
      ),
    )
  }

  const removeFromCart = (productId) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.productId !== productId),
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const toggleFavorite = (productId) => {
    setFavorites((previousFavorites) => {
      const isAlreadyFavorite = previousFavorites.includes(productId)
      if (isAlreadyFavorite) {
        return previousFavorites.filter((id) => id !== productId)
      }
      return [...previousFavorites, productId]
    })
  }

  const registerUser = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedPassword = password.trim()

    if (!normalizedEmail || !normalizedPassword) {
      return { ok: false, message: 'Please enter both email and password.' }
    }

    const existingUser = users.find((user) => user.email === normalizedEmail)
    if (existingUser) {
      return { ok: false, message: 'A user with this email already exists.' }
    }

    const newUser = {
      id: Date.now(),
      email: normalizedEmail,
      password: normalizedPassword,
    }

    setUsers((previousUsers) => [...previousUsers, newUser])
    setCurrentUser({ id: newUser.id, email: newUser.email })

    return { ok: true, message: 'Registration successful. You are now logged in.' }
  }

  const loginUser = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedPassword = password.trim()

    const foundUser = users.find(
      (user) =>
        user.email === normalizedEmail && user.password === normalizedPassword,
    )

    if (!foundUser) {
      return { ok: false, message: 'Invalid email or password.' }
    }

    setCurrentUser({ id: foundUser.id, email: foundUser.email })
    return { ok: true, message: 'Login successful.' }
  }

  const logoutUser = () => {
    setCurrentUser(null)
  }

  const addProduct = (productData) => {
    const nextId =
      products.length > 0
        ? Math.max(...products.map((product) => Number(product.id) || 0)) + 1
        : 1

    const newProduct = {
      id: nextId,
      title: productData.title.trim(),
      price: Number(productData.price),
      category: productData.category.trim().toLowerCase(),
      description: productData.description.trim(),
      image:
        productData.image.trim() || 'https://picsum.photos/seed/newgadget/480/360',
      rating: { rate: 0, count: 0 },
    }

    setProducts((previousProducts) => [newProduct, ...previousProducts])
  }

  const updateProduct = (updatedProduct) => {
    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === updatedProduct.id
          ? {
              ...product,
              ...updatedProduct,
              price: Number(updatedProduct.price),
            }
          : product,
      ),
    )
  }

  const deleteProduct = (productId) => {
    setProducts((previousProducts) =>
      previousProducts.filter((product) => product.id !== productId),
    )
    setCart((previousCart) =>
      previousCart.filter((item) => item.productId !== productId),
    )
    setFavorites((previousFavorites) =>
      previousFavorites.filter((id) => id !== productId),
    )
  }

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  const storeValue = {
    products,
    categories,
    cart,
    cartCount,
    cartItems,
    cartTotal,
    favorites,
    favoriteProducts,
    currentUser,
    theme,
    isLoadingProducts,
    productsError,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    toggleFavorite,
    registerUser,
    loginUser,
    logoutUser,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleTheme,
  }

  return <StoreContext.Provider value={storeValue}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used inside StoreProvider')
  }
  return context
}
