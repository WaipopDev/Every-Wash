import React from "react";
import { Route } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import HomePage from "pages/index";
import About from "pages/about";
import Form from "pages/form";
import User from "pages/user";
import Machine from "pages/machine";
import MachineList from "pages/machine_list";

const MyApp = () => {
  return (
    <RecoilRoot>
      <App>
        <SnackbarProvider>
          <ZMPRouter>
            <AnimationRoutes>
              <Route path="/" element={<HomePage></HomePage>}></Route>
              <Route path="/about" element={<About></About>}></Route>
              <Route path="/machine" element={<Machine></Machine>}></Route>
              <Route path="/machine_list" element={<MachineList></MachineList>}></Route>
              {/* <Route path="/form" element={<Form></Form>}></Route> */}
              {/* <Route path="/user" element={<User></User>}></Route> */}
            </AnimationRoutes>
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};
export default MyApp;
