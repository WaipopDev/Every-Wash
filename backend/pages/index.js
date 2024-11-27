import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Router from "next/router";
import LoadPage from "../src/components/PageChange/LoadPage";

export const index = (props) => {
  const { userData } = props
  useEffect(() => {
    Router.push("/dashboard");
  }, []);
  return (
    <div>
      <LoadPage />
    </div>
  )
}

const mapStateToProps = (state) => {
  const {
    user: { data: userData }
  } = state
  return {
    userData
  }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(index)
