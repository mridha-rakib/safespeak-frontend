export const REPORT_METADATA_KEY = "safespeak_report_metadata";

export type CapturedReportMetadata = {
  capturedAt: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracyMeters: number;
    altitudeMeters?: number | null;
    altitudeAccuracyMeters?: number | null;
    headingDegrees?: number | null;
    speedMetersPerSecond?: number | null;
  };
  locationUnavailableReason?: string;
  device: {
    userAgent: string;
    platform: string;
    language: string;
    languages: string[];
    timezone: string;
    viewport: {
      width: number;
      height: number;
      devicePixelRatio: number;
    };
    screen: {
      width: number;
      height: number;
      colorDepth: number;
      pixelDepth: number;
    };
    hardwareConcurrency?: number;
    deviceMemoryGb?: number;
    maxTouchPoints: number;
    online: boolean;
    connection?: {
      effectiveType?: string;
      downlinkMbps?: number;
      rttMs?: number;
      saveData?: boolean;
    };
  };
};

type NavigatorWithDeviceSignals = Navigator & {
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
};

function captureDeviceMetadata(): CapturedReportMetadata["device"] {
  const nav = navigator as NavigatorWithDeviceSignals;

  return {
    userAgent: nav.userAgent,
    platform: nav.platform,
    language: nav.language,
    languages: Array.from(nav.languages ?? []),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth,
    },
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemoryGb: nav.deviceMemory,
    maxTouchPoints: nav.maxTouchPoints,
    online: nav.onLine,
    connection: nav.connection
      ? {
          effectiveType: nav.connection.effectiveType,
          downlinkMbps: nav.connection.downlink,
          rttMs: nav.connection.rtt,
          saveData: nav.connection.saveData,
        }
      : undefined,
  };
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 10000,
    });
  });
}

export async function captureReportMetadata(): Promise<CapturedReportMetadata> {
  const metadata: CapturedReportMetadata = {
    capturedAt: new Date().toISOString(),
    device: captureDeviceMetadata(),
  };

  try {
    const position = await getCurrentPosition();
    metadata.location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracyMeters: position.coords.accuracy,
      altitudeMeters: position.coords.altitude,
      altitudeAccuracyMeters: position.coords.altitudeAccuracy,
      headingDegrees: position.coords.heading,
      speedMetersPerSecond: position.coords.speed,
    };
  } catch (error) {
    metadata.locationUnavailableReason =
      error instanceof Error ? error.message : "Location unavailable";
  }

  return metadata;
}

export function saveReportMetadata(metadata: CapturedReportMetadata): void {
  window.sessionStorage.setItem(REPORT_METADATA_KEY, JSON.stringify(metadata));
}

export function clearReportMetadata(): void {
  window.sessionStorage.removeItem(REPORT_METADATA_KEY);
}
