import React from 'react'

const ResidentialInfo = () => {
  return (
    <div className="grid grid-cols-[300px_1fr] items-center gap-4">
      {/* flat no. */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Flat No., Floor No., Building Name:
      </small>
      <small className="text-[15px] font-medium leading-none">
        103, 1st Floor, Dream Apartments
      </small>
      {/* street */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Street:
      </small>
      <small className="text-[15px] font-medium leading-none">
        Saint Merry's Rd.
      </small>
      {/* landmark */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Landmark:
      </small>
      <small className="text-[15px] font-medium leading-none">
        Besides St. Jacob's Church
      </small>
      {/* city */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        City, State:
      </small>
      <small className="text-[15px] font-medium leading-none">
        Mumbai, Maharashtra
      </small>
      {/* postal code */}
      <small className="text-sm font-medium leading-none text-accent-foreground/70">
        Postal Code:
      </small>
      <small className="text-[15px] font-medium leading-none">400001</small>
    </div>
  );
}

export default ResidentialInfo