import React from 'react'

const PersonalInfo = () => {
  return (
    <div className="grid grid-cols-[300px_1fr] items-center gap-4">
      {/* name */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Legal Name:
      </small>
      <small className="text-[15px] font-medium leading-none">
        Mitul Mungase
      </small>
      {/* email */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Email Address:
      </small>
      <small className="text-[15px] font-medium leading-none">
        mitul30m@icloud.com
      </small>
      {/* phone */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Phone No.:
      </small>
      <small className="text-[15px] font-medium leading-none">
        +91-9970399623
      </small>
      {/* DOB */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Date of Birth:
      </small>
      <small className="text-[15px] font-medium leading-none">
        30th Jan 2005
      </small>
      {/* age */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Age:
      </small>
      <small className="text-[15px] font-medium leading-none">20</small>
      {/* gender */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Gender:
      </small>
      <small className="text-[15px] font-medium leading-none">Male</small>
      {/* country */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Legal Citizen of:
      </small>
      <small className="text-[15px] font-medium leading-none">India</small>
    </div>
  );
}

export default PersonalInfo