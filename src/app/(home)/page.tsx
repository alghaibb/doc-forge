import { LogoutButton } from "@/components/logout-button";
import { getSession } from "@/lib/session";

export default async function Page() {
  const session = await getSession();
  const user = session?.user;

  return (
    <div>
      <h1>Hello {user?.name}</h1>
      <p>ID: {user?.id}</p>
      <p>Email: {user?.email}</p>
      <p>Verified: {user?.emailVerified ? "Yes" : "No"}</p>
      <p>Created At: {user?.createdAt?.toLocaleString()}</p>
      <p>Updated At: {user?.updatedAt?.toLocaleString()}</p>
      <LogoutButton />
    </div>
  );
}
