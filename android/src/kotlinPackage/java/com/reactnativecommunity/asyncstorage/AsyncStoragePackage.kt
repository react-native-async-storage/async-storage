package com.reactnativecommunity.asyncstorage

import com.facebook.react.TurboReactPackage
import com.facebook.react.ViewManagerOnDemandReactPackage
import com.facebook.react.bridge.ModuleSpec
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.module.annotations.ReactModuleList
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager
import com.reactnativecommunity.asyncstorage.next.StorageModule

@ReactModuleList(
    nativeModules = [
        StorageModule::class
    ]
)
class AsyncStoragePackage : TurboReactPackage() {
    override fun getModule(name: String, context: ReactApplicationContext): NativeModule? = when (name) {
        StorageModule.NAME -> StorageModule(context)
        else -> null
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        try {
            val reactModuleInfoProviderClass =
                Class.forName("com.reactnativecommunity.asyncstorage.AsyncStoragePackage$\$ReactModuleInfoProvider")
            return reactModuleInfoProviderClass.newInstance() as ReactModuleInfoProvider
        } catch (e: ClassNotFoundException) {
            return ReactModuleInfoProvider {
                val reactModule: ReactModule = StorageModule::class.java.getAnnotation(
                    ReactModule::class.java)!!

                mutableMapOf(
                    StorageModule.NAME to ReactModuleInfo(
                        reactModule.name,
                        StorageModule::class.java.name,
                        reactModule.canOverrideExistingModule,
                        reactModule.needsEagerInit,
                        reactModule.hasConstants,
                        reactModule.isCxxModule,
                        TurboModule::class.java.isAssignableFrom(StorageModule::class.java)
                    )
                )
            }
        } catch (e: InstantiationException) {
            throw RuntimeException("No ReactModuleInfoProvider for AsyncStoragePackage$\$ReactModuleInfoProvider", e)
        } catch (e: IllegalAccessException) {
            throw RuntimeException("No ReactModuleInfoProvider for AsyncStoragePackage$\$ReactModuleInfoProvider", e)
        }
    }

    override fun getViewManagers(reactContext: ReactApplicationContext?): MutableList<ModuleSpec>? = null
}