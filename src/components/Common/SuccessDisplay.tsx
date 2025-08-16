"use client";

import { FiCheckCircle } from "react-icons/fi";

interface Props {
  title: string;
  message: string;
  onDone: () => void;
  doneText?: string;
}

const SuccessDisplay = ({
  title,
  message,
  onDone,
  doneText = "Done",
}: Props) => (
  <div className="text-center p-4 space-y-4">
    <FiCheckCircle className="text-success text-6xl mx-auto" />
    <h3 className="font-bold text-2xl">{title}</h3>
    <p className="text-base-content/70">{message}</p>
    <div className="modal-action justify-center mt-4">
      <button className="btn btn-primary" onClick={onDone}>
        {doneText}
      </button>
    </div>
  </div>
);

export default SuccessDisplay;
