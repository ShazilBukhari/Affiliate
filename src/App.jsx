import React, { useState, useEffect } from "react";
import image from "../image/zentro.png";

// --- Firebase Imports ---
// Make sure you have firebase installed: npm install firebase
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";

// --- Firebase Configuration ---
// This config will be provided by the environment.
// In a local setup, you would replace this with your actual Firebase config object.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
 // FIX: Removed invalid "..."

// --- App ID ---
// The app ID will also be provided by the environment.
const appId = import.meta.env.VITE_APP_ID || "zentro-app";


// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- INITIAL PRODUCT DATA (SEED DATA for first-time setup) ---
const initialProducts = [
  {
    title: "Pro Ultrabook X1",
    description: "Sleek and powerful ultrabook with a 4K display.",
    price: 1299.99,
    imageUrl: "https://placehold.co/600x400/3498db/ffffff?text=Ultrabook+X1",
    affiliateLink: "https://example.com/product/ultrabook-x1",
    category: "Laptops",
  },
  {
    title: "SoundWave Pro Headphones",
    description: "Noise-cancelling over-ear headphones.",
    price: 249.99,
    imageUrl: "https://placehold.co/600x400/2ecc71/ffffff?text=Headphones",
    affiliateLink: "https://example.com/product/soundwave-pro",
    category: "Audio",
  },
  {
    title: "Galaxy Phone Z",
    description: "The latest flagship smartphone with a pro-grade camera.",
    price: 999.0,
    imageUrl: "https://placehold.co/600x400/9b59b6/ffffff?text=Galaxy+Phone",
    affiliateLink: "https://example.com/product/galaxy-phone-z",
    category: "Smartphones",
  },
  {
    title: "Ergo Mechanical Keyboard",
    description: "A comfortable mechanical keyboard for coders.",
    price: 159.5,
    imageUrl: "https://placehold.co/600x400/f1c40f/ffffff?text=Keyboard",
    affiliateLink: "https://example.com/product/ergo-keyboard",
    category: "Accessories",
  },
  {
    title: "Portable SSD 1TB",
    description: "Blazing fast external SSD with 1TB of storage.",
    price: 120.0,
    imageUrl: "https://placehold.co/600x400/e74c3c/ffffff?text=Portable+SSD",
    affiliateLink: "https://example.com/product/portable-ssd",
    category: "Storage",
  },
  {
    title: "Smartwatch Series 8",
    description: "Track your fitness, get notifications, and stay connected.",
    price: 399.0,
    imageUrl: "https://placehold.co/600x400/1abc9c/ffffff?text=Smartwatch",
    affiliateLink: "https://example.com/product/smartwatch-8",
    category: "Wearables",
  },
];

const Header = ({
  onLoginClick,
  onAddProductClick,
  onLogout,
  isAdminLoggedIn,
}) => (
  <header className="bg-white shadow-md sticky top-0 z-20">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src={image || "https://placehold.co/60x60/cccccc/ffffff?text=Logo"}
          alt="ZentroDeals Logo"
          width="60"
          className="rounded-md"
        />
        <div className="ml-4">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
            ZentroDeals
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Center of Top Deals & Savings.
          </p>
        </div>
      </div>
      <div className="flex items-center">
        {!isAdminLoggedIn ? (
          <button
            onClick={onLoginClick}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onAddProductClick}
              className="bg-green-500 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg hover:bg-green-600 text-sm sm:text-base"
            >
              Add Product
            </button>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg hover:bg-red-600 text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white mt-12">
    <div className="container mx-auto px-6 py-4 text-center">
      <p>&copy; 2025 ZentroDeals. All rights reserved.</p>
      <p className="text-sm text-gray-400 mt-1">
        Center of Top Deals & Savings.
      </p>
    </div>
  </footer>
);

const ProductCard = ({ product, isAdminLoggedIn, onDeleteClick }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 relative">
    {isAdminLoggedIn && (
      <button
        onClick={() => onDeleteClick(product.id)}
        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors z-10"
        aria-label="Delete product"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    )}
    <img
      src={product.imageUrl}
      alt={product.title}
      className="w-full h-56 object-cover"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src =
          "https://placehold.co/600x400/cccccc/ffffff?text=Image+Error";
      }}
    />
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
      <p className="text-gray-700 mb-4 flex-grow">{product.description}</p>
      <div className="mt-auto">
        <p className="text-2xl font-semibold text-blue-600 mb-4">
          ${product.price.toFixed(2)}
        </p>
        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          Buy Now
        </a>
      </div>
    </div>
  </div>
);

const LoginModal = ({ isOpen, onClose, onLogin, error }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={onLogin}>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newProduct = {
      title: formData.get("title"),
      description: formData.get("desc"),
      price: parseFloat(formData.get("price")),
      imageUrl: formData.get("image"),
      affiliateLink: formData.get("link"),
      category: formData.get("category"),
    };
    onSave(newProduct);
    e.target.reset();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Naya Product Jodein</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded-md"
            required
          />
          <textarea
            name="desc"
            placeholder="Description"
            className="w-full p-2 border rounded-md"
            required
          ></textarea>
          <input
            name="price"
            type="number"
            placeholder="Price (e.g., 299.99)"
            step="0.01"
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            name="image"
            type="url"
            placeholder="Image URL"
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            name="link"
            type="url"
            placeholder="Affiliate Link"
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            name="category"
            type="text"
            placeholder="Category"
            className="w-full p-2 border rounded-md"
            required
          />
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASS || "admin123";

  const productsCollectionPath = `/artifacts/${appId}/public/data/products`;
  const productsCollectionRef = collection(db, productsCollectionPath);

  useEffect(() => {
    const performAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== "undefined" &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    };
    performAuth();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      productsCollectionRef,
      async (querySnapshot) => {
        if (querySnapshot.empty && initialProducts.length > 0) {
          console.log("No products found. Seeding initial data...");
          const batch = writeBatch(db);
          initialProducts.forEach((product) => {
            const newDocRef = doc(productsCollectionRef);
            batch.set(newDocRef, product);
          });
          await batch.commit();
        } else {
          const productsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAllProducts(productsData);
        }
      },
      (error) => {
        console.error("Error fetching products:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const categories = ["All", ...new Set(allProducts.map((p) => p.category))];
  const filteredProducts =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  const handleLogin = (e) => {
    e.preventDefault();
    if (e.target.password.value === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setLoginError("");
      e.target.reset();
    } else {
      setLoginError("Galat password.");
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const handleSaveProduct = async (newProduct) => {
    try {
      await addDoc(productsCollectionRef, newProduct);
      setShowProductModal(false);
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteDoc(doc(db, productsCollectionPath, productToDelete));
    } catch (error) {
      console.error("Error deleting product: ", error);
    } finally {
      setShowConfirmModal(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="font-sans bg-gray-100 text-gray-800">
      <Header
        isAdminLoggedIn={isAdminLoggedIn}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onAddProductClick={() => setShowProductModal(true)}
      />
      <main className="container mx-auto px-6 py-8">
        <section id="filters" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors duration-200 ${
                  activeCategory === category
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : ""
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>
        <section id="products">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdminLoggedIn={isAdminLoggedIn}
                  onDeleteClick={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">
                Is category mein koi product nahi mila.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setLoginError("");
        }}
        onLogin={handleLogin}
        error={loginError}
      />
      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSave={handleSaveProduct}
      />
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        message="Kya aap wakai is product ko delete karna chahte hain?"
      />
    </div>
  );
}
