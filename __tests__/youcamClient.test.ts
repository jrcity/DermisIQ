import { YouCamClient } from '../src/api/youcam/client';

describe('YouCamClient', () => {
  it('initializes with live Perfect Corp AI endpoint mode', () => {
    const client = new YouCamClient();
    const config = client.getConfig();
    expect(config.useMockFallback).toBe(false);
    expect(config.baseUrl).toBe('https://yce-api-01.makeupar.com/s2s/v2.0');
    expect(config.apiKey).toBeDefined();
  });

  it('runs skin analysis simulation and returns complete clinical profile with BHI', async () => {
    const client = new YouCamClient();
    // Enable fallback in test runner so offline CI doesn't require live network
    client.updateConfig({ useMockFallback: true });
    const result = await client.analyzeSkin('mock://camera_frame', 'melaninSensitive');

    expect(result.scanId).toBeDefined();
    expect(result.barrierHealthScore).toBeGreaterThanOrEqual(0);
    expect(result.barrierHealthScore).toBeLessThanOrEqual(100);
    expect(result.fitzpatrickType).toBe('Type IV');
    expect(result.undertone).toBe('Warm Golden');

    // Verify key parameters
    expect(result.parameters.redness).toBeDefined();
    expect(result.parameters.moisture).toBeDefined();
    expect(result.parameters.spots).toBeDefined();
    expect(result.parameters.texture).toBeDefined();

    // Verify zones
    expect(result.zones.length).toBeGreaterThan(0);
    expect(result.clinicalObservations.length).toBeGreaterThan(0);
  });

  it('allows updating API credentials dynamically', () => {
    const client = new YouCamClient();
    client.updateConfig({
      apiKey: 'test-youcam-api-key',
      apiSecret: 'test-secret',
      useMockFallback: false,
    });

    const config = client.getConfig();
    expect(config.apiKey).toBe('test-youcam-api-key');
    expect(config.apiSecret).toBe('test-secret');
    expect(config.useMockFallback).toBe(false);
   });
  it("translates YouCam error codes into user-friendly diagnostic notices", () => {
    const client = new YouCamClient();

    const minSize = client.translateYouCamError("error_below_min_image_size: The input image is smaller than 480x480px");
    expect(minSize.title).toBe("Photo Resolution Too Low");
    expect(minSize.type).toBe("error");
    expect(minSize.message).toContain("480×480px");

    const faceTooSmall = client.translateYouCamError("error_src_face_too_small: The face area is too small");
    expect(faceTooSmall.title).toBe("Face Too Far from Camera");
    expect(faceTooSmall.type).toBe("warning");
    expect(faceTooSmall.message).toContain("60%");

    const maxSize = client.translateYouCamError("error_exceed_max_image_size");
    expect(maxSize.title).toBe("Photo Exceeds Max Size");
    expect(maxSize.type).toBe("warning");

    const noFace = client.translateYouCamError("error_face_not_found");
    expect(noFace.title).toBe("No Face Detected");
    expect(noFace.type).toBe("warning");

    const quota = client.translateYouCamError("error_quota_exceeded: token limit");
    expect(quota.title).toBe("Token Limit Notice");
    expect(quota.type).toBe("warning");
  });

  it("notifies listeners via setErrorNotifier when errors or notices occur", () => {
    const client = new YouCamClient();
    const mockNotifier = jest.fn();
    client.setErrorNotifier(mockNotifier);

    client.notifyUser("Test Error Message", "error", "Custom Title");
    expect(mockNotifier).toHaveBeenCalledWith("Test Error Message", "error", "Custom Title");
  });

  it("conserves tokens by caching verified scans and returning cached results", async () => {
    const client = new YouCamClient();
    client.updateConfig({ useMockFallback: true });

    // First scan runs telemetry
    const result1 = await client.analyzeSkin("test-unique-image-payload-12345", "melaninSensitive");
    expect(result1.scanId).toBeDefined();

    // Cache the result directly for testing
    // @ts-ignore
    client["scanCache"].set("melaninSensitive:test-unique-image-payload-12345", result1);

    const mockNotifier = jest.fn();
    client.setErrorNotifier(mockNotifier);

    // Second scan with same payload hits cache (0 tokens consumed)
    const result2 = await client.analyzeSkin("test-unique-image-payload-12345", "melaninSensitive");
    expect(result2).toBe(result1);
    expect(mockNotifier).toHaveBeenCalledWith(
      expect.stringContaining("0 API tokens consumed"),
      "info",
      "Scan Restored"
    );
  });
});