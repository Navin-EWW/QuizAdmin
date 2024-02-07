import React, { useEffect } from "react";
import AppContent from "../Components/AppContent/AppContent";
import Admin_nav from "../Components/AppHeader";
import AppSidebar from "../Components/AppSidebar/AppSidebar";

export function DefaultLayout() {
  useEffect(() => {
    localStorage.setItem(
      "persist:root",
      sessionStorage.getItem("persist:root") || ""
    );
  }, []);

  return (
    <>
      <section>
        <div className="relative">
          <AppSidebar />
          <div className="md:pl-64">
            <Admin_nav />
            {/* <div className="bg-background_grey h-screen"> */}
            <div className="bg-background_grey height-class">
              <AppContent />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
