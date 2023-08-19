import React from "react";

const AutoConfirmCheckbox = ({ handleAutoConfirmClick }) => {
    return (
        <div className="t1_5rem d-inline-block">
            <input
                type="checkbox"
                style={{
                    transform: "scale(1.5)",
                    marginRight: "0.5rem",
                }}
                checked={true}
                onChange={(e) => {
                    handleAutoConfirmClick(e.target.checked);
                }}
            />{" "}
            Auto Confirm
            <br />
        </div>
    );
};

export default AutoConfirmCheckbox;
