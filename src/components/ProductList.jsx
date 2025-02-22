import { useProducts } from "../hooks/useProducts";
import { axiosInstance } from "../axiosInstance";

export default function ProductList({ onEdit }) {
    const { data: products, isLoading, error, mutate } = useProducts();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading products</p>;

    const deleteProduct = async (id) => {
        await mutate(
            async () => {
                await axiosInstance.delete(`/products/${id}`);
                return products.filter((item) => item.id !== id); // delete product
            },
            {
                optimisticData: products.filter((item) => item.id !== id), // Optimistically delete product
                rollbackOnError: true, // Rollback if request fails
                populateCache: true, // Store the updated data in SWR cache
                revalidate: false, // Don't re-fetch from API
            }
        );
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Product List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="p-4 border rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p>Price: ${product.price}</p>
                        <p>Category: {product.category}</p>
                        <div className="flex gap-2 mt-2">
                            <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => onEdit(product)}>
                                Edit
                            </button>
                            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => deleteProduct(product.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
