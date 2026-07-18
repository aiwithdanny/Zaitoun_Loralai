import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGroupCard } from "@/components/ProductGroupCard";
import { productImages } from "@/lib/productImages";
import { useWishlistList } from "@/hooks/useWishlist";

export default function AccountWishlist() {
  const { data: wishlist, isLoading, error } = useWishlistList();

  return (
    <>
      <Helmet>
        <title>My Wishlist — Zaitoun Loralai</title>
        <meta name="description" content="View your saved items on Zaitoun Loralai." />
      </Helmet>
      <Header />
      <main className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-6 mb-2">
          <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
          <Link
            href="/account/orders"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            My Orders
          </Link>
        </div>
        <p className="text-muted-foreground text-sm mb-8">Products you've saved</p>

        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
            Failed to load wishlist
          </div>
        )}

        {!isLoading && !error && (!wishlist || wishlist.length === 0) && (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
            <Link
              href="/"
              className="inline-block bg-accent text-accent-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Browse Products
            </Link>
          </div>
        )}

        {!isLoading && wishlist && wishlist.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((group) => (
              <ProductGroupCard
                key={group[0]?.product_group_id}
                variants={group}
                productImages={productImages}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
