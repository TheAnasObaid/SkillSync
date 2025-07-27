import React from "react";

const AboutTab = () => {
  return (
    <div className="w-full grid gap-3">
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="w-24 rounded-full ring">
            <img src="https://i.pravatar.cc/100" alt="Profile" />
          </div>
        </div>
        <button className="btn btn-outline btn-sm">Upload image</button>
      </div>
      <div className="grid gap-2">
        <label className="label font-semibold">First Name</label>
        <input className="input w-full" type="text" />
      </div>
      <div className="grid gap-2">
        <label className="label font-semibold">Last Name</label>
        <input className="input w-full" type="text" />
      </div>
      <div className="grid gap-2">
        <label className="label font-semibold">Bio</label>
        <textarea className="textarea w-full" />
      </div>
      <div className="grid gap-2">
        <label className="label font-semibold">Portfolio</label>
        <input className="input w-full" type="text" />
      </div>
      <div className="grid gap-2">
        <label className="label font-semibold">Experience</label>
        <input className="input w-full" type="text" />
      </div>
      <div className="grid gap-2">
        <label className="label font-semibold">Social Links</label>
        <input className="input w-full" type="text" />
      </div>
      <button className="btn btn-secondary btn-outline w-fit">Update</button>
    </div>
  );
};

export default AboutTab;
