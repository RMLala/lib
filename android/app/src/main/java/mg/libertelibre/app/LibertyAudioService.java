package mg.libertelibre.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;
import java.io.File;

public class LibertyAudioService extends Service {
    public static final String ACTION_TTS_START="mg.libertelibre.app.audio.TTS_START", ACTION_TTS_STOP="mg.libertelibre.app.audio.TTS_STOP";
    public static final String ACTION_PLAY="mg.libertelibre.app.audio.PLAY", ACTION_PAUSE="mg.libertelibre.app.audio.PAUSE", ACTION_RESUME="mg.libertelibre.app.audio.RESUME", ACTION_STOP="mg.libertelibre.app.audio.STOP";
    public static final String EXTRA_PATH="path", EXTRA_TITLE="title";
    private static final String CHANNEL="liberte_audio_playback";
    private static final int NOTIFICATION_ID=4712;
    private MediaPlayer player;
    private File audioFile;
    private String title="Lecture Liberté";
    private boolean speechOnly=false;
    @Override public void onCreate(){super.onCreate();if(Build.VERSION.SDK_INT>=26){NotificationChannel c=new NotificationChannel(CHANNEL,"Lecture audio",NotificationManager.IMPORTANCE_LOW);c.setDescription("Commandes de lecture audio Liberté");getSystemService(NotificationManager.class).createNotificationChannel(c);}}
    @Override public int onStartCommand(Intent intent,int flags,int startId){if(intent==null){stopSelf();return START_NOT_STICKY;}String action=intent.getAction();if(ACTION_TTS_START.equals(action)){speechOnly=true;title="Voix système";startForeground(NOTIFICATION_ID,notification(true));}else if(ACTION_TTS_STOP.equals(action)){if(speechOnly){speechOnly=false;stopForeground(true);stopSelf();}}else if(ACTION_PLAY.equals(action)){speechOnly=false;startForeground(NOTIFICATION_ID,notification(true));play(intent.getStringExtra(EXTRA_PATH),intent.getStringExtra(EXTRA_TITLE));}else if(ACTION_PAUSE.equals(action)){if(player!=null&&player.isPlaying())player.pause();updateNotification(false);}else if(ACTION_RESUME.equals(action)){if(player!=null&&!player.isPlaying())player.start();updateNotification(true);}else if(ACTION_STOP.equals(action)){stopPlayback();}return START_NOT_STICKY;}
    private void play(String path,String label){stopPlayerOnly();if(audioFile!=null)audioFile.delete();audioFile=path==null?null:new File(path);title=label==null?"Lecture Liberté":label;if(audioFile==null||!audioFile.exists()){stopPlayback();return;}try{player=new MediaPlayer();player.setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_MEDIA).setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build());player.setWakeMode(this,android.os.PowerManager.PARTIAL_WAKE_LOCK);player.setDataSource(audioFile.getAbsolutePath());player.setOnPreparedListener(p->{p.start();updateNotification(true);});player.setOnCompletionListener(p->stopPlayback());player.setOnErrorListener((p,what,extra)->{stopPlayback();return true;});player.prepareAsync();}catch(Exception e){stopPlayback();}}
    private Notification notification(boolean playing){Intent open=new Intent(this,MainActivity.class);open.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP|Intent.FLAG_ACTIVITY_CLEAR_TOP);PendingIntent content=PendingIntent.getActivity(this,1,open,pendingFlags());PendingIntent toggle=servicePending(playing?ACTION_PAUSE:ACTION_RESUME,2);PendingIntent stop=servicePending(ACTION_STOP,3);NotificationCompat.Builder builder=new NotificationCompat.Builder(this,CHANNEL).setSmallIcon(R.mipmap.ic_launcher).setContentTitle("Liberté · "+title).setContentText("Lecture en arrière-plan").setContentIntent(content).setOngoing(playing).setOnlyAlertOnce(true).setVisibility(NotificationCompat.VISIBILITY_PUBLIC);if(!speechOnly)builder.addAction(playing?android.R.drawable.ic_media_pause:android.R.drawable.ic_media_play,playing?"Pause":"Reprendre",toggle).addAction(android.R.drawable.ic_menu_close_clear_cancel,"Arrêter",stop);return builder.build();}
    private PendingIntent servicePending(String action,int id){Intent i=new Intent(this,LibertyAudioService.class);i.setAction(action);return PendingIntent.getService(this,id,i,pendingFlags());}
    private int pendingFlags(){return PendingIntent.FLAG_UPDATE_CURRENT|(Build.VERSION.SDK_INT>=23?PendingIntent.FLAG_IMMUTABLE:0);}
    private void updateNotification(boolean playing){if(Build.VERSION.SDK_INT>=26)startForeground(NOTIFICATION_ID,notification(playing));else ((NotificationManager)getSystemService(NOTIFICATION_SERVICE)).notify(NOTIFICATION_ID,notification(playing));}
    private void stopPlayerOnly(){if(player!=null){try{player.stop();}catch(Exception ignored){}player.release();player=null;}}
    private void stopPlayback(){stopPlayerOnly();if(audioFile!=null){audioFile.delete();audioFile=null;}stopForeground(true);stopSelf();}
    @Override public void onDestroy(){stopPlayerOnly();if(audioFile!=null){audioFile.delete();audioFile=null;}super.onDestroy();}
    @Override public IBinder onBind(Intent intent){return null;}
}
