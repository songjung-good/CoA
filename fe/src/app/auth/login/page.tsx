import { SignIn } from "@/components/SignIn";

export default function LoginPage() {
  return (
    <main>
      <h1>LoginPage</h1>
      <div className="felx felx-col">
        <button>github</button>
        <SignIn />
        <p></p>
        <button>google</button>
      </div>
    </main>
  );
}
