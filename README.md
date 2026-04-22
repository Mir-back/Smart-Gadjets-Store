# Smart Gadgets Store (Vite + React)

Онлайн-магазин недорогих гаджетов: наушники, клавиатуры, мышки, зарядки, power bank и аксессуары.

## Что реализовано

- `Vite + React` проект с маршрутизацией через `react-router-dom`
- 6 страниц:
  - `Home` (карточки, поиск, фильтр по категории, фильтр по цене, добавить в корзину)
  - `Login / Register` (регистрация + вход)
  - `About Us` (описание магазина + контакты)
  - `Admin Panel` (добавление, редактирование, удаление товара)
  - `Cart` (отдельная корзина)
  - `Favorites` (избранные товары)
- `localStorage`:
  - пользователь/сессия
  - список пользователей
  - корзина
  - товары
  - избранное
  - тема (light/dark)
- API интеграция с `https://dummyjson.com/products/search`
- Загрузка API написана через `async / await`
- Тёмная тема
- Адаптивная вёрстка (desktop/mobile)

## Запуск

```bash
npm install
npm run dev
```

## Проверка

```bash
npm run lint
npm run build
```

## Где смотреть ключевую логику

- `src/context/StoreContext.jsx` - глобальное состояние, localStorage, API, корзина, избранное, auth, CRUD товаров
- `src/pages/HomePage.jsx` - список товаров, поиск и фильтры
- `src/pages/AdminPage.jsx` - админка (add/edit/delete)
- `src/pages/AuthPage.jsx` - регистрация/логин
- `src/pages/CartPage.jsx` - отдельная корзина
- `src/components/Navbar.jsx` - навбар + переключение темы
