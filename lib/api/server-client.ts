// lib/api/server-client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshTokenPair } from "@/lib/auth/refresh-token";
import { authOptions } from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function createServerApiClient() {
  // Получаем сессию асинхронно
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id || !session?.accessToken || !session?.refreshToken) {
    redirect("/login");
  }

  let accessToken = session.accessToken;
  let refreshToken = session.refreshToken;

  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Переменная для блокировки повторных обновлений
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }> = [];

  const processQueue = (error: unknown | null, token?: string) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else if (token) {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  // Request interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const currentToken = config.headers?.Authorization?.toString().split(" ")[1];
      if (currentToken !== accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ 
            resolve: (token) => {
              originalRequest.headers!.Authorization = `Bearer ${token}`;
              resolve(client(originalRequest));
            }, 
            reject 
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newTokens = await refreshTokenPair(refreshToken);
        
        accessToken = newTokens.accessToken;
        refreshToken = newTokens.refreshToken;
        
        originalRequest.headers!.Authorization = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // При ошибке обновления редиректим на логин
        redirect("/login");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return client;
}