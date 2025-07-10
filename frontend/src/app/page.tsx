import Link from "next/link";

export default function Home() {
  return (
    <main className="space-x-3">
      <Link href="/register" className="btn btn-primary">
        Register
      </Link>
      <Link href="/login" className="btn btn-secondary">
        Login
      </Link>
    </main>
  );
}
