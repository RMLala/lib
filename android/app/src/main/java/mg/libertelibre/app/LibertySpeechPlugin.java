package mg.libertelibre.app;

import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import com.getcapacitor.*;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.Locale;

@CapacitorPlugin(name="LibertySpeech")
public class LibertySpeechPlugin extends Plugin {
 private TextToSpeech engine;
 private boolean ready=false, failed=false, paused=false;
 private String text="", active="";
 private int offset=0, base=0, end=0, serial=0;
 private void event(String type,int index,String error){JSObject o=new JSObject();o.put("type",type);o.put("charIndex",index);o.put("error",error);notifyListeners("speech",o);}
 @Override public void load(){getActivity().runOnUiThread(()->{
  engine=new TextToSpeech(getContext(),status->{ready=status==TextToSpeech.SUCCESS;failed=!ready;});
  engine.setOnUtteranceProgressListener(new UtteranceProgressListener(){
   public void onStart(String id){getActivity().runOnUiThread(()->{if(id.equals(active)){event("start",base,"");event("boundary",base,"");}});}
   public void onDone(String id){getActivity().runOnUiThread(()->{if(!id.equals(active)||paused)return;offset=end;if(offset<text.length())next();else{active="";event("end",offset,"");}});}
   public void onError(String id){getActivity().runOnUiThread(()->{if(id.equals(active)){active="";event("error",offset,"Le moteur vocal a échoué. Vérifiez les voix installées dans les réglages Android.");}});}
   @Override public void onRangeStart(String id,int start,int finish,int frame){getActivity().runOnUiThread(()->{if(id.equals(active)&&!paused){offset=base+start;event("boundary",offset,"");}});}
  });
 });}
 private boolean check(PluginCall c){if(!ready){c.reject(failed?"Aucun moteur vocal disponible. Activez la synthèse vocale dans les réglages Android.":"Le moteur vocal se prépare. Réessayez dans quelques secondes.");return false;}return true;}
 private void next(){base=offset;end=Math.min(text.length(),base+160);if(end<text.length()){int space=text.lastIndexOf(' ',end);if(space>base)end=space+1;}active="liberte-"+(++serial);if(engine.speak(text.substring(base,end),TextToSpeech.QUEUE_FLUSH,null,active)==TextToSpeech.ERROR)event("error",offset,"Impossible de démarrer la synthèse vocale.");}
 @PluginMethod public void voices(PluginCall c){getActivity().runOnUiThread(()->{if(!check(c))return;JSArray list=new JSArray();if(engine.getVoices()!=null)for(Voice v:engine.getVoices()){JSObject o=new JSObject();o.put("name",v.getName());o.put("lang",v.getLocale().toLanguageTag());o.put("default",v.equals(engine.getDefaultVoice()));list.put(o);}JSObject result=new JSObject();result.put("voices",list);c.resolve(result);});}
 @PluginMethod public void speak(PluginCall c){getActivity().runOnUiThread(()->{if(!check(c))return;String value=c.getString("text","");if(value.trim().isEmpty()){c.reject("Aucun texte à lire.");return;}active="";engine.stop();int result=engine.setLanguage(Locale.forLanguageTag(c.getString("lang","fr-FR")));if(result<0){c.reject("La voix de cette langue n’est pas installée. Installez-la dans les réglages de synthèse vocale Android.");return;}String name=c.getString("voice","");if(engine.getVoices()!=null)for(Voice v:engine.getVoices())if(v.getName().equals(name))engine.setVoice(v);engine.setSpeechRate(Math.max(.5f,Math.min(1.5f,c.getFloat("rate",.75f))));text=value;offset=0;paused=false;next();c.resolve();});}
 @PluginMethod public void pause(PluginCall c){getActivity().runOnUiThread(()->{paused=true;active="";if(engine!=null)engine.stop();c.resolve();});}
 @PluginMethod public void resume(PluginCall c){getActivity().runOnUiThread(()->{if(!check(c))return;if(paused&&offset<text.length()){paused=false;next();}c.resolve();});}
 @PluginMethod public void stop(PluginCall c){getActivity().runOnUiThread(()->{active="";paused=false;text="";offset=0;if(engine!=null)engine.stop();c.resolve();});}
 @Override protected void handleOnDestroy(){if(engine!=null){engine.stop();engine.shutdown();}}
}
