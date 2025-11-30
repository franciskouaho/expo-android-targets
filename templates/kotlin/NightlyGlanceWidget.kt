package com.emplica.nightly.android.widget

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.padding
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.text.FontWeight
import androidx.glance.unit.ColorProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class NightlyGlanceWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            WidgetContent(context)
        }
    }

    @Composable
    private fun WidgetContent(context: Context) {
        val data = WidgetPreferences.read(context)

        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .background(ColorProvider(android.graphics.Color.parseColor("#1a1a2e")))
                .padding(12.dp)
        ) {
            Text(
                text = data.title,
                style = TextStyle(
                    color = ColorProvider(android.graphics.Color.WHITE),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
            )

            Text(
                text = data.subtitle,
                style = TextStyle(
                    color = ColorProvider(android.graphics.Color.parseColor("#b0b0b0")),
                    fontSize = 14.sp
                ),
                modifier = GlanceModifier.padding(top = 4.dp)
            )
        }
    }

    companion object {
        suspend fun refreshAll(context: Context) {
            withContext(Dispatchers.IO) {
                val manager = GlanceAppWidgetManager(context)
                val glanceIds = manager.getGlanceIds(NightlyGlanceWidget::class.java)
                glanceIds.forEach { glanceId ->
                    NightlyGlanceWidget().update(context, glanceId)
                }
            }
        }
    }
}
