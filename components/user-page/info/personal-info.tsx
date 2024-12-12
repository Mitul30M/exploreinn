import { User } from "@prisma/client";
import { differenceInYears, format } from "date-fns";
import React from "react";

interface PersonalInfoProps {
  user: User;
  className?: string;
}

const PersonalInfo = ({ user, ...props }: PersonalInfoProps) => {
  return (
    <div className="grid grid-cols-[300px_1fr] items-center gap-4" {...props}>
      {/* name */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Legal Name:
      </small>
      <small className="text-[15px] font-medium leading-none">
        {user.firstName} {user.lastName}
      </small>
      {/* email */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Email Address:
      </small>
      <small className="text-[15px] font-medium leading-none">
        {user.email}
      </small>
      {/* phone */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Phone No.:
      </small>
      <small className="text-[15px] font-medium leading-none">
        {user.phoneNo}
      </small>
      {/* DOB */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Date of Birth:
      </small>
      <small className="text-[15px] font-medium leading-none">
        {format(user.dob!, "MMM dd, yyyy")}
      </small>
      {/* age */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Age:
      </small>
      <small className="text-[15px] font-medium leading-none">
        {differenceInYears(new Date(), user.dob!)}
      </small>

      {/* gender */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Gender:
      </small>
      <small className="text-[15px] font-medium leading-none">{user.gender}</small>
      {/* country */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Legal Citizen of:
      </small>
      <small className="text-[15px] font-medium leading-none">{user.country}</small>
    </div>
  );
};

export default PersonalInfo;
