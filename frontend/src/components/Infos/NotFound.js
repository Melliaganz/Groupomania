import React from "react";
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';


export  const NoMessageFound = () => {
  return (
    <div >
      <p className="text-center"> <CommentsDisabledIcon /> Aucun messages </p>
    </div>
  );
};
export  const NoUserFound = () => {
  return (
    <div >
      <p className="text-center"> <NoAccountsIcon /> L'utilisateur n'existe pas.</p>
    </div>
  );
};
export const NoCommentsFound = () => {
  return (
    <div >
      <p className="text-center"><CommentsDisabledIcon /> Aucun commentaires</p>
    </div>
  )
}
