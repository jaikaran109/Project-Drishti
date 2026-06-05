import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchApplications, type Application } from "@/lib/api";

export function useApplications(enabled: boolean) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let ignore = false;

    const loadApplications = async () => {
      try {
        setIsLoading(true);
        const nextApplications = await fetchApplications();

        if (!ignore) {
          setApplications(nextApplications);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load applications",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadApplications();

    return () => {
      ignore = true;
    };
  }, [enabled, refreshKey]);

  const refresh = () => {
    setRefreshKey((currentKey) => currentKey + 1);
  };

  return {
    applications,
    isLoading,
    refresh,
  };
}
