"use client";

import { useAuthStore } from "@/store/authStore";
import { useRef } from "react";

const LogoutButton = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { logout } = useAuthStore();

  return (
    <>
      <button
        onClick={() => modalRef.current?.showModal()}
        className="btn btn-neutral btn-outline"
      >
        Logout
      </button>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <p className="py-4">Logout</p>
          <div className="modal-action">
            <form method="dialog" className="space-x-5">
              <button className="btn btn-neutral btn-ghost">Cancel</button>
              <button className="btn btn-error btn-soft" onClick={logout}>
                Logout
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default LogoutButton;
