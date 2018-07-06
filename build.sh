#!/bin/sh
npm run build
php copy.php
cp -rf build/img ../zs-app/www/
cd ../zs-app
cordova prepare android ios
cp platforms/android/app/src/main/AndroidManifest.xml platforms/android/app/
cd platforms/android
#release
./gradlew assembleRelease
rm app/build/outputs/apk/release/app-release-unsigned-aligned.apk app/build/outputs/apk/release/app-release.apk
~/Library/Android/sdk/build-tools/27.0.3/zipalign -v -p 4 app/build/outputs/apk/release/app-release-unsigned.apk app/build/outputs/apk/release/app-release-unsigned-aligned.apk
echo 111111 | ~/Library/Android/sdk/build-tools/27.0.3/apksigner sign --ks ~/www/key.jks --out app/build/outputs/apk/release/app-release.apk app/build/outputs/apk/release/app-release-unsigned-aligned.apk
cp app/build/outputs/apk/release/app-release.apk ~/www/dl/
##debug
## ./gradlew assembleDebug
## cp app/build/outputs/apk/debug/app-debug.apk ~/www/dl/