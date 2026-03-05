package com.diaspoeec.app;

import android.graphics.Bitmap;
import android.net.http.SslError;
import android.os.Bundle;
import android.util.Log;
import android.webkit.SslErrorHandler;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.getcapacitor.BridgeActivity;

import java.io.InputStream;
import java.io.IOException;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "DiaspoSPA";

    private static final String[] DYNAMIC_PREFIXES = {
        "/meditations/",
        "/cultes/",
        "/evenements/",
        "/dons/campagnes/"
    };

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getBridge().getWebView().post(() -> {
            WebView webView = getBridge().getWebView();
            WebViewClient original = webView.getWebViewClient();
            webView.setWebViewClient(new SpaFallbackClient(original));
            Log.d(TAG, "SPA fallback client installed");
        });
    }

    /**
     * Check if a URL path matches a dynamic route that needs a fallback.
     * Returns the fallback asset path, or null if not a dynamic route.
     */
    private String getFallbackAsset(String path) {
        if (path == null) return null;

        for (String prefix : DYNAMIC_PREFIXES) {
            if (!path.startsWith(prefix)) continue;

            String rest = path.substring(prefix.length());

            // Skip the list page itself (empty rest)
            if (rest.isEmpty()) continue;

            // Skip the placeholder page (_/ or _)
            if (rest.equals("_") || rest.equals("_/") || rest.equals("_/index.html") || rest.equals("_/index.txt")) continue;

            // Skip actual static assets (.js, .css, .png, .json, .woff, etc.)
            // But allow /index.html and /index.txt requests for page navigation and RSC data
            if (rest.contains(".") && !rest.endsWith("/index.html") && !rest.endsWith("/index.txt") && !rest.endsWith("index.txt")) continue;

            // Determine which fallback file to serve: index.txt for RSC data, index.html for pages
            String fallbackFile = rest.endsWith("index.txt") ? "_/index.txt" : "_/index.html";
            return "public" + prefix + fallbackFile;
        }

        return null;
    }

    private class SpaFallbackClient extends WebViewClient {
        private final WebViewClient delegate;

        SpaFallbackClient(WebViewClient delegate) {
            this.delegate = delegate;
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            String path = request.getUrl().getPath();
            String fallback = getFallbackAsset(path);

            // For dynamic routes, check if the actual file exists first.
            // If not, serve the fallback BEFORE Capacitor's handler (which may
            // return a non-null error response for missing files).
            if (fallback != null) {
                // Check if the real asset exists
                String realAsset = "public" + path;
                if (realAsset.endsWith("/")) {
                    realAsset += "index.html";
                }
                boolean realExists = false;
                try {
                    InputStream check = view.getContext().getAssets().open(realAsset);
                    check.close();
                    realExists = true;
                } catch (IOException ignored) {}

                if (!realExists) {
                    try {
                        Log.d(TAG, "Serving fallback for: " + path + " -> " + fallback);
                        InputStream is = view.getContext().getAssets().open(fallback);
                        String mimeType = fallback.endsWith(".txt") ? "text/plain" : "text/html";
                        return new WebResourceResponse(mimeType, "UTF-8", is);
                    } catch (IOException e) {
                        Log.e(TAG, "Fallback not found: " + fallback, e);
                    }
                }
            }

            // Delegate to Capacitor's original handler
            return delegate.shouldInterceptRequest(view, request);
        }

        // === Delegate all other methods to Capacitor's original client ===

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return delegate.shouldOverrideUrlLoading(view, request);
        }

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            delegate.onPageStarted(view, url, favicon);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            delegate.onPageFinished(view, url);
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            delegate.onReceivedError(view, request, error);
        }

        @Override
        public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
            delegate.onReceivedHttpError(view, request, errorResponse);
        }

        @Override
        public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
            delegate.onReceivedSslError(view, handler, error);
        }

        @Override
        public void onLoadResource(WebView view, String url) {
            delegate.onLoadResource(view, url);
        }

        @Override
        public void doUpdateVisitedHistory(WebView view, String url, boolean isReload) {
            delegate.doUpdateVisitedHistory(view, url, isReload);
        }

        @Override
        public void onScaleChanged(WebView view, float oldScale, float newScale) {
            delegate.onScaleChanged(view, oldScale, newScale);
        }
    }
}
