package com.cathedtech

import android.app.Activity
import android.os.Build
import android.view.WindowManager
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * Controls screen capture per screen.
 * - setSecure(true) sets FLAG_SECURE, so screenshots and screen recordings come out black
 *   and the app preview is hidden in the recents list.
 * - setScreenshotWatch(true) emits "ScreenshotTaken" when the user takes a screenshot.
 *   Detection uses Activity.ScreenCaptureCallback, which only exists on Android 14 (API 34)+.
 */
class ScreenSecurityModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), LifecycleEventListener {

  private var secure = false
  private var watchScreenshots = false
  private var watchedActivity: Activity? = null
  private var captureCallback: Any? = null

  init {
    reactContext.addLifecycleEventListener(this)
  }

  override fun getName() = NAME

  override fun getConstants(): Map<String, Any> =
      mapOf("screenshotDetectionSupported" to (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE))

  @ReactMethod
  fun setSecure(value: Boolean) {
    secure = value
    reactContext.runOnUiQueueThread { applySecureFlag() }
  }

  @ReactMethod
  fun setScreenshotWatch(value: Boolean) {
    watchScreenshots = value
    reactContext.runOnUiQueueThread { if (value) startWatching() else stopWatching() }
  }

  // Required by NativeEventEmitter on the JS side.
  @ReactMethod fun addListener(eventName: String) {}
  @ReactMethod fun removeListeners(count: Double) {}

  // The activity can be recreated (rotation, process restore), so reapply state whenever it resumes.
  override fun onHostResume() {
    applySecureFlag()
    if (watchScreenshots) startWatching()
  }

  override fun onHostPause() = stopWatching()

  override fun onHostDestroy() = stopWatching()

  override fun invalidate() {
    stopWatching()
    reactContext.removeLifecycleEventListener(this)
    super.invalidate()
  }

  private fun applySecureFlag() {
    val window = reactContext.currentActivity?.window ?: return
    if (secure) window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
    else window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
  }

  private fun startWatching() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) return
    val activity = reactContext.currentActivity ?: return
    if (watchedActivity === activity) return
    stopWatching()
    Api34.register(activity, ::emitScreenshot)?.let {
      captureCallback = it
      watchedActivity = activity
    }
  }

  private fun stopWatching() {
    val activity = watchedActivity ?: return
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) Api34.unregister(activity, captureCallback)
    watchedActivity = null
    captureCallback = null
  }

  private fun emitScreenshot() {
    if (!reactContext.hasActiveReactInstance()) return
    reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(EVENT_SCREENSHOT, null)
  }

  // Kept separate so ScreenCaptureCallback is only loaded on Android 14+.
  @RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
  private object Api34 {
    fun register(activity: Activity, onCapture: () -> Unit): Any? =
        try {
          val callback = Activity.ScreenCaptureCallback { onCapture() }
          activity.registerScreenCaptureCallback(activity.mainExecutor, callback)
          callback
        } catch (e: SecurityException) {
          null // DETECT_SCREEN_CAPTURE permission missing
        }

    fun unregister(activity: Activity, callback: Any?) {
      (callback as? Activity.ScreenCaptureCallback)?.let { activity.unregisterScreenCaptureCallback(it) }
    }
  }

  companion object {
    const val NAME = "ScreenSecurity"
    const val EVENT_SCREENSHOT = "ScreenshotTaken"
  }
}
