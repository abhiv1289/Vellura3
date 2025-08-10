import { useSelector } from "react-redux";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../Components/SideBar";

function MainContainer() {
  const [open, setOpen] = useState(false);

  return (
    <div className=" flex h-screen">
      {/* Sidebar */}

      <SideBar open={open} setOpen={setOpen} />
      {/* Main Content */}
      <div
        className="ml-20 flex-1 overflow-y-scroll"
        onClick={() => setOpen(false)}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default MainContainer;
