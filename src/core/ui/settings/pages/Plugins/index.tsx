import { Strings } from "@core/i18n";
import AddonPage from "@core/ui/components/AddonPage";
import PluginCard from "@core/ui/settings/pages/Plugins/components/PluginCard";
import { VdPluginManager } from "@core/vendetta/plugins";
import { settings } from "@lib/api/settings";
import { useProxy } from "@lib/api/storage";
import { Author } from "@lib/utils/types";
import { ComponentProps } from "react";

import unifyVdPlugin from "./models/vendetta";

export interface UnifiedPluginModel {
    id: string;
    name: string;
    description?: string;
    authors?: Array<Author | string>;
    icon?: string;

    isEnabled(): boolean;
    usePluginState(): void;
    isInstalled(): boolean;
    toggle(start: boolean): void;
    resolveSheetComponent(): Promise<{ default: React.ComponentType<any>; }>;
    getPluginSettingsComponent(): React.ComponentType<any> | null | undefined;
}

function navigateToPluginBrowser(navigation: any) {
    navigation.push("BUNNY_CUSTOM_PAGE", {
        title: "Plugin Browser",
        render: React.lazy(() => import("../PluginBrowser")),
    });
}

interface PluginPageProps extends Partial<ComponentProps<typeof AddonPage<UnifiedPluginModel>>> {
    useItems: () => unknown[];
}

function PluginPage(props: PluginPageProps) {
    const items = props.useItems();

    return <AddonPage<UnifiedPluginModel>
        CardComponent={PluginCard}
        title={Strings.PLUGINS}
        searchKeywords={[
            "name",
            "description",
            p => p.authors?.map(
                (a: Author | string) => typeof a === "string" ? a : a.name
            ).join()
        ]}
        sortOptions={{
            "Name (A-Z)": (a, b) => a.name.localeCompare(b.name),
            "Name (Z-A)": (a, b) => b.name.localeCompare(a.name)
        }}
        safeModeHint={{ message: Strings.SAFE_MODE_NOTICE_PLUGINS }}
        items={items}
        {...props}
    />;
}

export default function Plugins() {
    useProxy(settings);

    return <PluginPage
        useItems={() => useProxy(VdPluginManager.plugins) && Object.values(VdPluginManager.plugins)}
        resolveItem={unifyVdPlugin}
        fetchFunction={(url: string) => VdPluginManager.installPlugin(url)}
    />;

    // const navigation = NavigationNative.useNavigation();
    // const { width: pageWidth } = useWindowDimensions();

    // const state = useSegmentedControlState({
    //     pageWidth,
    //     items: [
    //         {
    //             label: "Vendetta",
    //             id: "vendetta-plugins",
    //             page: (
    //                 <PluginPage
    //                     useItems={() => useProxy(VdPluginManager.plugins) && Object.values(VdPluginManager.plugins)}
    //                     resolveItem={unifyVdPlugin}
    //                     fetchFunction={(url: string) => VdPluginManager.installPlugin(url)}
    //                 />
    //             )
    //         },
    //         {
    //             label: "Bunny",
    //             id: "bunny-plugins",
    //             page: (
    //                 <PluginPage
    //                     useItems={() => (useNewProxy(pluginSettings), [...registeredPlugins.values()].filter(p => isPluginInstalled(p.id)))}
    //                     resolveItem={unifyBunnyPlugin}
    //                     ListHeaderComponent={() => (
    //                         <View style={{ marginBottom: 10 }}>
    //                             <HelpMessage messageType={0}>
    //                                 Bunny plugin system is in no way ready, try not getting yourself burnt ⚠️
    //                             </HelpMessage>
    //                         </View>
    //                     )}
    //                     ListFooterComponent={() => (
    //                         <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 16, gap: 12 }}>
    //                             <Text variant="heading-lg/bold">{"Looking for more?"}</Text>
    //                             <Button
    //                                 size="lg"
    //                                 text="Browse plugins"
    //                                 icon={findAssetId("discover")}
    //                                 onPress={() => navigateToPluginBrowser(navigation)}
    //                             />
    //                         </View>
    //                     )}
    //                 />
    //             )
    //         },
    //     ]
    // });

    // return (
    //     <View style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
    //         <View style={{ padding: 8, paddingBottom: 0 }}>
    //             <SegmentedControl state={state} />
    //         </View>
    //         <SegmentedControlPages state={state} />
    //     </View>
    // );
}
