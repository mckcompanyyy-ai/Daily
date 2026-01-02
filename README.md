
# Günlük Plan - Android Kurulum Rehberi

Bu projeyi bir Android uygulaması (APK/AAB) haline getirmek için aşağıdaki adımları izleyin.

## 1. Ön Gereksinimler
* **Node.js:** [nodejs.org](https://nodejs.org/) adresinden LTS sürümünü kurun.
* **Android Studio:** [developer.android.com](https://developer.android.com/studio) adresinden indirip kurun.

## 2. Kurulum Adımları
Terminali (PowerShell veya CMD) açın ve proje klasöründe şu komutları çalıştırın:

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

2. **Android Platformunu Ekleyin:**
   ```bash
   npx cap add android
   ```

3. **Dosyaları Senkronize Edin:**
   ```bash
   npx cap sync android
   ```

4. **Android Studio'da Açın:**
   ```bash
   npx cap open android
   ```

## 3. Play Store İçin Dosya Oluşturma (.aab)
Android Studio açıldığında:
1. Üst menüden **Build > Generate Signed Bundle / APK** seçeneğine tıklayın.
2. **Android App Bundle** seçeneğini işaretleyin.
3. Yeni bir "Key Store" (anahtar dosyası) oluşturun (şifrenizi unutmayın!).
4. İşlem bittiğinde size verilen `.aab` dosyasını Google Play Console'a yükleyebilirsiniz.
