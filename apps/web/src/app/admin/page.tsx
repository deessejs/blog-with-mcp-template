import Link from "next/link";

export default function AdminPage() {
  return <main className="mx-auto max-w-3xl p-8"><h1 className="text-3xl font-bold">Blog administration</h1><p className="mt-4">Administrator workspace for managing article drafts and publishing.</p><p className="mt-2">Draft editing and publishing actions are being built on the database article model.</p><Link className="mt-6 inline-block underline" href="/">View public blog</Link></main>;
}
