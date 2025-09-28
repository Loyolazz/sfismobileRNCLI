package com.sfismobile2

import android.app.Application
import com.facebook.react.PackageList
import android.util.Log
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.modules.network.OkHttpClientProvider
import java.security.SecureRandom
import java.security.cert.X509Certificate
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    setupUnsafeSsl()

    if (BuildConfig.DEBUG) {
      //OkHttpClientProvider.setOkHttpClientFactory(InsecureOkHttpClientFactory())
    }
    loadReactNative(this)
  }

  private fun setupUnsafeSsl() {
    try {
      val trustAllCerts = arrayOf<TrustManager>(
          object : X509TrustManager {
            override fun checkClientTrusted(chain: Array<X509Certificate>?, authType: String?) = Unit

            override fun checkServerTrusted(chain: Array<X509Certificate>?, authType: String?) = Unit

            override fun getAcceptedIssuers(): Array<X509Certificate> = emptyArray()
          }
      )

      val sslContext = SSLContext.getInstance("TLS")
      sslContext.init(null, trustAllCerts, SecureRandom())
      val trustManager = trustAllCerts[0] as X509TrustManager

      OkHttpClientProvider.setOkHttpClientFactory {
        OkHttpClientProvider.createClientBuilder()
            .sslSocketFactory(sslContext.socketFactory, trustManager)
            .hostnameVerifier { _, _ -> true }
            .build()
      }
    } catch (err: Exception) {
      Log.e("SFIS", "Falha ao configurar SSL customizado", err)
    }
  }
}
