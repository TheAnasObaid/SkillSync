import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/register" className="btn btn-primary">
        Register
      </Link>
    </main>
  );
}
