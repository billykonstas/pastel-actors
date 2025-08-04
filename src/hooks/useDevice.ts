import { useState, useEffect, useCallback } from "react";

export type ScreenSize = "mobile" | "tablet" | "desktop";

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: ScreenSize;
  screenWidth: number;
}

export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenSize: "desktop",
    screenWidth: 0,
  });

  const checkDevice = useCallback(() => {
    const userAgent = navigator.userAgent;
    const width = window.innerWidth;

    const isMobileUA = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
    const isTabletUA = /iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent);

    const isMobileWidth = width < 768;
    const isTabletWidth = width >= 768 && width < 1024;

    const isMobile = isMobileUA || (isMobileWidth && !isTabletUA);
    const isTablet = isTabletUA || (isTabletWidth && !isMobileUA);
    const isDesktop = !isMobile && !isTablet;

    let screenSize: ScreenSize = "desktop";
    if (isMobile) screenSize = "mobile";
    else if (isTablet) screenSize = "tablet";

    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop,
      screenSize,
      screenWidth: width,
    });
  }, []);

  useEffect(() => {
    checkDevice();

    // Debounced resize handler to improve performance
    let timeoutId: NodeJS.Timeout | undefined;
    const handleResize = (): void => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDevice, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [checkDevice]);

  return deviceInfo;
}
