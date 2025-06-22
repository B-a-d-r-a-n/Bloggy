import { useEffect } from "react";

interface UsePageTitleOptions {
  title: string;
  siteName?: string;
  separator?: string;
  restoreTitle?: string;
}

export function usePageTitle({
  title,
  siteName = "Bloggy",
  separator = " | ",
  restoreTitle,
}: UsePageTitleOptions) {
  useEffect(() => {
    const originalTitle = document.title;

    const newTitle = title ? `${title}${separator}${siteName}` : siteName;
    document.title = newTitle;

    return () => {
      document.title = restoreTitle || originalTitle || siteName;
    };
  }, [title, siteName, separator, restoreTitle]);
}

export function useRouteTitle(
  routeTitle: string,
  options?: Omit<UsePageTitleOptions, "title">
) {
  return usePageTitle({ title: routeTitle, ...options });
}
