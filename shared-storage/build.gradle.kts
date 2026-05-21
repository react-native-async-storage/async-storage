import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidKotlinMultiplatformLibrary)
    alias(libs.plugins.ksp)
    alias(libs.plugins.androidx.room)
    alias(libs.plugins.mavenPublish)
    alias(libs.plugins.skie)
}

/**
 * Windows as native target is not currently supported by Room db.
 * https://issuetracker.google.com/issues/363195546
 */
kotlin {
    room { schemaDirectory("$projectDir/schemas") }

    androidLibrary {
        namespace = "org.asyncstorage.shared_storage"
        compileSdk = 36
        minSdk = 24

        compilations.configureEach {
            compilerOptions.configure { jvmTarget.set(JvmTarget.JVM_1_8) }
        }

        withHostTest { isIncludeAndroidResources = true }

        /**
         * For some reason, device tests needs to be set up too, in order for test runner for
         * android to work correctly. Otherwise, it fails with missing android/Application class.
         */
        withDeviceTest {}
    }

    val xcfName = "SharedAsyncStorage"
    val xcf = XCFramework(xcfName)
    listOf(iosX64(), iosArm64(), iosSimulatorArm64(), macosArm64(), macosX64()).forEach {
        it.binaries.framework {
            baseName = xcfName
            isStatic = true
            xcf.add(this)
            binaryOption("bundleId", "org.asyncstorage.shared_storage")
        }
    }

    sourceSets {
        commonMain {
            dependencies {
                implementation(libs.androidx.room.runtime)
                implementation(libs.androidx.sqlite.bundled)
                implementation(libs.kotlinx.coroutines)
                implementation(libs.logging.kermit)
            }
        }

        androidMain { dependencies {} }

        appleMain { dependencies {} }

        commonTest {
            dependencies {
                implementation(libs.tests.kotlin)
                implementation(libs.tests.coroutines)
                implementation(libs.tests.turbine)
            }
        }

        getByName("androidHostTest") {
            dependencies {
                implementation(libs.tests.robolectric)
                implementation(libs.tests.junit)
            }
        }

        compilerOptions { freeCompilerArgs.add("-Xexpect-actual-classes") }
    }

    dependencies {
        add("kspAndroid", libs.androidx.room.compiler)
        add("kspIosSimulatorArm64", libs.androidx.room.compiler)
        add("kspIosX64", libs.androidx.room.compiler)
        add("kspIosArm64", libs.androidx.room.compiler)
        add("kspMacosX64", libs.androidx.room.compiler)
        add("kspMacosArm64", libs.androidx.room.compiler)
    }
}

skie { build { produceDistributableFramework() } }

mavenPublishing {
    publishToMavenCentral()
    signAllPublications()
}