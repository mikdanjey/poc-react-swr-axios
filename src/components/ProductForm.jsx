import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../axiosInstance";
import { useProducts } from "../hooks/useProducts";

export default function ProductForm({ product, onSuccess }) {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: { name: "", price: "", category: "" },
    });

    const { data: products, mutate } = useProducts();

    // Reset form when editing an existing product
    useEffect(() => {
        reset(product || { name: "", price: "", category: "" });
    }, [product, reset]);

    const onSubmit = async (formData) => {
        const isNew = !product;
        const newProduct = { ...formData };

        await mutate(
            async () => {
                try {
                    if (isNew) {
                        // Create new record
                        const { data } = await axiosInstance.post("/products", newProduct);
                        reset({ name: "", price: "", category: "" });
                        // Take Action after Success
                        return [...products, data]; // Append new product to cache
                    } else {
                        // Update existing record
                        await axiosInstance.put(`/products/${product.id}`, newProduct);
                        reset({ name: "", price: "", category: "" });
                        // Take Action after Success
                        return products.map((item) => (item.id === product.id ? newProduct : item)); // Update cache manually
                    }
                } catch (error) {
                    // Take Action after error
                    return products;
                }
            },
            {
                optimisticData: isNew
                    ? [...products, newProduct] // Optimistically add new product
                    : products.map((item) => (item.id === product.id ? newProduct : item)), // Optimistically update product
                rollbackOnError: true, // Rollback if request fails
                populateCache: true, // Store the updated data in SWR cache
                revalidate: false, // Don't re-fetch from API
            }
        );
        onSuccess(); // Close form after success
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <h2 className="text-xl font-bold">{product ? "Edit Product" : "Add Product"}</h2>
            <input {...register("name", { required: "This is required." })} placeholder="Product Name" className="w-full p-2 border rounded my-2" />
            <input type="number" {...register("price", { required: "This is required." })} placeholder="Price" className="w-full p-2 border rounded my-2" />
            <input {...register("category", { required: "This is required." })} placeholder="Category" className="w-full p-2 border rounded my-2" />
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                {product ? "Update" : "Create"}
            </button>
        </form>
    );
}
