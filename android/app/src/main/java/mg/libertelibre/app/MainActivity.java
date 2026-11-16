package mg.libertelibre.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(DataExportPlugin.class);
        registerPlugin(LibertyDevicePlugin.class);
        registerPlugin(LibertySpeechPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
