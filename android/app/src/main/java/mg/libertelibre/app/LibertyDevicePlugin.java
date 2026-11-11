package mg.libertelibre.app;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.OpenableColumns;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.util.ArrayList;
import java.util.List;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PermissionState;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(
    name = "LibertyDevice",
    permissions = {@Permission(alias = "microphone", strings = {Manifest.permission.RECORD_AUDIO})}
)
public class LibertyDevicePlugin extends Plugin {
    private boolean authenticating = false;
    private final List<WebView> printWebViews = new ArrayList<>();

    @PluginMethod
    public void requestMicrophone(PluginCall call) {
        if (getPermissionState("microphone") == PermissionState.GRANTED) {
            call.resolve();
            return;
        }
        requestPermissionForAlias("microphone", call, "microphonePermissionResult");
    }

    @PermissionCallback
    private void microphonePermissionResult(PluginCall call) {
        if (getPermissionState("microphone") == PermissionState.GRANTED) {
            call.resolve();
        } else {
            call.reject("Autorisation du microphone refusée.");
        }
    }

    @PluginMethod
    public void pickMedia(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        String kind = call.getString("kind", "");
        String mimeFilter = "audio".equals(kind) ? "audio/*" : "video".equals(kind) ? "video/*" : "*/*";
        intent.setType(mimeFilter);
        intent.putExtra(Intent.EXTRA_MIME_TYPES, "*/*".equals(mimeFilter)
            ? new String[] {"audio/*", "video/*"}
            : new String[] {mimeFilter});
        startActivityForResult(call, intent, "mediaPickerResult");
    }

    @ActivityCallback
    private void mediaPickerResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.reject("Sélection annulée.");
            return;
        }
        Uri uri = result.getData().getData();
        try {
            int flags = result.getData().getFlags() & Intent.FLAG_GRANT_READ_URI_PERMISSION;
            getContext().getContentResolver().takePersistableUriPermission(uri, flags);
        } catch (Exception ignored) {
            // Some document providers grant temporary access only; playback will report if access expires.
        }
        String name = uri.getLastPathSegment() == null ? "Média du téléphone" : uri.getLastPathSegment();
        try (Cursor cursor = getContext().getContentResolver().query(uri, null, null, null, null)) {
            if (cursor != null && cursor.moveToFirst()) {
                int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (nameIndex >= 0) name = cursor.getString(nameIndex);
            }
        } catch (Exception ignored) { }
        JSObject response = new JSObject();
        response.put("uri", uri.toString());
        response.put("name", name);
        response.put("mimeType", getContext().getContentResolver().getType(uri));
        call.resolve(response);
    }

    @PluginMethod
    public void printHtml(PluginCall call) {
        final String html = call.getString("html", "");
        final String title = call.getString("title", "Ressources Liberté");
        if (html.trim().isEmpty()) { call.reject("Aucune ressource à imprimer."); return; }
        Activity activity = getActivity();
        if (activity == null) { call.reject("Service d’impression indisponible."); return; }
        activity.runOnUiThread(() -> {
            try {
                WebView printView = new WebView(getContext());
                printWebViews.add(printView);
                printView.setWebViewClient(new WebViewClient() {
                    @Override public void onPageFinished(WebView view, String url) {
                        try {
                            PrintManager manager = (PrintManager) getContext().getSystemService(android.content.Context.PRINT_SERVICE);
                            if (manager == null) { call.reject("Service d’impression indisponible."); return; }
                            manager.print(title, printView.createPrintDocumentAdapter(title),
                                new PrintAttributes.Builder()
                                    .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                                    .setColorMode(PrintAttributes.COLOR_MODE_COLOR)
                                    .build());
                            call.resolve();
                        } catch (Exception e) { call.reject("Impossible d’ouvrir l’impression PDF.", e); }
                    }
                });
                printView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
            } catch (Exception e) { call.reject("Impossible de préparer l’impression PDF.", e); }
        });
    }

    @PluginMethod
    public void authenticate(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (authenticating) { call.reject("Authentification déjà en cours."); return; }
            int allowed = BiometricManager.Authenticators.BIOMETRIC_WEAK | BiometricManager.Authenticators.DEVICE_CREDENTIAL;
            if (BiometricManager.from(getContext()).canAuthenticate(allowed) != BiometricManager.BIOMETRIC_SUCCESS) {
                call.reject("Configure une empreinte, un visage ou un PIN de verrouillage dans les paramètres Android."); return;
            }
            authenticating = true;
            BiometricPrompt prompt = new BiometricPrompt(getActivity(), ContextCompat.getMainExecutor(getContext()), new BiometricPrompt.AuthenticationCallback() {
                @Override public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result) { authenticating = false; call.resolve(); }
                @Override public void onAuthenticationError(int code, CharSequence message) { authenticating = false; call.reject(message.toString()); }
            });
            boolean malagasy = "mg".equals(call.getString("language", "fr"));
            try {
                prompt.authenticate(new BiometricPrompt.PromptInfo.Builder()
                    .setTitle(malagasy ? "Sokafy ny Liberté" : "Déverrouiller Liberté")
                    .setSubtitle(malagasy ? "Biometrika na kaody hidin’ny telefaonina" : "Biométrie ou code de verrouillage du téléphone")
                    .setAllowedAuthenticators(allowed).build());
            } catch (Exception e) { authenticating = false; call.reject("Authentification indisponible.", e); }
        });
    }
}
