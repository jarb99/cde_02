import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router";
import classNames from "classnames";

const {
  NODE_ENV,
  REACT_APP_GA_MEASUREMENT_ID: GA_MEASUREMENT_ID
} = process.env;

declare global {
  interface Window {
    gtag: any;
  }
}

interface PageProps {
  className?: string;
  title: string;
  children?: React.ReactNode;
}

const Page: React.FC<PageProps> = (props: PageProps) => {
  const location = useLocation();

  useEffect(() => {
    if (NODE_ENV !== "production") {
      return;
    }

    if (window.gtag) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: location.pathname,
        page_name: props.title
      });
    }

    // eslint-disable-next-line
  }, []);

  const className = props.className || "";
  const useClassName = !(
    props.className === null || props.className === undefined
  );

  return (
    <div className={classNames({ [className]: useClassName })}>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      {props.children}
    </div>
  );
};

export default Page;
