package com.emplica.nightly.android.widget

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

class WidgetModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    override fun getName(): String {
        return "WidgetModule"
    }

    @ReactMethod
    fun updateWidgetData(title: String, subtitle: String) {
        val context = reactApplicationContext

        // Write to SharedPreferences
        WidgetPreferences.write(context, title, subtitle)

        // Refresh all widget instances
        scope.launch {
            try {
                NightlyGlanceWidget.refreshAll(context)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
