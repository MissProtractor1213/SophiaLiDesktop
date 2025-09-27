import { useCallback, useEffect, useState } from "react";

export default function useFullscreen(targetRef) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const request = useCallback(() => {
    const el = targetRef.current || document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (req) req.call(el);
  }, [targetRef]);

  const exit = useCallback(() => {
    const ex = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (ex) ex.call(document);
  }, []);

  const toggle = useCallback(() => {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
      exit();
    } else {
      request();
    }
  }, [exit, request]);

  useEffect(() => {
    const onChange = () => {
      const fs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
      setIsFullscreen(fs);
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  return { isFullscreen, request, exit, toggle };
}
