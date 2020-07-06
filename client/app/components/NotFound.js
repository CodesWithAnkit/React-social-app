import React from "react";
import Page from "./Page";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <Page title="Not Found">
        <div className="text-center">
          <h2>Woops We can't found the page</h2>
          <p className="lead text-muted">
            you can always visit the <Link to="/">HomePage</Link>
            for the fresh start
          </p>
        </div>
      </Page>
    </div>
  );
};

export default NotFound;
