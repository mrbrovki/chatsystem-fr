import { useEffect, useState } from "react"
import { doesUserExist } from "../utils/utils";

interface UseUsernameExists{
  isAvailable: boolean | null; 
  loading: boolean;
  error: string | null;
};

export const useUsernameExists = (username: string, exception: string): UseUsernameExists => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username === exception) {
      setIsAvailable(true);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const checkUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await doesUserExist(username!, signal);
        setIsAvailable(response.status !== 409);
        
      } catch {
        setError("cancelled");
      }finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      checkUser();
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
      controller.abort();
    };
  }, [username]);

  return { isAvailable, loading, error };
};