declare const Image: any;
declare const document: any;
declare const FileReader: any;
import { Platform, PermissionsAndroid, Alert } from "react-native";
import {
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
  CameraOptions,
} from "react-native-image-picker";

export interface PickedImageResult {
  uri: string;
  base64?: string;
  width?: number;
  height?: number;
  fileName?: string;
}

/**
 * Opens the native gallery or web file input to pick a picture of the face.
 */
export async function pickPhotoFromGallery(): Promise<PickedImageResult | null> {
  if (Platform.OS === "web" && typeof document !== "undefined") {
    return new Promise((resolve) => {
      try {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e: any) => {
          const file = e.target?.files?.[0];
          if (!file) {
            resolve(null);
            return;
          }
          const reader = new FileReader();
          reader.onload = (event: any) => {
            const dataUrl = event.target?.result as string;
            try {
              const img = new Image();
              img.onload = () => {
                let width = img.width;
                let height = img.height;
                const maxDim = 2048;
                const minDim = 720;
                let needsResize = false;

                // Downscale if too large (> 2048px)
                if (width > maxDim || height > maxDim) {
                  needsResize = true;
                  if (width > height) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                  } else {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                  }
                }
                // Upscale if too small (< 720px) to prevent error_below_min_image_size
                else if (width < minDim || height < minDim) {
                  needsResize = true;
                  const scale = minDim / Math.min(width, height);
                  width = Math.round(width * scale);
                  height = Math.round(height * scale);
                }

                if (needsResize) {
                  const canvas = document.createElement("canvas");
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext("2d");
                  ctx?.drawImage(img, 0, 0, width, height);
                  const resized = canvas.toDataURL("image/jpeg", 0.9);
                  resolve({
                    uri: resized,
                    base64: resized,
                    width,
                    height,
                    fileName: file.name,
                  });
                  return;
                }
                resolve({
                  uri: dataUrl,
                  base64: dataUrl,
                  width,
                  height,
                  fileName: file.name,
                });
              };
              img.onerror = () => {
                resolve({ uri: dataUrl, base64: dataUrl, fileName: file.name });
              };
              img.src = dataUrl;
            } catch {
              resolve({ uri: dataUrl, base64: dataUrl, fileName: file.name });
            }
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        };
        input.click();
      } catch {
        resolve(null);
      }
    });
  }

  // Native Android permissions check for older devices (SDK <= 32)
  if (Platform.OS === "android" && Platform.Version < 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "DermisIQ requires photo library access to select your face diagnostic photo.",
          buttonNeutral: "Ask Later",
          buttonNegative: "Cancel",
          buttonPositive: "Allow",
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          "Permission Denied",
          "Storage permission is required to select photos from your gallery."
        );
        return null;
      }
    } catch (err) {
      console.warn("Storage permission error:", err);
    }
  }

  // Native Android & iOS
  return new Promise((resolve) => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      maxWidth: 2048,
      maxHeight: 2048,
      quality: 0.8,
      includeBase64: true,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        resolve(null);
        return;
      }
      if (response.errorCode) {
        console.warn("launchImageLibrary error:", response.errorCode, response.errorMessage);
        Alert.alert("Gallery Error", response.errorMessage || "Unable to open image gallery.");
        resolve(null);
        return;
      }
      if (!response.assets?.[0]) {
        resolve(null);
        return;
      }
      const asset = response.assets[0];

      // Validate minimum resolution (YouCam requires >= 480x480px)
      if (asset.width && asset.height && (asset.width < 480 || asset.height < 480)) {
        Alert.alert(
          "Image Size Too Small",
          `The selected photo (${asset.width}×${asset.height}px) is below the minimum 480×480px required for accurate facial diagnostics. Please select a clear, full-resolution front selfie.`
        );
        resolve(null);
        return;
      }
      const uri = asset.uri || "";
      const base64 = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : uri;
      resolve({
        uri,
        base64,
        width: asset.width,
        height: asset.height,
        fileName: asset.fileName,
      });
    });
  });
}

/**
 * Opens the native device camera or web camera input to capture a live face photo.
 * Ensures runtime camera permission is explicitly requested and granted on Android.
 */
export async function capturePhotoFromCamera(): Promise<PickedImageResult | null> {
  if (Platform.OS === "web" && typeof document !== "undefined") {
    return new Promise((resolve) => {
      try {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.capture = "user"; // Requests front selfie camera
        input.onchange = (e: any) => {
          const file = e.target?.files?.[0];
          if (!file) {
            resolve(null);
            return;
          }
          const reader = new FileReader();
          reader.onload = (event: any) => {
            const dataUrl = event.target?.result as string;
            try {
              const img = new Image();
              img.onload = () => {
                let width = img.width;
                let height = img.height;
                const maxDim = 2048;
                const minDim = 720;
                let needsResize = false;

                // Downscale if too large (> 2048px)
                if (width > maxDim || height > maxDim) {
                  needsResize = true;
                  if (width > height) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                  } else {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                  }
                }
                // Upscale if too small (< 720px) to prevent error_below_min_image_size
                else if (width < minDim || height < minDim) {
                  needsResize = true;
                  const scale = minDim / Math.min(width, height);
                  width = Math.round(width * scale);
                  height = Math.round(height * scale);
                }

                if (needsResize) {
                  const canvas = document.createElement("canvas");
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext("2d");
                  ctx?.drawImage(img, 0, 0, width, height);
                  const resized = canvas.toDataURL("image/jpeg", 0.9);
                  resolve({
                    uri: resized,
                    base64: resized,
                    width,
                    height,
                    fileName: file.name,
                  });
                  return;
                }
                resolve({
                  uri: dataUrl,
                  base64: dataUrl,
                  width,
                  height,
                  fileName: file.name,
                });
              };
              img.onerror = () => {
                resolve({ uri: dataUrl, base64: dataUrl, fileName: file.name });
              };
              img.src = dataUrl;
            } catch {
              resolve({ uri: dataUrl, base64: dataUrl, fileName: file.name });
            }
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        };
        input.click();
      } catch {
        resolve(null);
      }
    });
  }

  // Explicit Android Runtime Camera Permission
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "DermisIQ requires camera access to capture your facial skin diagnostic photo.",
          buttonNeutral: "Ask Later",
          buttonNegative: "Cancel",
          buttonPositive: "Allow",
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          "Camera Permission Required",
          "Please grant camera permissions to capture your live diagnostic photo."
        );
        return null;
      }
    } catch (err) {
      console.warn("Camera permission request error:", err);
      return null;
    }
  }

  // Native Android & iOS launchCamera
  return new Promise((resolve) => {
    const options: CameraOptions = {
      mediaType: "photo",
      cameraType: "front",
      maxWidth: 2048,
      maxHeight: 2048,
      quality: 0.8,
      includeBase64: true,
      saveToPhotos: false,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        resolve(null);
        return;
      }
      if (response.errorCode) {
        console.warn("launchCamera error:", response.errorCode, response.errorMessage);

        // If front camera failed, retry with back camera
        if (options.cameraType === "front") {
          launchCamera({ ...options, cameraType: "back", maxWidth: 2048, maxHeight: 2048 }, (fallbackRes) => {
            if (fallbackRes.didCancel || fallbackRes.errorCode || !fallbackRes.assets?.[0]) {
              Alert.alert("Camera Notice", fallbackRes.errorMessage || "Unable to open camera on this device.");
              resolve(null);
              return;
            }
            const asset = fallbackRes.assets[0];
            if (asset.width && asset.height && (asset.width < 480 || asset.height < 480)) {
              Alert.alert(
                "Image Size Too Small",
                `The captured photo (${asset.width}×${asset.height}px) is below the minimum 480×480px required for accurate facial diagnostics. Please capture a clear, full-resolution front selfie.`
              );
              resolve(null);
              return;
            }
            const uri = asset.uri || "";
            const base64 = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : uri;
            resolve({
              uri,
              base64,
              width: asset.width,
              height: asset.height,
              fileName: asset.fileName,
            });
          });
          return;
        }

        Alert.alert("Camera Notice", response.errorMessage || "Unable to start camera.");
        resolve(null);
        return;
      }

      if (!response.assets?.[0]) {
        resolve(null);
        return;
      }

      const asset = response.assets[0];
      if (asset.width && asset.height && (asset.width < 480 || asset.height < 480)) {
        Alert.alert(
          "Image Size Too Small",
          `The captured photo (${asset.width}×${asset.height}px) is below the minimum 480×480px required for accurate facial diagnostics. Please capture a clear, full-resolution front selfie.`
        );
        resolve(null);
        return;
      }
      const uri = asset.uri || "";
      const base64 = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : uri;
      resolve({
        uri,
        base64,
        width: asset.width,
        height: asset.height,
        fileName: asset.fileName,
      });
    });
  });
}
