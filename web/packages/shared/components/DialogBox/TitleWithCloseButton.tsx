import { SpaceBetweenFlex } from "@ente/shared/components/Container";
import CloseIcon from "@mui/icons-material/Close";
import {
    DialogTitle,
    IconButton,
    Typography,
    type DialogProps,
} from "@mui/material";

const DialogTitleWithCloseButton = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle {...other}>
            <SpaceBetweenFlex>
                <Typography variant="h3" fontWeight={"bold"}>
                    {children}
                </Typography>
                {onClose && (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ float: "right" }}
                        color="secondary"
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </SpaceBetweenFlex>
        </DialogTitle>
    );
};

export default DialogTitleWithCloseButton;

export const dialogCloseHandler =
    ({
        staticBackdrop,
        nonClosable,
        onClose,
    }: {
        staticBackdrop?: boolean;
        nonClosable?: boolean;
        onClose: () => void;
    }): DialogProps["onClose"] =>
    (_, reason) => {
        if (nonClosable) {
            // no-op
        } else if (staticBackdrop && reason === "backdropClick") {
            // no-op
        } else {
            onClose();
        }
    };
