import {
    canEnableML,
    disableML,
    enableML,
    getIsMLEnabledRemote,
    isMLEnabled,
    pauseML,
} from "@/new/photos/services/ml";
import { EnteDrawer } from "@/new/shared/components/EnteDrawer";
import { MenuItemGroup } from "@/new/shared/components/Menu";
import { Titlebar } from "@/new/shared/components/Titlebar";
import log from "@/next/log";
import { EnteMenuItem } from "@ente/shared/components/Menu/EnteMenuItem";
import {
    Box,
    Button,
    Checkbox,
    type DialogProps,
    FormControlLabel,
    FormGroup,
    Link,
    Stack,
    Typography,
} from "@mui/material";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import type { NewAppContextPhotos } from "../types/context";

interface MLSettingsProps {
    /** If `true`, then the drawer page is shown. */
    open: boolean;
    /** Called when the user wants to go back from this drawer page. */
    onClose: () => void;
    /** Called when the user wants to close the containing drawer. */
    onRootClose: () => void;
    /** See: [Note: Migrating components that need the app context]. */
    appContext: NewAppContextPhotos;
}

export const MLSettings: React.FC<MLSettingsProps> = ({
    open,
    onClose,
    onRootClose,
    appContext,
}) => {
    const {
        setDialogMessage,
        somethingWentWrong,
        startLoading,
        finishLoading,
    } = appContext;

    const [enableFaceSearchView, setEnableFaceSearchView] = useState(false);

    const openEnableFaceSearch = () => {
        setEnableFaceSearchView(true);
    };
    const closeEnableFaceSearch = () => {
        setEnableFaceSearchView(false);
    };

    const enableMlSearch = async () => {
        try {
            const isEnabledRemote = await getIsMLEnabledRemote();
            if (!isEnabledRemote) {
                openEnableFaceSearch();
            } else {
                await enableML();
            }
        } catch (e) {
            log.error("Enable ML search failed", e);
            somethingWentWrong();
        }
    };

    const enableFaceSearch = async () => {
        try {
            startLoading();
            await enableML();
            closeEnableFaceSearch();
            finishLoading();
        } catch (e) {
            log.error("Enable face search failed", e);
            somethingWentWrong();
        }
    };

    const disableMlSearch = async () => {
        try {
            pauseML();
            onClose();
        } catch (e) {
            log.error("Disable ML search failed", e);
            somethingWentWrong();
        }
    };

    const disableFaceSearch = async () => {
        try {
            startLoading();
            await disableML();
            onClose();
            finishLoading();
        } catch (e) {
            log.error("Disable face search failed", e);
            somethingWentWrong();
        }
    };

    const confirmDisableFaceSearch = () => {
        setDialogMessage({
            title: t("DISABLE_FACE_SEARCH_TITLE"),
            content: (
                <Typography>
                    <Trans i18nKey={"DISABLE_FACE_SEARCH_DESCRIPTION"} />
                </Typography>
            ),
            close: { text: t("CANCEL") },
            proceed: {
                variant: "primary",
                text: t("DISABLE_FACE_SEARCH"),
                action: disableFaceSearch,
            },
        });
    };

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
        <Box>
            <EnteDrawer
                anchor="left"
                transitionDuration={0}
                open={open}
                onClose={handleDrawerClose}
                BackdropProps={{
                    sx: { "&&&": { backgroundColor: "transparent" } },
                }}
            >
                {isMLEnabled() ? (
                    <ManageMLSearch
                        onClose={onClose}
                        disableMlSearch={disableMlSearch}
                        handleDisableFaceSearch={confirmDisableFaceSearch}
                        onRootClose={handleRootClose}
                    />
                ) : (
                    <EnableMLSearch
                        onClose={onClose}
                        enableMlSearch={enableMlSearch}
                        onRootClose={handleRootClose}
                    />
                )}
            </EnteDrawer>

            <EnableFaceSearch
                open={enableFaceSearchView}
                onClose={closeEnableFaceSearch}
                enableFaceSearch={enableFaceSearch}
                onRootClose={handleRootClose}
            />
        </Box>
    );
};

function EnableFaceSearch({ open, onClose, enableFaceSearch, onRootClose }) {
    const [acceptTerms, setAcceptTerms] = useState(false);

    useEffect(() => {
        setAcceptTerms(false);
    }, [open]);

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
                    title={t("ENABLE_FACE_SEARCH_TITLE")}
                    onRootClose={handleRootClose}
                />
                <Stack py={"20px"} px={"8px"} spacing={"32px"}>
                    <Typography color="text.muted" px={"8px"}>
                        <Trans
                            i18nKey={"ENABLE_FACE_SEARCH_DESCRIPTION"}
                            components={{
                                a: (
                                    <Link
                                        target="_blank"
                                        href="https://ente.io/privacy#8-biometric-information-privacy-policy"
                                        underline="always"
                                        sx={{
                                            color: "inherit",
                                            textDecorationColor: "inherit",
                                        }}
                                    />
                                ),
                            }}
                        />
                    </Typography>
                    <FormGroup sx={{ width: "100%" }}>
                        <FormControlLabel
                            sx={{
                                color: "text.muted",
                                ml: 0,
                                mt: 2,
                            }}
                            control={
                                <Checkbox
                                    size="small"
                                    checked={acceptTerms}
                                    onChange={(e) =>
                                        setAcceptTerms(e.target.checked)
                                    }
                                />
                            }
                            label={t("FACE_SEARCH_CONFIRMATION")}
                        />
                    </FormGroup>
                    <Stack px={"8px"} spacing={"8px"}>
                        <Button
                            color={"accent"}
                            size="large"
                            disabled={!acceptTerms}
                            onClick={enableFaceSearch}
                        >
                            {t("ENABLE_FACE_SEARCH")}
                        </Button>
                        <Button
                            color={"secondary"}
                            size="large"
                            onClick={onClose}
                        >
                            {t("CANCEL")}
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </EnteDrawer>
    );
}

function EnableMLSearch({ onClose, enableMlSearch, onRootClose }) {
    // const showDetails = () =>
    //     openLink("https://ente.io/blog/desktop-ml-beta", true);

    const [canEnable, setCanEnable] = useState(false);

    useEffect(() => {
        canEnableML().then((v) => setCanEnable(v));
    }, []);

    return (
        <Stack spacing={"4px"} py={"12px"}>
            <Titlebar
                onClose={onClose}
                title={t("ML_SEARCH")}
                onRootClose={onRootClose}
            />
            <Stack py={"20px"} px={"8px"} spacing={"32px"}>
                {canEnable ? (
                    <Stack px={"8px"} spacing={"8px"}>
                        <Button
                            color={"accent"}
                            size="large"
                            onClick={enableMlSearch}
                        >
                            {t("ENABLE")}
                        </Button>
                        {/*
                        <Button
                        color="secondary"
                        size="large"
                        onClick={showDetails}
                        >
                            {t("ML_MORE_DETAILS")}
                        </Button>
                        */}
                    </Stack>
                ) : (
                    <Box px={"8px"}>
                        {" "}
                        <Typography color="text.muted">
                            {/* <Trans i18nKey={"ENABLE_ML_SEARCH_DESCRIPTION"} /> */}
                            We're putting finishing touches, coming back soon!
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Stack>
    );
}

function ManageMLSearch({
    onClose,
    disableMlSearch,
    handleDisableFaceSearch,
    onRootClose,
}) {
    return (
        <Stack spacing={"4px"} py={"12px"}>
            <Titlebar
                onClose={onClose}
                title={t("ML_SEARCH")}
                onRootClose={onRootClose}
            />
            <Box px={"16px"}>
                <Stack py={"20px"} spacing={"24px"}>
                    <MenuItemGroup>
                        <EnteMenuItem
                            onClick={disableMlSearch}
                            label={t("DISABLE_BETA")}
                        />
                    </MenuItemGroup>
                    <MenuItemGroup>
                        <EnteMenuItem
                            onClick={handleDisableFaceSearch}
                            label={t("DISABLE_FACE_SEARCH")}
                        />
                    </MenuItemGroup>
                </Stack>
            </Box>
        </Stack>
    );
}
