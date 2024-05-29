import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Account from "./Account";
import AccountEdit from "./AccountEdit";
import AccountMessagesContainer from "./AccountMessagesContainer";
import { getAccount } from "../../_utils/auth/auth.functions";
import { NoUserFound } from "../Infos/NotFound";

const AccountContainer = ({ editor, onLogout }) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [account, setAccount] = useState(null);
  const { id } = useParams();
  const [refetch, setRefetch] = useState(false);

  const fetchAccount = useCallback(async () => {
    try {
      const res = await getAccount(id);
      if (res.ok) {
        const result = await res.json();
        setAccount(result);
        setError(null);
      } else if (res.status === 404) {
        setError("User not found (404)");
      } else {
        const errorText = await res.text(); // Get the text error message from the response
        setError(`Error: ${res.status} - ${errorText}`);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoaded(true);
    }
  }, [id]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount, refetch, id]);

  const handlePost = () => {
    fetchAccount();
  };

  const handleDeletedAccount = () => {
    setAccount(null);
    setIsLoaded(false);
    setRefetch((prev) => !prev);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (error === "User not found (404)") {
    return <NoUserFound />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    account && (
      <React.Fragment>
        <section className="row justify-content-center">
          {!editor ? (
            <Account
              {...account}
              onLogout={onLogout}
              onDeletedAccount={handleDeletedAccount}
            />
          ) : (
            <AccountEdit {...account} onPost={handlePost} />
          )}
        </section>
        {!editor && <AccountMessagesContainer />}
      </React.Fragment>
    )
  );
};

export default AccountContainer;
