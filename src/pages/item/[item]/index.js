import Head from "next/head";
import Link from "next/link";

export default function ItemView({ item }) {
  if (item) {
    return (
      <>
        <Head>
          <title>{item.metaTitle}</title>
          <meta name="description" content={item.metaDescription} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="mt-8 min-h-screen w-screen">
          <div className="m-auto max-w-4xl px-4 pb-16">
            <div className="mb-4 overflow-hidden rounded-lg">
              <img src={item.image} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <h1 className="text-3xl font-semibold text-zinc-800">
                    {item.title}
                  </h1>
                </div>
              </div>
              <p className="text-md text-zinc-700">{item.description}</p>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="h-screen flex justify-center items-center flex-col">
        <h1 className="font-bold text-2xl">Item not found 😬</h1>
        <Link href="/" className="text-emerald-800 font-semibold text-lg mt-2">
          Go to homepage
        </Link>
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { item } = params;
  const res = await fetch(
    `https://sheet.best/api/sheets/${process.env.SHEETBEST_CONNECTION_ID}/query?slug=${item}`
  );
  const itemData = (await res.json())?.[0] || null;
  return {
    props: { item: itemData },
  };
}
