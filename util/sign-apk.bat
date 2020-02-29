
cd C:\Dev\1proj\mobi\quasar\mostart\dist\capacitor\android\apk\release

"C:\Dev\Android\Android Studio\jre\bin\jarsigner" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "C:\Users\prash\OneDrive\backup\prash\stasher\pragital-app-keys.keystore" "C:\Dev\1proj\mobi\quasar\mostart\dist\capacitor\android\apk\release\app-release-unsigned.apk" pragitalappkeys


"C:\Dev\Android\sdk\build-tools\27.0.3\zipalign" -v 4 app-release-unsigned.apk app-release.apk