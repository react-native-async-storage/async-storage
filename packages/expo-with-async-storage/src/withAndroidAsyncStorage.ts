import { type ConfigPlugin, withProjectBuildGradle } from "expo/config-plugins";

const projectContent = 'project(":react-native-async-storage_async-storage")';
const KotlinUriContent = `url = uri(${projectContent}.file("local_repo"))`;
const GroovyUriContent = `url uri(${projectContent}.projectDir.toString() + "/local_repo")`;

export const withAndroidAsyncStorage: ConfigPlugin = (config) => {
  return withProjectBuildGradle(config, (mod) => {
    const contents = mod.modResults.contents;
    const isKt = mod.modResults.language === "kt";

    if (
      contents.includes("async-storage/local_repo") ||
      contents.includes(projectContent)
    ) {
      return mod;
    }

    const mavenBlock = `maven { ${isKt ? KotlinUriContent : GroovyUriContent} }`;

    mod.modResults.contents = contents.replace(
      /allprojects\s*\{[\s\S]*?repositories\s*\{/,
      (match) => match + "\n\t" + mavenBlock
    );

    return mod;
  });
};
