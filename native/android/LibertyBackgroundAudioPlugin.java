package mg.libertelibre.app;

import android.content.Intent;
import android.util.Base64;
import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileOutputStream;
import java.util.UUID;

@CapacitorPlugin(name = "LibertyBackgroundAudio")
public class LibertyBackgroundAudioPlugin extends Plugin {
    @PluginMethod public void play(PluginCall call) {
        String encoded = call.getString("data", "");
        String mime = call.getString("mime", "audio/mp4");
        String title = call.getString("title", "Lecture Liberté");
        if (encoded.isEmpty()) { call.reject("Aucun enregistrement à lire."); return; }
        if (encoded.length() > 28000000) { call.reject("Cet enregistrement dépasse la limite de lecture sécurisée (20 Mo)."); return; }
        File file = new File(getContext().getCacheDir(), "liberte-playback-" + UUID.randomUUID() + extension(mime));
        try (FileOutputStream out = new FileOutputStream(file)) {
            out.write(Base64.decode(encoded, Base64.DEFAULT));
            Intent intent = new Intent(getContext(), LibertyAudioService.class);
            intent.setAction(LibertyAudioService.ACTION_PLAY);
            intent.putExtra(LibertyAudioService.EXTRA_PATH, file.getAbsolutePath());
            intent.putExtra(LibertyAudioService.EXTRA_TITLE, title);
            if (android.os.Build.VERSION.SDK_INT >= 26) getContext().startForegroundService(intent); else getContext().startService(intent);
            JSObject result = new JSObject(); result.put("started", true); call.resolve(result);
        } catch (Exception e) { file.delete(); call.reject("Impossible de préparer la lecture en arrière-plan.", e); }
    }
    @PluginMethod public void pause(PluginCall call) { command(call, LibertyAudioService.ACTION_PAUSE); }
    @PluginMethod public void resume(PluginCall call) { command(call, LibertyAudioService.ACTION_RESUME); }
    @PluginMethod public void stop(PluginCall call) { command(call, LibertyAudioService.ACTION_STOP); }
    private void command(PluginCall call, String action) {
        try { Intent i = new Intent(getContext(), LibertyAudioService.class); i.setAction(action); getContext().startService(i); call.resolve(); }
        catch (Exception e) { call.reject("Commande audio indisponible.", e); }
    }
    private String extension(String mime) { return mime != null && mime.contains("webm") ? ".webm" : mime != null && mime.contains("ogg") ? ".ogg" : ".m4a"; }
}
