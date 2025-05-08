"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../component/Loading";

const withBasicAuth = (Component) => {
  return function ProtectedComponent(props) {
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("userDetails");

        if (!JSON.parse(user)) {
          router.push("/auth/signin");
        } else {
          setAuthenticated(true);
        }
      }
    }, [router]);

    if (!authenticated) {
      return <Loading />;
    }

    return <Component {...props} />;
  };
};

export default withBasicAuth;
