package com.emplica.nightly.android.widget

import android.content.Context
import android.content.SharedPreferences

data class WidgetData(
    val title: String = "Nightly",
    val subtitle: String = "Aucune donnée"
)

object WidgetPreferences {
    private const val PREF_NAME = "nightly_widget_prefs"
    private const val KEY_TITLE = "widget_title"
    private const val KEY_SUBTITLE = "widget_subtitle"

    private fun getPreferences(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    }

    fun write(context: Context, title: String, subtitle: String) {
        getPreferences(context).edit().apply {
            putString(KEY_TITLE, title)
            putString(KEY_SUBTITLE, subtitle)
            apply()
        }
    }

    fun read(context: Context): WidgetData {
        val prefs = getPreferences(context)
        return WidgetData(
            title = prefs.getString(KEY_TITLE, "Nightly") ?: "Nightly",
            subtitle = prefs.getString(KEY_SUBTITLE, "Aucune donnée") ?: "Aucune donnée"
        )
    }
}
