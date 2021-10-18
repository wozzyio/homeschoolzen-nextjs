import React from "react";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../firebase/authUserContext';

// components

import CardLineChart from "components/Cards/CardLineChart.js";
import CardBarChart from "components/Cards/CardBarChart.js";
import CardPageVisits from "components/Cards/CardPageVisits.js";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";

// layout for page

import Admin from "layouts/Admin.js";
import Firebase from "../../firebase/clientApp";

export default function Dashboard() {
    const { authUser, loading, userDoc } = useAuth();
    const router = useRouter();
    const db = Firebase.firestore();

    // Listen for changes on loading and authUser, redirect if needed
    useEffect(() => {
      console.log(userDoc);
      console.log("authUser: "+ authUser);
      if (!loading && !authUser && !userDoc) {
          router.push('/')
      } else if(userDoc) {
          if(userDoc.userType !== "teacher"){
              router.push('/')
          }
      }
    }, [authUser, loading, userDoc])

      return (
        <>
          <div className="flex flex-wrap">
            <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
              <CardLineChart />
            </div>
            <div className="w-full xl:w-4/12 px-4">
              <CardBarChart />
            </div>
          </div>
          <div className="flex flex-wrap mt-4">
            <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
              <CardPageVisits />
            </div>
            <div className="w-full xl:w-4/12 px-4">
              <CardSocialTraffic />
            </div>
          </div>
        </>
      );
}

Dashboard.layout = Admin;
