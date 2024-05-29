import React, { useState, useEffect } from "react";
import Account from "./Account";
import AccountEdit from "./AccountEdit";
import AccountMessagesContainer from "./AccountMessagesContainer";
import { useParams } from "react-router-dom";
import { getAccount } from "../../_utils/auth/auth.functions";
import { NoUserFound } from "../Infos/NotFound";

const AccountContainer = (params) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [account, setAccount] = useState(null); // Use null instead of empty array
  const { id } = useParams();
  const [refetch, setRefetch] = useState(false);

  const fetchAccount = async () => {
    try {
      const res = await getAccount(id);
      if (res.status === 200) {
        const result = await res.json();
        setAccount(result);
      } else if (res.status === 404) {
        setError(404);
      } else {
        setError(res.statusText);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [refetch, id]); // Add id as a dependency

  const handlePost = () => {
    fetchAccount();
  };

  const handlerDeletedAccount = () => {
    setAccount(null); // Set account to null
    setIsLoaded(false);
    setRefetch((prev) => !prev); // Toggle refetch to true or false
  };

  if (error === 404) {
    return (
      <div>
        <NoUserFound />
      </div>
    );
  } else if (error) {
    return <div>Error: {error}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      account && (
        <React.Fragment>
          <section className="row justify-content-center">
            {!params.editor ? (
              <Account
                {...account}
                onLogout={params.onLogout}
                onDeletedAccount={handlerDeletedAccount}
              />
            ) : null}
            {params.editor ? (
              <AccountEdit {...account} onPost={handlePost} />
            ) : null}
          </section>
          {!params.editor ? <AccountMessagesContainer /> : null}
        </React.Fragment>
      )
    );
  }
};

export default AccountContainer;
