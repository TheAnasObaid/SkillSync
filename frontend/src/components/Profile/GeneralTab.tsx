import React from "react";

const GeneralTab = () => {
  return (
    <div className="w-full grid gap-3">
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="w-24 rounded-full ring">
            <img src="https://i.pravatar.cc/100" alt="Profile" />
          </div>
        </div>
      </div>
      <div className="grid gap-2">
        <label className="label font-semibold">Display Name</label>
        <input readOnly className="input w-full" type="text" />
      </div>
      <div className="grid gap-2">
        <label className="label font-semibold">Email</label>
        <input readOnly className="input w-full" type="text" />
      </div>
      <div className="grid gap-2">
        <label className="label font-semibold">Bio</label>
        <textarea readOnly className="textarea w-full" />
      </div>
    </div>
  );
};

export default GeneralTab;
