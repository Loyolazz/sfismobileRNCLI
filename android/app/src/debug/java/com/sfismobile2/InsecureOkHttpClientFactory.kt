package com.sfismobile2

import android.annotation.SuppressLint
import com.facebook.react.modules.network.OkHttpClientFactory
import com.facebook.react.modules.network.OkHttpClientProvider
import javax.net.ssl.HostnameVerifier
import javax.net.ssl.SSLContext
import javax.net.ssl.SSLSession
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager
import okhttp3.OkHttpClient
import java.security.SecureRandom
import java.security.cert.X509Certificate

/**
 * Factory usada apenas no build de debug para ignorar erros de certificado TLS.
 * Isso permite que o app funcione em ambientes onde o tráfego HTTPS é inspecionado
 * (como o proxy MITM do ambiente de desenvolvimento), o que causava o "Network Error"
 * nas requisições SOAP.
 */
internal class InsecureOkHttpClientFactory : OkHttpClientFactory {

  override fun createNewNetworkModuleClient(): OkHttpClient {
    val trustManagers = buildTrustManagers()
    val sslContext = SSLContext.getInstance("TLS").apply {
      init(null, trustManagers, SecureRandom())
    }

    val builder = OkHttpClientProvider.createClientBuilder()
      .sslSocketFactory(sslContext.socketFactory, trustManagers[0] as X509TrustManager)
      .hostnameVerifier(InsecureHostnameVerifier)

    return builder.build()
  }

  private fun buildTrustManagers(): Array<TrustManager> {
    @SuppressLint("CustomX509TrustManager")
    val trustAll = object : X509TrustManager {
      override fun getAcceptedIssuers(): Array<X509Certificate> = emptyArray()
      override fun checkClientTrusted(chain: Array<X509Certificate>, authType: String) {}
      override fun checkServerTrusted(chain: Array<X509Certificate>, authType: String) {}
    }
    return arrayOf(trustAll)
  }

  private object InsecureHostnameVerifier : HostnameVerifier {
    override fun verify(hostname: String?, session: SSLSession?): Boolean = true
  }
}
