import type { SetDialogBoxAttributes } from "@ente/shared/components/DialogBox/types";

/**
 * A subset of the AppContext type used by the photos app.
 *
 * [Note: Migrating components that need the app context]
 *
 * This only exists to make it easier to migrate code into the @/new package.
 * Once we move this code back (after TypeScript strict mode migration is done),
 * then the code that uses this can start directly using the actual app context
 * instead of needing to explicitly pass a prop of this type.
 * */
export interface NewAppContextPhotos {
    startLoading: () => void;
    finishLoading: () => void;
    closeMessageDialog: () => void;
    setDialogMessage: SetDialogBoxAttributes;
    somethingWentWrong: () => void;
}
