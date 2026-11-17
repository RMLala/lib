package mg.libertelibre.app;

import android.app.Activity;
import android.content.Intent;
import android.content.ClipData;
import android.content.ContentValues;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.OutputStream;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import androidx.core.content.FileProvider;

@CapacitorPlugin(name = "DataExport")
public class DataExportPlugin extends Plugin {
    private boolean saving = false;
    private static final int MAX_BACKUP_BYTES = 8 * 1024 * 1024;

    @PluginMethod
    public void share(PluginCall call) {
        String content = call.getString("content");
        String name = call.getString("name", "Liberte_Backup.json");
        String mime = call.getString("mimeType", "application/json");
        if (content == null) { call.reject("Contenu de sauvegarde manquant."); return; }
        byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
        if (bytes.length > MAX_BACKUP_BYTES) { call.reject("La sauvegarde dépasse 8 Mo."); return; }
        Activity activity = getActivity();
        if (activity == null || activity.isFinishing() || activity.isDestroyed()) { call.reject("Partage indisponible."); return; }
        activity.runOnUiThread(() -> {
            File file = null;
            try {
                File directory = new File(getContext().getCacheDir(), "shared-backups");
                if (!directory.exists() && !directory.mkdirs()) throw new java.io.IOException("Dossier temporaire inaccessible.");
                String safeName = name.replaceAll("[^A-Za-z0-9._-]", "_");
                file = new File(directory, safeName);
                try (FileOutputStream output = new FileOutputStream(file)) { output.write(bytes); output.flush(); }
                Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", file);
                Intent send = new Intent(Intent.ACTION_SEND);
                send.setType(mime);
                send.putExtra(Intent.EXTRA_STREAM, uri);
                send.setClipData(ClipData.newUri(getContext().getContentResolver(), safeName, uri));
                send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                activity.startActivity(Intent.createChooser(send, "Envoyer la sauvegarde Liberté"));
                JSObject response = new JSObject(); response.put("shared", true); call.resolve(response);
            } catch (Exception e) {
                if (file != null) file.delete();
                call.reject("Impossible d’ouvrir le partage Android.", e);
            }
        });
    }

    @PluginMethod
    public void restore(PluginCall call) {
        if (saving) { call.reject("Une sélection de fichier est déjà en cours."); return; }
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        saving = true;
        try { startActivityForResult(call, intent, "backupSelected"); }
        catch (Exception e) { saving = false; call.reject("Impossible d’ouvrir Google Drive ou le sélecteur de fichiers.", e); }
    }

    @ActivityCallback
    private void backupSelected(PluginCall call, ActivityResult result) {
        saving = false;
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            JSObject response = new JSObject(); response.put("cancelled", true); call.resolve(response); return;
        }
        Uri uri = result.getData().getData();
        try (InputStream input = getContext().getContentResolver().openInputStream(uri);
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            if (input == null) throw new java.io.IOException("Fichier inaccessible.");
            byte[] buffer = new byte[8192]; int count;
            while ((count = input.read(buffer)) != -1) {
                if (output.size() + count > MAX_BACKUP_BYTES) throw new java.io.IOException("La sauvegarde dépasse 8 Mo.");
                output.write(buffer, 0, count);
            }
            String name = "sauvegarde.json";
            try (Cursor cursor = getContext().getContentResolver().query(uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
                if (cursor != null && cursor.moveToFirst()) { int index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME); if (index >= 0) name = cursor.getString(index); }
            } catch (Exception ignored) { }
            JSObject response = new JSObject(); response.put("cancelled", false); response.put("name", name);
            response.put("content", output.toString("UTF-8")); call.resolve(response);
        } catch (Exception e) { call.reject("Lecture de la sauvegarde impossible. Vérifie le fichier choisi.", e); }
    }

    @PluginMethod
    public void save(PluginCall call) {
        if (saving) { call.reject("Un export est déjà en cours."); return; }
        if (call.getString("content") == null || call.getString("name") == null) {
            call.reject("Contenu ou nom de fichier manquant."); return;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            saveToBackupFolder(call);
            return;
        }
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType(call.getString("mimeType", "application/json"));
        intent.putExtra(Intent.EXTRA_TITLE, call.getString("name"));
        saving = true;
        try { startActivityForResult(call, intent, "fileSelected"); }
        catch (Exception e) { saving = false; call.reject("Impossible d’ouvrir le sélecteur de fichiers.", e); }
    }


    private void saveToBackupFolder(PluginCall call) {
        String requestedName = call.getString("name", "liberte-backup.json");
        String mime = call.getString("mimeType", "application/json");
        String relativePath = Environment.DIRECTORY_DOWNLOADS + "/Backup/";
        Uri collection = MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY);
        String name = uniqueName(collection, relativePath, requestedName);
        ContentValues values = new ContentValues();
        values.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
        values.put(MediaStore.MediaColumns.MIME_TYPE, mime);
        values.put(MediaStore.MediaColumns.RELATIVE_PATH, relativePath);
        values.put(MediaStore.MediaColumns.IS_PENDING, 1);
        Uri item = null;
        try {
            item = getContext().getContentResolver().insert(collection, values);
            if (item == null) throw new java.io.IOException("Impossible de créer le fichier dans Download/Backup.");
            try (OutputStream output = getContext().getContentResolver().openOutputStream(item, "w")) {
                if (output == null) throw new java.io.IOException("Destination inaccessible.");
                output.write(call.getString("content", "").getBytes(StandardCharsets.UTF_8));
                output.flush();
            }
            ContentValues ready = new ContentValues();
            ready.put(MediaStore.MediaColumns.IS_PENDING, 0);
            getContext().getContentResolver().update(item, ready, null, null);
            JSObject response = new JSObject();
            response.put("cancelled", false);
            response.put("defaultLocation", true);
            response.put("path", "Download/Backup/" + name);
            call.resolve(response);
        } catch (Exception error) {
            if (item != null) getContext().getContentResolver().delete(item, null, null);
            call.reject("Enregistrement impossible dans Download/Backup. Vérifie l’espace disponible.", error);
        }
    }

    private String uniqueName(Uri collection, String relativePath, String requestedName) {
        String candidate = requestedName;
        String base = requestedName;
        String extension = "";
        int dot = requestedName.lastIndexOf('.');
        if (dot > 0) { base = requestedName.substring(0, dot); extension = requestedName.substring(dot); }
        String[] projection = {MediaStore.MediaColumns.DISPLAY_NAME};
        for (int index = 1; index < 1000; index++) {
            try (Cursor cursor = getContext().getContentResolver().query(collection, projection,
                MediaStore.MediaColumns.RELATIVE_PATH + "=? AND " + MediaStore.MediaColumns.DISPLAY_NAME + "=?",
                new String[]{relativePath, candidate}, null)) {
                if (cursor == null || !cursor.moveToFirst()) return candidate;
            } catch (Exception ignored) { return candidate; }
            candidate = base + "_" + index + extension;
        }
        return base + "_" + System.currentTimeMillis() + extension;
    }

    @ActivityCallback
    private void fileSelected(PluginCall call, ActivityResult result) {
        saving = false;
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK) {
            JSObject response = new JSObject();
            response.put("cancelled", true); call.resolve(response); return;
        }
        Intent data = result.getData();
        if (data == null || data.getData() == null) { call.reject("Aucun fichier sélectionné."); return; }
        try (OutputStream output = getContext().getContentResolver().openOutputStream(data.getData(), "wt")) {
            if (output == null) throw new java.io.IOException("Destination inaccessible");
            output.write(call.getString("content", "").getBytes(StandardCharsets.UTF_8));
            output.flush();
        } catch (Exception e) { call.reject("Enregistrement impossible. Vérifie l’espace disponible et la destination.", e); return; }
        JSObject response = new JSObject();
        response.put("cancelled", false); call.resolve(response);
    }
}
