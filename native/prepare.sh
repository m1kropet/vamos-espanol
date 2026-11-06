#!/usr/bin/env bash
# Собирает Android-проект: копирует приложение в www, создаёт android/, ставит иконки и разрешения.
set -euo pipefail
cd "$(dirname "$0")"
rm -rf www && mkdir -p www
cp -r ../index.html ../css ../js ../icons ../manifest.webmanifest ../version.json www/
npm install --no-audit --no-fund
[ -d android ] || npx cap add android
npx cap sync android

RES=android/app/src/main/res
# Иконки приложения
rm -rf "$RES"/mipmap-anydpi-v26
for pair in mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192; do
  d=${pair%%:*}; s=${pair##*:}
  mkdir -p "$RES/mipmap-$d"
  convert ../icons/icon-512.png -resize ${s}x${s} "$RES/mipmap-$d/ic_launcher.png"
  convert ../icons/icon-512.png -resize ${s}x${s} "$RES/mipmap-$d/ic_launcher_round.png"
  rm -f "$RES/mipmap-$d/ic_launcher_foreground.png"
done
# Заставка: цвет фона приложения
for f in $(find "$RES" -name 'splash.png'); do convert -size 512x512 xc:'#f6efe4' ../icons/icon-192.png -gravity center -composite "$f"; done

# Разрешения: микрофон, интернет, сервисы речи
MAN=android/app/src/main/AndroidManifest.xml
grep -q RECORD_AUDIO "$MAN" || sed -i 's#<uses-permission android:name="android.permission.INTERNET" />#<uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="android.permission.RECORD_AUDIO" />\n    <queries>\n        <intent><action android:name="android.speech.RecognitionService" /></intent>\n        <intent><action android:name="android.intent.action.TTS_SERVICE" /></intent>\n    </queries>#' "$MAN"
# Портретная ориентация
sed -i 's#android:name=".MainActivity"#android:name=".MainActivity"\n            android:screenOrientation="portrait"#' "$MAN"
grep -n "RECORD_AUDIO\|TTS_SERVICE\|screenOrientation" "$MAN"

# Возврат в приложение после входа через Google: ссылки vamos://auth
grep -q 'android:scheme="vamos"' "$MAN" || sed -i '0,/<\/activity>/s##            <intent-filter android:autoVerify="false">\n                <action android:name="android.intent.action.VIEW" />\n                <category android:name="android.intent.category.DEFAULT" />\n                <category android:name="android.intent.category.BROWSABLE" />\n                <data android:scheme="vamos" android:host="auth" />\n            </intent-filter>\n        </activity>#' "$MAN"
grep -n 'scheme="vamos"' "$MAN"

# Версия сборки: versionName из version.json (поле apk), versionCode растёт с каждой сборкой
APK_VER=$(node -e 'console.log(require("../version.json").apk)')
CODE=${VERSION_CODE:-$(date +%s | cut -c1-9)}
GR=android/app/build.gradle
sed -i -E "s/versionCode [0-9]+/versionCode $CODE/; s/versionName \"[^\"]*\"/versionName \"$APK_VER\"/" "$GR"
grep -nE "versionCode|versionName" "$GR"

# Постоянный ключ подписи: новая версия ставится поверх старой без удаления
grep -q "VAMOS_SIGNING" "$GR" || cat >> "$GR" <<'GRADLE'

// VAMOS_SIGNING: один и тот же ключ для всех сборок
android {
    signingConfigs {
        debug {
            storeFile file("${rootDir}/../debug.keystore")
            storePassword "android"
            keyAlias "androiddebugkey"
            keyPassword "android"
        }
    }
}
GRADLE

# Совместимость с Capacitor 6 (compileSdk 34): фиксируем версию WorkManager, которую тянет плагин обновлений
grep -q "androidx.work:work-runtime" "$GR" || cat >> "$GR" <<'GRADLE'

configurations.all {
    resolutionStrategy {
        force 'androidx.work:work-runtime:2.9.1'
        force 'androidx.work:work-runtime-ktx:2.9.1'
    }
}
GRADLE
# плагин обновлений требует Android 6.0+ (minSdk 23)
sed -i -E 's/minSdkVersion = [0-9]+/minSdkVersion = 23/' android/variables.gradle
grep -n "minSdkVersion" android/variables.gradle

# Крупный системный шрифт: ограничиваем масштаб текста в приложении 130%, чтобы вёрстка не ломалась
MA=android/app/src/main/java/io/github/m1kropet/vamos/MainActivity.java
cat > "$MA" <<'JAVA'
package io.github.m1kropet.vamos;

import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onResume() {
        super.onResume();
        try {
            WebSettings s = getBridge().getWebView().getSettings();
            if (s.getTextZoom() > 130) s.setTextZoom(130);
        } catch (Exception ignored) {}
    }
}
JAVA
