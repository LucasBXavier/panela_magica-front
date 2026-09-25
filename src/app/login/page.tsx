import LoginForm from "@/features/auth/components/LoginForm";

export default async function Login(props: PageProps<"/login">) {
  const { next } = await props.searchParams;
  return <LoginForm next={typeof next === "string" ? next : undefined} />;
}
