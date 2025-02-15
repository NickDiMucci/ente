import { MLSettings } from "@/new/photos/components/MLSettings";
import { isMLSupported } from "@/new/photos/services/ml";
import { EnteDrawer } from "@/new/shared/components/EnteDrawer";
import { MenuItemGroup, MenuSectionTitle } from "@/new/shared/components/Menu";
import { Titlebar } from "@/new/shared/components/Titlebar";
import {
    getLocaleInUse,
    pt,
    setLocaleInUse,
    supportedLocales,
    type SupportedLocale,
} from "@/next/i18n";
import { EnteMenuItem } from "@ente/shared/components/Menu/EnteMenuItem";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ScienceIcon from "@mui/icons-material/Science";
import { Box, DialogProps, Stack } from "@mui/material";
import DropdownInput from "components/DropdownInput";
import { t } from "i18next";
import { AppContext } from "pages/_app";
import { useContext, useState } from "react";
import AdvancedSettings from "./AdvancedSettings";
import MapSettings from "./MapSetting";

export default function Preferences({ open, onClose, onRootClose }) {
    const appContext = useContext(AppContext);

    const [advancedSettingsView, setAdvancedSettingsView] = useState(false);
    const [mapSettingsView, setMapSettingsView] = useState(false);
    const [openMLSettings, setOpenMLSettings] = useState(false);

    const openAdvancedSettings = () => setAdvancedSettingsView(true);
    const closeAdvancedSettings = () => setAdvancedSettingsView(false);

    const openMapSettings = () => setMapSettingsView(true);
    const closeMapSettings = () => setMapSettingsView(false);

    const handleRootClose = () => {
        onClose();
        onRootClose();
    };

    const handleDrawerClose: DialogProps["onClose"] = (_, reason) => {
        if (reason === "backdropClick") {
            handleRootClose();
        } else {
            onClose();
        }
    };

    return (
        <EnteDrawer
            transitionDuration={0}
            open={open}
            onClose={handleDrawerClose}
            BackdropProps={{
                sx: { "&&&": { backgroundColor: "transparent" } },
            }}
        >
            <Stack spacing={"4px"} py={"12px"}>
                <Titlebar
                    onClose={onClose}
                    title={t("PREFERENCES")}
                    onRootClose={handleRootClose}
                />
                <Box px={"8px"}>
                    <Stack py="20px" spacing="24px">
                        <LanguageSelector />
                        <EnteMenuItem
                            onClick={openMapSettings}
                            endIcon={<ChevronRight />}
                            label={t("MAP")}
                        />
                        <EnteMenuItem
                            onClick={openAdvancedSettings}
                            endIcon={<ChevronRight />}
                            label={t("ADVANCED")}
                        />
                        {isMLSupported && (
                            <Box>
                                <MenuSectionTitle
                                    title={t("LABS")}
                                    icon={<ScienceIcon />}
                                />
                                <MenuItemGroup>
                                    <EnteMenuItem
                                        endIcon={<ChevronRight />}
                                        onClick={() => setOpenMLSettings(true)}
                                        label={pt("ML search")}
                                    />
                                </MenuItemGroup>
                                <MenuSectionTitle
                                    title={pt(
                                        "Face recognition, magic search and more",
                                    )}
                                />
                            </Box>
                        )}
                    </Stack>
                </Box>
            </Stack>
            <MLSettings
                open={openMLSettings}
                onClose={() => setOpenMLSettings(false)}
                onRootClose={handleRootClose}
                appContext={appContext}
            />
            <MapSettings
                open={mapSettingsView}
                onClose={closeMapSettings}
                onRootClose={onRootClose}
            />
            <AdvancedSettings
                open={advancedSettingsView}
                onClose={closeAdvancedSettings}
                onRootClose={onRootClose}
            />
        </EnteDrawer>
    );
}

const LanguageSelector = () => {
    const locale = getLocaleInUse();

    const updateCurrentLocale = (newLocale: SupportedLocale) => {
        setLocaleInUse(newLocale);
        // Enhancement: Is this full reload needed?
        //
        // Likely yes, because we use the global `t` instance instead of the
        // useTranslation hook.
        window.location.reload();
    };

    const options = supportedLocales.map((locale) => ({
        label: localeName(locale),
        value: locale,
    }));

    return (
        <DropdownInput
            options={options}
            label={t("LANGUAGE")}
            labelProps={{ color: "text.muted" }}
            selected={locale}
            setSelected={updateCurrentLocale}
        />
    );
};

/**
 * Human readable name for each supported locale.
 */
const localeName = (locale: SupportedLocale) => {
    switch (locale) {
        case "en-US":
            return "English";
        case "fr-FR":
            return "Français";
        case "de-DE":
            return "Deutsch";
        case "zh-CN":
            return "中文";
        case "nl-NL":
            return "Nederlands";
        case "es-ES":
            return "Español";
        case "pt-BR":
            return "Brazilian Portuguese";
        case "ru-RU":
            return "Russian";
    }
};
