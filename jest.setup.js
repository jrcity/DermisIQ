// Mock environment variables for testing without hardcoded production secrets
process.env.YOU_CAM_API_KEY = "sk-mock-test-key-for-unit-testing";
process.env.YOU_CAM_SECRET_KEY = "mock-secret-key-for-testing";
process.env.YOU_CAM_BASE_URL = "https://yce-api-01.makeupar.com/s2s/v2.0";

jest.mock("react-native-image-picker", () => ({
  launchCamera: jest.fn((options, callback) =>
    callback({
      didCancel: false,
      assets: [{ uri: "mock://captured-selfie.jpg", base64: "TEST_BASE64" }],
    })
  ),
  launchImageLibrary: jest.fn((options, callback) =>
    callback({
      didCancel: false,
      assets: [{ uri: "mock://gallery-photo.jpg", base64: "TEST_BASE64" }],
    })
  ),
}));

const mockAsyncStorage = {
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve(null)),
  mergeItem: jest.fn(() => Promise.resolve(null)),
  clear: jest.fn(() => Promise.resolve(null)),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve(null)),
  multiRemove: jest.fn(() => Promise.resolve(null)),
};

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: mockAsyncStorage,
  ...mockAsyncStorage,
}));
