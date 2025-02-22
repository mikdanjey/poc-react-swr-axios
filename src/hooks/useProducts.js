import useSWR from "swr";
import { axiosInstance } from "../axiosInstance";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export function useProducts() {
    const { data, error, isLoading, mutate } = useSWR("/products", fetcher);

    return {
        data: data || [],
        isLoading,
        error,
        mutate,
    };
}
