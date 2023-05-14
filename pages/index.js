import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    const input = event.target.elements.input.value;
    router.push(`/${input}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="input" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
