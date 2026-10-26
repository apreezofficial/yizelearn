#!/usr/bin/env bash
set -euo pipefail
mkdir -p smoke-results
trap 'adb logcat -d > smoke-results/logcat.txt' EXIT
adb install apks/app-x86_64-release.apk
adb logcat -c
adb shell am start -W -n com.cathedtech/.MainActivity
# Allow the animated intro to finish, including its 5.5-second safety timeout.
sleep 8
adb shell pidof com.cathedtech
adb shell uiautomator dump /sdcard/window.xml
adb pull /sdcard/window.xml smoke-results/home.xml
adb exec-out screencap -p > smoke-results/home.png
# Assert actual rendered home content, not just a living process or launch activity.
grep -q 'Learn something' smoke-results/home.xml
grep -q 'Explore' smoke-results/home.xml
if adb logcat -d -s AndroidRuntime:E ReactNativeJS:E | grep -E 'FATAL EXCEPTION|JavascriptException|ReactNativeJS:.*Error:'; then
  echo 'App reported a runtime error during launch.' >&2
  exit 1
fi
