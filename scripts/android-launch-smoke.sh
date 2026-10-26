#!/usr/bin/env bash
set -euo pipefail
mkdir -p smoke-results
trap 'adb logcat -d > smoke-results/logcat.txt' EXIT
adb install apks/app-release.apk
adb logcat -c
adb shell am start -W -n com.cathedtech/.MainActivity
# Allow the animated intro to finish, including its 5.5-second safety timeout.
sleep 8
adb shell pidof com.cathedtech
# The intro has played. Onboarding loops its animations forever, so uiautomator would never see an idle UI.
# Turning system animations off now makes the app treat it as reduce motion and stop those loops.
adb shell settings put global animator_duration_scale 0
adb shell settings put global transition_animation_scale 0
adb shell settings put global window_animation_scale 0
sleep 2
capture() {
  # uiautomator waits for the UI to go idle; retry so one busy frame does not fail the run.
  local attempt
  for attempt in 1 2 3 4 5; do
    adb shell rm -f /sdcard/window.xml
    adb shell uiautomator dump /sdcard/window.xml && adb shell ls /sdcard/window.xml > /dev/null 2>&1 && break
    echo "uiautomator dump attempt $attempt failed, retrying" >&2
    sleep 2
  done
  adb pull /sdcard/window.xml "smoke-results/$1.xml"
  adb exec-out screencap -p > "smoke-results/$1.png"
}
# Tap the first element with this text, using the bounds uiautomator reports, e.g. bounds="[42,1700][300,1796]".
tap_text() {
  local bounds x1 y1 x2 y2
  bounds=$(grep -o "text=\"$1\"[^>]*bounds=\"[^\"]*\"" "smoke-results/$2.xml" | head -1 | grep -o 'bounds="[^"]*"' | grep -oE '[0-9]+' | tr '\n' ' ')
  read -r x1 y1 x2 y2 <<< "$bounds"
  adb shell input tap $(( (x1 + x2) / 2 )) $(( (y1 + y2) / 2 ))
  sleep 2
}
# True when the app window has FLAG_SECURE, i.e. screenshots and recordings are blocked.
is_secure() {
  adb shell dumpsys window windows | awk '/Window #.*com\.cathedtech\/com\.cathedtech\.MainActivity/ {found=1} found && /fl=/ {print; exit}' | grep -qw SECURE
}
# Onboarding comes first after the intro.
capture onboarding
# The slider auto-advances, so any slide may be showing.
grep -qE 'Learn at your own pace|Take live courses|Gain real-life skills' smoke-results/onboarding.xml
tap_text Browse onboarding
# Assert actual rendered home content, not just a living process or launch activity.
capture home
grep -q 'Learn something' smoke-results/home.xml
grep -q 'Explore' smoke-results/home.xml
# Course lists may be screenshotted; other screens, like log in, must block capture.
if is_secure; then echo 'Home screen should allow screenshots.' >&2; exit 1; fi
tap_text 'Log in' home
capture login
grep -q 'Continue as student' smoke-results/login.xml
if ! is_secure; then echo 'Log in screen should block screenshots.' >&2; exit 1; fi
if adb logcat -d -s AndroidRuntime:E ReactNativeJS:E | grep -E 'FATAL EXCEPTION|JavascriptException|ReactNativeJS:.*Error:'; then
  echo 'App reported a runtime error during launch.' >&2
  exit 1
fi
