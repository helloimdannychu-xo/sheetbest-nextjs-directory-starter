import Head from "next/head";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home({ initialItems: initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(9);
  const [limit, setLimit] = useState(9);
  const fetchItems = async () => {
    fetch(
      `https://sheet.best/api/sheets/0eb3cdfe-e246-4513-98b7-e25ffd4388e3?_limit=${limit}&_offset=${offset}`
    )
      .then((response) => response.json())
      .then((data) => {
        setItems([...items, ...data]);
        setOffset(offset + limit);
        if (data.length < limit) {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      <Head>
        <title>Discover awesome tools</title>
        <meta name="description" content="Discover awesome tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mt-16 mb-16 text-center">
          Discover awesome tools
        </h1>
        <InfiniteScroll
          dataLength={items.length}
          next={fetchItems}
          hasMore={hasMore}
          className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8"
          loader={<h4 className="text-center">Loading...</h4>}
        >
          {items?.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </InfiniteScroll>
        <div
          onClick={() =>
            window.open("https://sheet.best/?ref=seo_template", "_blank")
          }
          style={{ background: "#ffffff95" }}
          className="text-md fixed inset-x-0 bottom-10 mx-auto w-fit cursor-pointer rounded-3xl border-1 px-12 py-2 font-medium text-zinc-900 backdrop-blur"
        >
          <p>
            Proudly built using{" "}
            <span className="font-semibold text-emerald-600">Sheet.best</span>
          </p>
        </div>
      </main>
    </>
  );
}

export const ItemCard = ({ item }) => {
  const { title, image, id, description, slug } = item;
  const router = useRouter();
  return (
    <div key={id} id={id}>
      <div
        onClick={() => router.push(`/item/${slug}`)}
        className="mb-4 hover:bg-zinc-100 cursor-default rounded-md border-1 bg-zinc-50 px-2 py-2 backdrop-blur hover:bg-product-card-hover sm:mr-2"
      >
        <img src={image} alt={title} />
        <div className="flex justify-between pt-2">
          <span className="text-md mb-0 text-left font-bold text-zinc-900 ">
            {title}
          </span>
        </div>
        <p className="pt-2 text-left text-sm text-zinc-700">
          {description?.length > 100
            ? description?.substring(0, 100) + "..."
            : description}
        </p>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const res = await fetch(
    `https://sheet.best/api/sheets/${process.env.SHEETBEST_CONNECTION_ID}?_limit=9&_offset=0`
  );
  let items = [];
  if (res.status === 200) {
    items = await res.json();
  } else if (res.status === 404) {
    console.error(
      "Error: Unauthenticated. Please change your sheetbest connection url in the '.env' file"
    );
  }
  return {
    props: { initialItems: items },
  };
}
