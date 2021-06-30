if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL env var not defined!");
}

export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
