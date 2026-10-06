"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getProducts } from "@/lib/supabase/menu";

type Cart = Record<string, number>;

type Product = {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  ingredients_es: string | null;
  ingredients_en: string | null;
  price_cop: number;
  image_url: string | null;
  status: "available" | "soon" | "soldout" | "hidden";
  category_id: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cart: Cart;
  count: number;
  total: number;
  items: CartItem[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  summaryText: string;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("andariegos-cart");

      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading cart products:", error);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    try {
      if (Object.keys(cart).length) {
        localStorage.setItem(
          "andariegos-cart",
          JSON.stringify(cart)
        );
      } else {
        localStorage.removeItem("andariegos-cart");
      }
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cart]);

  const items = useMemo(() => {
    return products
      .filter((product) => cart[product.id])
      .map((product) => ({
        product,
        quantity: cart[product.id],
      }));
  }, [cart, products]);

  const count = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = items.reduce(
    (sum, item) =>
      sum + item.quantity * item.product.price_cop,
    0
  );

  const summaryText = items
    .map(
      ({ product, quantity }) =>
        `${quantity} x ${product.name_es}`
    )
    .join("\n");

  const add = (id: string) => {
    setCart((current) => ({
      ...current,
      [id]: (current[id] ?? 0) + 1,
    }));
  };

  const remove = (id: string) => {
    setCart((current) => {
      const next = { ...current };
      const quantity = (next[id] ?? 0) - 1;

      if (quantity <= 0) {
        delete next[id];
      } else {
        next[id] = quantity;
      }

      return next;
    });
  };

  const clear = () => {
    setCart({});
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        count,
        total,
        items,
        add,
        remove,
        clear,
        summaryText,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe usarse dentro de CartProvider"
    );
  }

  return context;
}