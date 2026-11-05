#!/usr/bin/env bash
# Собирает Android-проект: копирует приложение в www, создаёт android/, ставит иконки и разрешения.
set -euo pipefail
cd "$(dirname "$0")"
rm -rf www && mkdir -p www
cp -r ../index.html ../css ../js ../icons ../manifest.webmanifest www/
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
