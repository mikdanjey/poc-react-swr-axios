import useSWR from "swr";
import { axiosInstance } from "../axiosInstance";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export function useProducts() {
    const { data, error, isLoading, mutate } = useSWR("/products", fetcher);

    // Optimized mutate function to avoid unnecessary API calls
    const updateProducts = async (updateFn) => {
        await mutate(updateFn, { revalidate: false }); // Prevent re-fetching
    };

    return {
        data: data || [],
        isLoading,
        error,
        mutate: updateProducts, // Use optimized mutate
    };
}
