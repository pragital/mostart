cd ..
quasar build -m capacitor -T android
cd util
sign-apk.bat
cd C:\Dev\1proj\mobi\quasar\mostart\dist\capacitor\android\apk\release
explorer .