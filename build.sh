#!/bin/sh

iosPrepare(){
	echo "******************************************"
	echo "iosPrepare"
	echo "******************************************"
	php copy.php zs-app-ios
	cp -rf build/img ../zs-app-ios/www/
	php chcp.php $1 ../zs-app-ios
	cd ../zs-app-ios 
	cordova prepare ios
	cd -
}

iosBuild(){
	echo "******************************************"
	echo "iosBuild"
	echo "******************************************"
}

androidPrepare(){
	echo "******************************************"
	echo "androidPrepare"
	echo "******************************************"
	php copy.php zs-app
	cp -rf build/img ../zs-app/www/
	php chcp.php $1 ../zs-app
	cd ../zs-app
	cordova prepare android
	cp platforms/android/app/src/main/AndroidManifest.xml platforms/android/app/
	cd -
}

androidBuild(){
	echo "******************************************"
	echo "androidBuild"
	echo "******************************************"
	cd ../zs-app/platforms/android
	#release
	rm app/build/outputs/apk/release/app-release-unsigned.apk app/build/outputs/apk/release/app-release-unsigned-aligned.apk app/build/outputs/apk/release/app-release.apk
	./gradlew assembleRelease
	~/Library/Android/sdk/build-tools/27.0.3/zipalign -v -p 4 app/build/outputs/apk/release/app-release-unsigned.apk app/build/outputs/apk/release/app-release-unsigned-aligned.apk
	echo 111111 | ~/Library/Android/sdk/build-tools/27.0.3/apksigner sign --ks ~/www/key.jks --out app/build/outputs/apk/release/app-release.apk app/build/outputs/apk/release/app-release-unsigned-aligned.apk
	cp app/build/outputs/apk/release/app-release.apk ~/www/dl/
	##debug
	## ./gradlew assembleDebug
	## cp app/build/outputs/apk/debug/app-debug.apk ~/www/dl/
	cd -
}

ts=$(php -r 'date_default_timezone_set("Asia/Shanghai");echo date("Y.m.d-H.i.s");') 

if [ "$1" == "prepare" ]; then
	npm run build
    iosPrepare $ts
    androidPrepare $ts
elif [ "$1" == "package" ]; then
	npm run build
    iosPrepare $ts
    androidPrepare $ts
    androidBuild
else
    echo "missing parameter, usage:\n $0 prepare|package"
fi


