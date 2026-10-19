import { useLayoutEffect } from "react";

/*
 * Each design page was its own document with <body data-page="...">; page CSS is
 * scoped to that attribute. Layout effect so the page never paints unscoped.
 */
export default function useBodyPage(name) {
  useLayoutEffect(() => {
    document.body.dataset.page = name;
    return () => {
      if (document.body.dataset.page === name) delete document.body.dataset.page;
    };
  }, [name]);
}
