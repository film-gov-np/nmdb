import { useQueryClient } from "@tanstack/react-query";

const useCachedData = () => {
  const queryClient = useQueryClient();
  const getFromCache = (key) => {
    const cache = queryClient.getQueryData(key);
    if (cache && cache.length > 0) {
      return { cache };
    } else {
      return {cache: null};
    }
  };
  return { getFromCache };
};

export default useCachedData;
