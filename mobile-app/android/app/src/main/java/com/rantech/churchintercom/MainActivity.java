package com.rantech.churchintercom;

import android.net.http.SslError;
import android.os.Bundle;
import android.webkit.SslErrorHandler;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();
        
        // Retrieve the WebView after Bridge initializes
        WebView webView = this.bridge.getWebView();
        
        // Override the WebViewClient to ignore SSL errors for our self-signed certs
        webView.setWebViewClient(new BridgeWebViewClient(this.bridge) {
            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                // ALWAYS proceed, effectively ignoring self-signed certificate warnings
                handler.proceed();
            }
        });
    }
}
