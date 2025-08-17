import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const { id } = router.query;

  return <h1>Product ID: {id}</h1>;
}
