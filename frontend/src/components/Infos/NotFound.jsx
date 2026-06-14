import React from "react";
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { useI18n } from "../../_utils/i18n/I18nContext";

export const NoMessageFound = () => {
  const { t } = useI18n();
  return (
    <p className="text-center text-muted py-4"><CommentsDisabledIcon /> {t("notFound.noMessages")}</p>
  );
};

export const NoUserFound = () => {
  const { t } = useI18n();
  return (
    <p className="text-center text-muted py-4"><NoAccountsIcon /> {t("notFound.noUser")}</p>
  );
};

export const NoCommentsFound = () => {
  const { t } = useI18n();
  return (
    <p className="text-center text-muted py-4"><CommentsDisabledIcon /> {t("notFound.noComments")}</p>
  );
};
