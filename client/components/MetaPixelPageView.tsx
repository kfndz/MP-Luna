import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type MetaPixelWindow = Window & {
  fbq?: (...args: unknown[]) => void;
};

/**
 * O snippet oficial no index.html registra o primeiro PageView.
 * Como o site usa React Router (SPA), as navegações seguintes não recarregam
 * a página. Este componente registra PageView apenas nas trocas de rota.
 */
export default function MetaPixelPageView() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const metaWindow = window as MetaPixelWindow;
    metaWindow.fbq?.("track", "PageView");
  }, [location.pathname, location.search]);

  return null;
}
