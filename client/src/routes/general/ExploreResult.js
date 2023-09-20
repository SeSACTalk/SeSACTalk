import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";



const ExploreResult = function () {
  const SERVER = process.env.REACT_APP_BACK_BASE_URL;
  /* variables */
  let { tagName } = useParams();
  const SERVER_EXPLORE_TAG_DETAIL = `${SERVER}/explore/tags/${tagName}/`;

  return (
    <div className="ExploreTagDetail w-4/5 p-10">

    </div>
  );
};


export default ExploreResult;