import React from "react";
import { Button as BsButton } from "react-bootstrap";

export function Button({ label = "", iconClass = "", iconPosition = "", ...props }) {   
    return (
        <BsButton {...props}>
            {iconClass && iconPosition === "left" && <em className={`icon ni ni-${iconClass}`} />}
            {label && <span>{label}</span>}
            {iconClass && iconPosition === "right" && <em className={`icon ni ni-${iconClass}`} />}
        </BsButton>
    );
}