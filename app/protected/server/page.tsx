import { auth, currentUser } from "@clerk/nextjs/server";

async function ServerPage() {
  const { userId, sessionClaims, ...authInfo } = await auth();
  const user = await currentUser();

  // console.log(authInfo, "\n", userId, "\n\n");
  console.log(user);
  // console.log("session claims: ", sessionClaims);

  return (
    <main className="flex flex-col w-full gap-6 row-start-2 items-center sm:items-start min-h-screen bg-background border-border/90 border-[1px] max-w-7xl m-auto p-20">
      <h1>Server</h1>
      <p className=" font-bold text-primary">auth()</p>
      <p>
        MongoDB ID:{" "}
        {sessionClaims?.public_metadata
          ? (sessionClaims.public_metadata as PublicMetadataType).userDB_id
          : "No session claims available"}
        isOnboardingComplete:{" "}
        {sessionClaims?.public_metadata
          ? (sessionClaims.public_metadata as PublicMetadataType)
              .onboardingComplete
          : "No session claims available"}
      </p>
      {authInfo &&
        Object.entries(authInfo).map(([key, value]) => (
          <p key={key}>
            <span className="font-bold">{key}:</span>{" "}
            {JSON.stringify(value, null, 2)}
          </p>
        ))}
      <p className="font-bold text-primary">currentUser()</p>
      {user &&
        Object.entries(user).map(([key, value]) => (
          <p key={key}>
            <span className="font-bold">{key}:</span>{" "}
            {JSON.stringify(value, null, 2)}
          </p>
        ))}
    </main>
  );
}

export default ServerPage;
