import { User } from "@prisma/client";
import React from "react";
interface ResidentialInfoProps {
  user: User;
  className?: string;
}
const ResidentialInfo = ({ user }: ResidentialInfoProps) => {
  return (
    <div className="grid grid-cols-[300px_1fr] items-center gap-4">
      {/* flat no. */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Flat No., Floor No., Building Name:
      </small>
      <small className="text-[15px] font-medium leading-none">
        {user.address?.residence}
      </small>
      {/* street */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Street:
      </small>
      <small className="text-[15px] font-medium leading-none">
        {user.address?.street}
      </small>
      {/* landmark */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Landmark:
      </small>
      <small className="text-[15px] font-medium leading-none">
        {user.address?.landmark}
      </small>
      {/* city */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        City, State:
      </small>
      <small className="text-[15px] font-medium leading-none">
        {user.address?.city}, {user.address?.province}
      </small>
      {/* postal code */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Postal Code:
      </small>
      <small className="text-[15px] font-medium leading-none">
        {user.address?.postalCode}
      </small>
    </div>
  );
};

export default ResidentialInfo;
