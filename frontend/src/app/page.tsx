import Link from "next/link";

export default function Home() {
  return (
    <main>
      <button className="btn btn-primary">
        <Link href="/register">Register</Link>
      </button>
    </main>
  );
}
